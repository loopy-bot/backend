import { App } from './entities/app.entity';
import { Injectable, HttpException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plugin } from 'src/modules/plugins/entities/plugin.entity';
import { Friend } from 'src/modules/wx-resource/entities/friend.entity';
import { Room } from 'src/modules/wx-resource/entities/room.entity';
import { In, Repository } from 'typeorm';
import { Qwen } from '../../services/qwen.service';
import { PluginsService } from '../plugins/plugins.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { BindAppToFriendsDto, BindAppToPluginsDto, BindAppToRoomsDto } from './dto/bind-app.dto';
import { GetIntentDto, ReplyDto } from './dto/qwen.dto';
7;
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

  // 动态创建Qwen实例
  private createQwenInstance(personality: string): Qwen {
    return new Qwen(personality);
  }

  // 获取所有应用
  async findAll(): Promise<App[]> {
    return this.appRepository.find();
  }

  // 根据id查找应用
  async findOne(id: string): Promise<App> {
    const res = await this.appRepository.findOneBy({ id });
    return res;
  }

  // 创建应用
  async create(createAppDto: CreateAppDto): Promise<App> {
    return this.appRepository.save(createAppDto);
  }

  // 更新应用
  async update(updateAppDto: UpdateAppDto): Promise<App> {
    const { id: id, ...info } = updateAppDto;
    const existingData = await this.findOne(id);
    if (!existingData) {
      throw new HttpException(`${id} not found`, 404);
    }
    await this.appRepository.update(id, info);
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

  // 将应用绑定到多个好友
  async bindAppToFriends(bindAppToFriendsDto: BindAppToFriendsDto): Promise<App> {
    const { id, friendIds } = bindAppToFriendsDto;
    const app = await this.appRepository.findOneOrFail({ where: { id: id }, relations: ['friends'] });
    const friends = await this.friendRepository.find({ where: { id: In(friendIds) } });

    app.friends = [...app.friends, ...friends];
    return this.appRepository.save(app);
  }

  // 将应用绑定到多个群组
  async bindAppToRooms(bindAppToRoomsDto: BindAppToRoomsDto): Promise<App> {
    const { id, roomIds } = bindAppToRoomsDto;
    const app = await this.appRepository.findOneOrFail({ where: { id: id }, relations: ['rooms'] });
    const rooms = await this.roomRepository.find({ where: { id: In(roomIds) } });
    app.rooms = [...app.rooms, ...rooms];
    return this.appRepository.save(app);
  }

  // 给应用绑定插件
  async bindAppToPlugins(bindAppToPluginsDto: BindAppToPluginsDto): Promise<App> {
    const { id, pluginIds } = bindAppToPluginsDto;
    const app = await this.appRepository.findOneOrFail({ where: { id: id }, relations: ['plugins'] });
    const plugins = await this.pluginRepository.find({ where: { id: In(pluginIds) } });
    app.plugins = [...app.plugins, ...plugins];
    return this.appRepository.save(app);
  }

  // 根据用户问题推测用户意图
  async getIntent(getIntentDto: GetIntentDto) {
    const { id, text } = getIntentDto;
    const app = await this.findOne(id);
    const qwen = this.createQwenInstance(app.personality);
    const pluginTypes = app.plugins.map((i) => i.type);
    const intentType = await qwen.genarate(
      `请你根据用户问题推测用户意图，意图是固定的，只有如下几个：${pluginTypes}，如果用户意图属于这其中一个。那就把这个值单独返回出来，否则就返回null。问题如下：${text}`,
    );
    return intentType;
  }

  // 应用回复
  async reply(replyDto: ReplyDto) {
    const { id, text } = replyDto;
    const app = await this.findOne(id);
    const qwen = this.createQwenInstance(app.personality);
    const intent = await this.getIntent({ id, text });
    const plugin = app.plugins.find((i) => i.type === intent);
    if (plugin) {
      return this.pluginsService.reply({
        pluginId: plugin.id,
        text,
      });
    } else {
      return new Promise((resolve) => {
        qwen.chat(id, text, resolve);
      });
    }
  }
}
