import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { App } from 'src/modules/app/entities/app.entity';
import { Room } from './entities/room.entity';
import { PaginationParams, pagingQuery } from 'src/utils/pagingQuery';
import { Task } from '../task/entities/task.entity';

@Injectable()
export class WxService {
  @InjectRepository(Friend)
  private friendRepository: Repository<Friend>;

  @InjectRepository(Room)
  private roomRepository: Repository<Room>;

  @InjectRepository(App)
  private appRepository: Repository<App>;
  @InjectRepository(Task)
  private taskRepository: Repository<Task>;

  // 批量保存朋友
  async saveRooms(rooms: Room[]) {
    const arr = await this.roomRepository.find();
    const newRooms = rooms.filter((i) => !arr.map((i) => i.wxId).includes(i.wxId));
    if (newRooms.length) {
      await this.roomRepository.save(newRooms);
    }
    return 'ok';
  }

  // 批量保存朋友
  async saveFriends(friends: Friend[]) {
    const arr = await this.friendRepository.find();
    const newFriends = friends.filter((i) => !arr.map((i) => i.wxId).includes(i.wxId));

    if (newFriends.length) {
      this.friendRepository.save(newFriends);
    }
    return 'ok';
  }
  //
  // 查询所有朋友
  async findAllFriends(paginationParams: PaginationParams, conditions: { name: string; wxId: string } = {} as any) {
    // 准备查询条件
    const queryConditions: any = {};

    if (conditions.name) {
      queryConditions.name = Like(`%${conditions.name}%`);
    }
    if (conditions.wxId) {
      queryConditions.wxId = conditions.wxId;
    }
    const res = await pagingQuery(paginationParams, queryConditions, this.friendRepository);
    return res;
  }
  // 查询所有群聊
  async findAllRooms(paginationParams: PaginationParams, conditions: { name: string; wxId: string } = {} as any) {
    // 准备查询条件
    const queryConditions: any = {};
    if (conditions.name) {
      queryConditions.name = Like(`%${conditions.name}%`);
    }
    if (conditions.wxId) {
      queryConditions.wxId = conditions.wxId;
    }
    const res = await pagingQuery(paginationParams, queryConditions, this.roomRepository);
    return res;
  }

  async findAllTasks() {
    const friendsWithTasks = await this.friendRepository.find({
      relations: ['tasks'], // 加载 tasks 关系
    });

    const roomsWithTasks = await this.roomRepository.find({
      relations: ['tasks'], // 加载 tasks 关系
    });

    return {
      friends: friendsWithTasks,
      rooms: roomsWithTasks,
    };
  }
  // 根据ID查询单个朋友
  async findFriendById(id: string): Promise<Friend> {
    return this.friendRepository.findOne({ where: { id }, relations: ['app', 'tasks'] });
  }
  // 根据ID查询单个群聊
  async findRoomById(id: string): Promise<Room> {
    return this.roomRepository.findOne({ where: { id }, relations: ['app', 'tasks'] });
  }

  async findAppByFriendWxId(wxId: string): Promise<App> {
    const friend = await this.friendRepository.findOne({
      where: { wxId },
      relations: ['app'], // 确保加载了关联的 App 实体
    });

    if (!friend) {
      throw new Error('Friend not found');
    }

    return friend.app;
  }
  async findAppByRoomWxId(wxId: string): Promise<App> {
    const room = await this.roomRepository.findOne({
      where: { wxId },
      relations: ['app'], // 确保加载了关联的 App 实体
    });

    if (!room) {
      throw new Error('Friend not found');
    }

    return room.app;
  }

  async bindTaskToFriendOrRoom(id: string, taskIds: string[], type: 'friend' | 'room') {
    const entity =
      type === 'friend'
        ? await this.friendRepository.findOne({ where: { id }, relations: ['tasks'] })
        : await this.roomRepository.findOne({ where: { id }, relations: ['tasks'] });
    if (!entity) {
      throw new NotFoundException(`${type} not found`);
    }
    // 从数据库中查找所有新任务
    const newTasks = await this.taskRepository.findBy({ id: In(taskIds) });

    // 更新实体的任务列表
    entity.tasks = newTasks;
    // 保存更新后的实体
    if (type === 'friend') {
      await this.friendRepository.save(entity);
    } else {
      await this.roomRepository.save(entity);
    }

    return entity;
  }
  async bindAppToFriendOrRoom(id: string, appId: string, type: 'friend' | 'room') {
    const entity =
      type === 'friend'
        ? await this.friendRepository.findOne({ where: { id }, relations: ['app'] })
        : await this.roomRepository.findOne({ where: { id }, relations: ['app'] });

    if (!entity) {
      throw new NotFoundException(`${type} not found`);
    }

    const app = await this.appRepository.findOneBy({ id: appId });
    if (!app) {
      throw new NotFoundException(`app not found`);
    }
    entity.app = app;
    type === 'friend' ? await this.friendRepository.save(entity) : await this.roomRepository.save(entity);
    return entity;
  }

  // 添加一个朋友
  // async addFriend(friendData: Partial<Friend>): Promise<Friend> {
  //   const friend = this.friendRepository.create(friendData);
  //   return this.friendRepository.save(friend);
  // }

  // // 添加一个群聊
  // async addRoom(roomData: Partial<Room>): Promise<Room> {
  //   const room = this.roomRepository.create(roomData);
  //   return this.roomRepository.save(room);
  // }

  // // 删除一个朋友
  // async deleteFriendById(id: string): Promise<void> {
  //   const result = await this.friendRepository.delete(id);
  //   if (result.affected === 0) {
  //     throw new Error('Friend not found');
  //   }
  // }

  // // 删除一个群聊
  // async deleteRoomById(id: string): Promise<void> {
  //   const result = await this.roomRepository.delete(id);
  //   if (result.affected === 0) {
  //     throw new Error('Room not found');
  //   }
  // }

  // // 更新一个朋友
  // async updateFriend(id: string, updateData: Partial<Friend>): Promise<Friend> {
  //   await this.friendRepository.update(id, updateData);
  //   const updatedFriend = await this.friendRepository.findOneBy({ id });
  //   if (!updatedFriend) {
  //     throw new Error('Friend not found');
  //   }
  //   return updatedFriend;
  // }

  // // 更新一个群聊
  // async updateRoom(id: string, updateData: Partial<Room>): Promise<Room> {
  //   await this.roomRepository.update(id, updateData);
  //   const updatedRoom = await this.roomRepository.findOneBy({ id });
  //   if (!updatedRoom) {
  //     throw new Error('Room not found');
  //   }
  //   return updatedRoom;
  // }
}
