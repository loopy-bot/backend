import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PluginsService } from './plugins.service';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import { ReplyDto } from './dto/reply.dto';

@Controller('plugins')
export class PluginsController {
  @Inject()
  private pluginsService: PluginsService;

  // 新增插件
  @Post('create')
  async create(@Body() createPluginDto: CreatePluginDto) {
    return this.pluginsService.create(createPluginDto);
  }

  // 删除插件
  @Post('delete')
  async delete(@Body('id') id: string) {
    return this.pluginsService.delete(id);
  }

  // 修改插件
  @Post('update')
  async update(@Body() updatePluginDto: UpdatePluginDto) {
    return this.pluginsService.update(updatePluginDto);
  }

  // 根据id获取单个插件
  @Post('detail')
  async findOne(@Body('id') id: string) {
    return this.pluginsService.findOne(id);
  }

  // 获取全部的插件
  @Post('list')
  async findAll() {
    return this.pluginsService.findAll();
  }

  // 调用其他的服务
  @Post('reply')
  async reply(@Body() replyDto: ReplyDto) {
    return this.pluginsService.reply(replyDto);
  }
}
