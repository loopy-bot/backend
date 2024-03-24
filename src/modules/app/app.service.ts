import { App } from './entities/app.entity';
import { Injectable, HttpException, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plugin } from 'src/modules/plugins/entities/plugin.entity';
import { Friend } from 'src/modules/wx/entities/friend.entity';
import { Room } from 'src/modules/wx/entities/room.entity';
import { In, Repository } from 'typeorm';
import { Model } from '../../services/model.service';
import { PluginsService } from '../plugins/plugins.service';
import { AppDto } from './dto/app.dto';

@Injectable()
export class AppService {
  @InjectRepository(App)
  private readonly appRepository: Repository<App>;

  @InjectRepository(Friend)
  private friendRepository: Repository<Friend>;

  @InjectRepository(Room)
  private roomRepository: Repository<Room>;

  @InjectRepository(Plugin)
  private pluginRepository: Repository<Plugin>;

  @Inject(PluginsService)
  private readonly pluginsService: PluginsService;

  // 获取所有应用
  async findAll(): Promise<App[]> {
    return this.appRepository.find();
  }

  // 根据id查找应用以及绑定的数据
  async findOne(id: string): Promise<App> {
    const res = await this.appRepository.findOne({ where: { id }, relations: ['plugins', 'friends', 'rooms'] });

    return res;
  }

  // 创建应用
  async create(app: AppDto): Promise<App> {
    return this.appRepository.save(app);
  }

  // 更新应用
  async update(id: string, app: AppDto): Promise<App> {
    const existingData = await this.findOne(id);
    if (!existingData) {
      throw new HttpException(`${id} not found`, 404);
    }
    await this.appRepository.update(id, app);
    return this.appRepository.findOneBy({ id });
  }

  // 删除应用
  async delete(id: string): Promise<boolean> {
    const existingData = await this.findOne(id);
    if (!existingData) {
      throw new HttpException(`${id} not found`, 404);
    }
    const res = await this.appRepository.delete(id);
    return !!res;
  }

  private async bindToApp<T>(
    appId: string,
    entityIds: string[] = [],
    entityRepository: Repository<T>,
    relationKey: string,
  ): Promise<App> {
    const app = await this.appRepository.findOneOrFail({
      where: { id: appId },
      relations: [relationKey],
    });

    if (!app) {
      throw new NotFoundException(`App with ID ${appId} not found`);
    }

    // 这里使用了 Partial<T>[] 作为类型注解，因为我们不需要整个实体的所有属性
    const entities: Partial<T>[] = await entityRepository.find({
      where: { id: In(entityIds) } as any,
    });

    if (!entities.length) {
      throw new NotFoundException(`${relationKey} with IDs ${entityIds?.join(', ')} not found`);
    }

    // 使用现有的关系字段或默认到空数组，避免重复添加相同的实体
    app[relationKey] = [...app[relationKey], ...entities];

    return this.appRepository.save(app);
  }

  // 将应用绑定到多个好友
  async bindFriendToApp(id: string, friendIds: string[]): Promise<App> {
    return this.bindToApp(id, friendIds, this.friendRepository, 'friends');
  }

  // 将应用绑定到多个群组
  async bindRoomsToApp(id: string, roomIds: string[]): Promise<App> {
    return this.bindToApp(id, roomIds, this.roomRepository, 'rooms');
  }

  // 给应用绑定插件
  async bindPluginToApp(id: string, pluginIds: string[]): Promise<App> {
    return this.bindToApp(id, pluginIds, this.pluginRepository, 'plugins');
  }

  // 根据用户问题推测用户意图
  async getIntent(app: App, text: string) {
    const pluginTypes = app.plugins.map((i) => i.type);
    const intentType = Model.genarate({
      model: app.model,
      personality: app.personality,
      question: `请你根据用户问题推测用户意图，意图是固定的，只有如下几个：${pluginTypes}，如果用户意图属于这其中一个。那就把这个值单独返回出来，否则就返回null。问题如下：${text}`,
    });
    return intentType;
  }

  // 应用回复
  async reply(key, app: App, text: string) {
    let data;
    const intent = await this.getIntent(app, text);
    const plugin = app.plugins.find((i) => i.type === intent);

    if (plugin) {
      data = this.pluginsService.reply(text, plugin.id);
    } else {
      data = Model.chat({
        model: app.model,
        personality: app.personality,
        question: text,
        key,
      });
    }
    data = await data;
    return data;
  }
}
