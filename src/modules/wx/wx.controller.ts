import { Body, Controller, Get, Post } from '@nestjs/common';
import { WxService } from './wx.service';

import { Room } from './entities/room.entity';
import { Friend } from './entities/friend.entity';

import { PaginationWxResourceDto } from './dto/pagination-wx-resource.dto';
import { FrientDto } from './dto/wx-resource.dto';
import { AppService } from '../app/app.service';

@Controller('wx')
export class WxController {
  constructor(
    private readonly wxService: WxService,
    private readonly appService: AppService,
  ) {}

  @Post('resource/upload')
  async upload(@Body() body: { rooms: Room[]; friends: Friend[] }) {
    const { rooms, friends } = body;
    await Promise.all([this.wxService.saveRooms(rooms), this.wxService.saveFriends(friends)]);
    return 'ok';
  }
  @Post('resource/friends/list')
  findAllFriends(@Body() body: PaginationWxResourceDto) {
    const { name, wxId, ...pagnation } = body;
    return this.wxService.findAllFriends(pagnation, { name, wxId });
  }

  // 获取所有群聊
  @Post('resource/rooms/list')
  findAllRooms(@Body() body: PaginationWxResourceDto) {
    const { name, wxId, ...pagnation } = body;
    return this.wxService.findAllRooms(pagnation, { name, wxId });
  }

  // 根据ID获取朋友
  @Post('resource/friends/detail')
  findFriendById(@Body('id') id: string) {
    return this.wxService.findFriendById(id);
  }

  // 根据ID获取群聊
  @Post('resource/rooms/detail')
  findRoomById(@Body('id') id: string) {
    return this.wxService.findRoomById(id);
  }

  // 添加朋友
  @Post('resource/friends/create')
  addFriend(@Body() friendData: Partial<Friend>) {
    return this.wxService.addFriend(friendData);
  }

  // 添加群聊
  @Post('resource/rooms/create')
  addRoom(@Body() roomData: Partial<Room>): Promise<Room> {
    return this.wxService.addRoom(roomData);
  }

  // 删除朋友
  @Post('resource/friends/delete')
  deleteFriendById(@Body('id') id: string): Promise<void> {
    return this.wxService.deleteFriendById(id);
  }

  // 删除群聊
  @Post('resource/rooms/delete')
  deleteRoomById(@Body('id') id: string): Promise<void> {
    return this.wxService.deleteRoomById(id);
  }
  // 更新朋友
  @Post('resource/friends/edit')
  updateFriend(@Body('id') id: string, @Body() updateData: FrientDto): Promise<Friend> {
    return this.wxService.updateFriend(id, updateData);
  }

  // 更新群聊
  @Post('resource/rooms/edit')
  updateRoom(@Body('id') id: string, @Body() updateData: Room): Promise<Room> {
    return this.wxService.updateRoom(id, updateData);
  }

  @Post('message')
  async onMessage(@Body() body: { roomId: string; friendId: string; question: string }) {
    const { roomId, friendId, question } = body;
    const { findAppByFriendWxId, findAppByRoomWxId } = this.wxService;
    const app = roomId === 'person' ? await findAppByFriendWxId(friendId) : await findAppByRoomWxId(roomId);
    return this.appService.reply(roomId + friendId, app, question);
  }

  @Post('task/list')
  async getTasks() {
    const { friends, rooms } = await this.wxService.findAllTasks();

    const friendTasks = friends.filter((i) => i.tasks?.length).map((i) => i.tasks);
    const roomTasks = rooms.filter((i) => i.tasks?.length).map((i) => i.tasks);
    return {
      friendTasks: friendTasks.flat(),
      roomTasks: roomTasks.flat(),
    };
  }
}
