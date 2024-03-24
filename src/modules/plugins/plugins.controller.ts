import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PluginsService } from './plugins.service';

import { DeletePluginDto, GetPluginDetailDto, PluginDto, UpdatePluginDto } from './dto/plugin.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('插件管理')
@Controller('plugin')
export class PluginsController {
  @Inject()
  private pluginsService: PluginsService;

  // 新增插件
  @ApiOperation({ summary: '新增插件' })
  @Post('create')
  async create(@Body() plugin: PluginDto) {
    return this.pluginsService.create(plugin);
  }

  // 删除插件
  @ApiOperation({ summary: '删除插件' })
  @ApiBody({ type: DeletePluginDto })
  @Post('delete')
  async delete(@Body() { id }: DeletePluginDto) {
    return this.pluginsService.delete(id);
  }

  // 修改插件
  @ApiOperation({ summary: '修改插件' })
  @ApiBody({ type: UpdatePluginDto })
  @Post('update')
  async update(@Body() { id, ...plugin }: UpdatePluginDto) {
    return this.pluginsService.update(id, plugin);
  }

  // 根据id获取单个插件
  @ApiOperation({ summary: '获取单个插件' })
  @ApiBody({ type: GetPluginDetailDto })
  @Post('detail')
  async findOne(@Body() { id }: GetPluginDetailDto) {
    return this.pluginsService.findOne(id);
  }

  // 获取全部的插件
  @ApiOperation({ summary: '获取全部插件' })
  @Post('list')
  async findAll() {
    return this.pluginsService.findAll();
  }
}
