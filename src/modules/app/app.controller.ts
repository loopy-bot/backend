import { Controller, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { App } from './entities/app.entity';
import { AppService } from './app.service';
import { AppDto, BindPluginsDto, ChatParamsDto, DeleteAppDto, GetAppDetailDto, UpdateAppDto } from './dto/app.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { KimiModel } from 'src/services/kimi.service';

@ApiTags('应用管理')
@Controller('application')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '获取应用列表' })
  @Post('list')
  async findAll(): Promise<App[]> {
    return this.appService.findAll();
  }

  @ApiOperation({ summary: '获取应用详细' })
  @ApiBody({ type: GetAppDetailDto })
  @Post('detail')
  async findOne(@Body() { id }: GetAppDetailDto): Promise<App> {
    return this.appService.findOne(id);
  }

  @ApiOperation({ summary: '创建应用' })
  @Post('create')
  async create(@Body() app: AppDto) {
    const system = { role: 'system', content: app.personality || '欢迎使用智能助手，请问有什么可以帮助您？' };
    app.session = JSON.stringify([system]);
    return this.appService.create(new AppDto(app));
  }

  @ApiOperation({ summary: '修改应用' })
  @ApiBody({ type: UpdateAppDto })
  @Post('update')
  async update(@Body('id') id, @Body() app: UpdateAppDto): Promise<App> {
    return this.appService.update(id, app);
  }

  @ApiOperation({ summary: '删除应用' })
  @ApiBody({ type: DeleteAppDto })
  @Post('delete')
  async delete(@Body() { id }: DeleteAppDto): Promise<boolean> {
    return this.appService.delete(id);
  }

  @ApiOperation({ summary: '绑定插件' })
  @ApiBody({ type: BindPluginsDto })
  @Post('plugins/bind')
  async bindEntity(@Body() { id: appId, plugins }: BindPluginsDto) {
    return this.appService.bindPluginToApp(appId, plugins);
  }

  @ApiOperation({ summary: '发送消息' })
  @ApiBody({ type: ChatParamsDto })
  @Post('chat')
  async chat(@Body() { id, question, use_search = false }: ChatParamsDto) {
    let session: any[];
    const message = { role: 'user', content: question };
    const app = await this.appService.findOne(id);

    session = JSON.parse(app.session) as any[];
    session.push(message);

    const result = await KimiModel.chat({ messages: session, use_search });
    const response = { role: 'assistant', content: result };
    session.push(response)
    
    const messages = JSON.stringify(session)
    await this.appService.update(id, {...app,session:messages});
   
    return messages;
  }
}
