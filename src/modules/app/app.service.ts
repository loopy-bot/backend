import { App } from './entities/app.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plugin } from 'src/modules/plugins/entities/plugin.entity';
import { Friend } from 'src/modules/wx-resource/entities/friend.entity';
import { Room } from 'src/modules/wx-resource/entities/room.entity';
import { In, Repository } from 'typeorm';
import { Qwen } from '../model/qwen.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(App)
    private readonly appRepository: Repository<App>,

    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,

    @InjectRepository(Room)
    private roomRepository: Repository<Room>,

    @InjectRepository(Plugin)
    private pluginRepository: Repository<Plugin>,
  ) {}

  async findAll(): Promise<App[]> {
    return this.appRepository.find();
  }

  async findOne(id: string): Promise<App> {
    const res = await this.appRepository.findOneBy({ id });
    return res;
  }

  async create(app: App): Promise<App> {
    return this.appRepository.save(app);
  }

  // 将应用绑定到多个好友
  async bindAppToFriends(appId: string, friendIds: string[]): Promise<App> {
    const app = await this.appRepository.findOneOrFail({ where: { id: appId }, relations: ['friends'] });
    const friends = await this.friendRepository.find({ where: { id: In(friendIds) } });

    app.friends = [...app.friends, ...friends];
    return this.appRepository.save(app);
  }

  // 将应用绑定到多个群组
  async bindAppToRooms(appId: string, roomIds: string[]): Promise<App> {
    const app = await this.appRepository.findOneOrFail({ where: { id: appId }, relations: ['rooms'] });
    const rooms = await this.roomRepository.find({ where: { id: In(roomIds) } });
    app.rooms = [...app.rooms, ...rooms];
    return this.appRepository.save(app);
  }

  // 给应用绑定插件
  async bindAppToPlugins(appId: string, pluginIds: string[]): Promise<App> {
    const app = await this.appRepository.findOneOrFail({ where: { id: appId }, relations: ['plugins'] });
    const plugins = await this.pluginRepository.find({ where: { id: In(pluginIds) } });
    app.plugins = [...app.plugins, ...plugins];
    return this.appRepository.save(app);
  }

  async update(id: string, app: App): Promise<App> {
    const existingData = await this.findOne(id);
    if (!existingData) {
      throw new HttpException(`${id} not found`, 404);
    }
    await this.appRepository.update(id, app);
    return this.appRepository.findOneBy({ id });
  }

  async delete(id: string): Promise<boolean> {
    const existingData = await this.findOne(id);
    if (!existingData) {
      throw new HttpException(`${id} not found`, 404);
    }
    const res = await this.appRepository.delete(id);
    return !!res;
  }

  async getIntent(app: App, text: string) {
    const qwen = new Qwen(app.personality);
    const pluginTypes = app.plugins.map((i) => i.type);
    const intentType = await qwen.genarate(
      `请你根据用户问题推测用户意图，意图是固定的，只有如下几个：${pluginTypes}，如果用户意图属于这其中一个。那就把这个值单独返回出来，否则就返回null。问题如下：${text}`,
    );
    return intentType;
  }

  async reply(app: App, id: string, text: string) {
    const qwen = new Qwen(app.personality);
    const intent = await this.getIntent(app, text);
    const plugin = app.plugins.find((i) => i.type === intent);
    if (plugin) {
      return plugin.reply(text);
    } else {
      return new Promise((resolve) => {
        qwen.chat(id, text, resolve);
      });
    }
  }
}
