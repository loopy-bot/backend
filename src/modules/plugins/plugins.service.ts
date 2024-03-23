import axios from 'axios';
import { Global, Injectable } from '@nestjs/common';
import { ReplyDto } from './dto/reply.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plugin } from './entities/plugin.entity';
import { Repository } from 'typeorm';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';

@Global()
@Injectable()
export class PluginsService {
  @InjectRepository(Plugin)
  private pluginRepository: Repository<Plugin>;

  // 新增插件
  async create(createPluginDto: CreatePluginDto): Promise<Plugin> {
    return this.pluginRepository.save(createPluginDto);
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
  async update(updatePluginDto: UpdatePluginDto): Promise<Plugin> {
    return this.pluginRepository.save(updatePluginDto);
  }

  // 根据id查找单个插件
  async findOne(id: string): Promise<Plugin> {
    return this.pluginRepository.findOneBy({ id });
  }

  // 查找出所有的插件
  async findAll(): Promise<Plugin[]> {
    return this.pluginRepository.find();
  }

  // 调用其他的服务
  async reply(replyDto: ReplyDto) {
    const { pluginId, text } = replyDto;
    const plugin = await this.findOne(pluginId);
    return axios({
      url: plugin.url,
      method: plugin.method,
      params: { text: text },
      headers: { responseType: plugin.responseType },
    });
  }
}
