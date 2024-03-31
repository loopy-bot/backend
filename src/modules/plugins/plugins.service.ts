import axios from 'axios';
import { Global, HttpException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Plugin } from './entities/plugin.entity';
import { Repository } from 'typeorm';

import { PluginDto } from './dto/plugin.dto';

@Global()
@Injectable()
export class PluginsService {
  @InjectRepository(Plugin)
  private pluginRepository: Repository<Plugin>;

  // 新增插件
  async create(plugin: PluginDto): Promise<Plugin> {
    return this.pluginRepository.save(plugin);
  }

  // 删除插件
  async delete(id: string): Promise<string> {
    const result = await this.pluginRepository.delete(id);
    if (result.affected === 0) {
      return '删除失败';
    }
    return '删除成功';
  }

  // 修改插件
  async update(id: string, plugin: PluginDto): Promise<Plugin> {
    const existingData = await this.findOne(id);
    if (!existingData) {
      throw new HttpException(`${id} not found`, 404);
    }
    await this.pluginRepository.update(id, plugin);
    return this.pluginRepository.findOneBy({ id });
  }

  // 根据id查找单个插件
  async findOne(id: string): Promise<Plugin> {
    return this.pluginRepository.findOneBy({ id });
  }

  // 查找出所有的插件
  async findAll(): Promise<Plugin[]> {
    return this.pluginRepository.find();
  }

  async reply(question: string, plugin: Plugin) {
    console.log(plugin);
    return axios({
      url: plugin.url,
      method: plugin.method,
      data: { question },
    }).then((res) => res.data.data);
  }
}
