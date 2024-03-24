import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PluginsService } from './plugins.service';

import { PluginDto } from './dto/plugin.dto';

@Controller('plugins')
export class PluginsController {
  @Inject()
  private pluginsService: PluginsService;

  // 新增插件
  @Post('create')
  async create(@Body() plugin: PluginDto) {
    return this.pluginsService.create(plugin);
  }

  // 删除插件
  @Post('delete')
  async delete(@Body('id') id: string) {
    return this.pluginsService.delete(id);
  }

  // 修改插件
  @Post('update')
  async update(@Body('id') id: string, @Body() plugin: PluginDto) {
    return this.pluginsService.update(id, plugin);
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
}
