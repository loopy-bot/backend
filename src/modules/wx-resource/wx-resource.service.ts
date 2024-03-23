import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { App } from 'src/modules/app/entities/app.entity';
import { Room } from './entities/room.entity';
import { PaginationParams } from 'src/utils/pagingQuery';

@Injectable()
export class WxResourceService {
  @InjectRepository(Friend)
  private friendRepository: Repository<Friend>;

  @InjectRepository(Room)
  private roomRepository: Repository<Room>;

  // 批量保存朋友
  async saveRooms(rooms: Room[]): Promise<Room[]> {
    return this.roomRepository.save(rooms);
  }

  // 批量保存朋友
  async saveFriends(friends: Friend[]): Promise<Friend[]> {
    return this.friendRepository.save(friends);
  }
  // 添加一个朋友
  async addFriend(friendData: Partial<Friend>): Promise<Friend> {
    const friend = this.friendRepository.create(friendData);
    return this.friendRepository.save(friend);
  }

  // 添加一个群聊
  async addRoom(roomData: Partial<Room>): Promise<Room> {
    const room = this.roomRepository.create(roomData);
    return this.roomRepository.save(room);
  }

  // 删除一个朋友
  async deleteFriendById(id: string): Promise<void> {
    const result = await this.friendRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Friend not found');
    }
  }

  // 删除一个群聊
  async deleteRoomById(id: string): Promise<void> {
    const result = await this.roomRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Room not found');
    }
  }

  // 更新一个朋友
  async updateFriend(id: string, updateData: Partial<Friend>): Promise<Friend> {
    await this.friendRepository.update(id, updateData);
    const updatedFriend = await this.friendRepository.findOneBy({ id });
    if (!updatedFriend) {
      throw new Error('Friend not found');
    }
    return updatedFriend;
  }

  // 更新一个群聊
  async updateRoom(id: string, updateData: Partial<Room>): Promise<Room> {
    await this.roomRepository.update(id, updateData);
    const updatedRoom = await this.roomRepository.findOneBy({ id });
    if (!updatedRoom) {
      throw new Error('Room not found');
    }
    return updatedRoom;
  }
  // 查询所有朋友
  async findAllFriends(
    paginationParams: PaginationParams,
    conditions: { name: string; wxId: string },
  ): Promise<Friend[]> {
    return this.friendRepository.find();
  }
  // 查询所有群聊
  async findAllRooms(): Promise<Room[]> {
    return this.roomRepository.find();
  }
  // 根据ID查询单个朋友
  async findFriendById(id: string): Promise<Friend> {
    return this.friendRepository.findOneBy({ id });
  }
  async findRoomById(id: string): Promise<Room> {
    return this.roomRepository.findOneBy({ id });
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
}
