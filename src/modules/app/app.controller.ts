import { Controller, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { App } from './entities/app.entity';
import { AppService } from './app.service';
import { AppDto, BindPluginsDto, DeleteAppDto, GetAppDetailDto, UpdateAppDto } from './dto/app.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

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
}
