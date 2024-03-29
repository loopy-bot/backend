import { Body, Controller, Post } from '@nestjs/common';
import { WxResourceService } from './wx-resource.service';

import { Room } from './entities/room.entity';
import { Friend } from './entities/friend.entity';

@Controller('wx-resource')
export class WxResourceController {
  constructor(private readonly wxResourceService: WxResourceService) {}

  @Post('upload')
  async upload(@Body() body: { rooms: Room[]; friends: Friend[] }) {
    const { rooms, friends } = body;
    await Promise.all([this.wxResourceService.saveRooms(rooms), this.wxResourceService.saveFriends(friends)]);
    return 'ok';
  }
  @Post('friends/list')
  findAllFriends(): Promise<Friend[]> {
    return this.wxResourceService.findAllFriends();
  }

  // 获取所有群聊
  @Post('rooms/list')
  findAllRooms(): Promise<Room[]> {
    return this.wxResourceService.findAllRooms();
  }

  // 根据ID获取朋友
  @Post('friends/detail')
  findFriendById(@Body('id') id: string): Promise<Friend> {
    return this.wxResourceService.findFriendById(id);
  }

  // 根据ID获取群聊
  @Post('rooms/detail')
  findRoomById(@Body('id') id: string): Promise<Room> {
    return this.wxResourceService.findRoomById(id);
  }

  // 添加朋友
  @Post('friends/create')
  addFriend(@Body() friendData: Partial<Friend>): Promise<Friend> {
    return this.wxResourceService.addFriend(friendData);
  }

  // 添加群聊
  @Post('rooms/create')
  addRoom(@Body() roomData: Partial<Room>): Promise<Room> {
    return this.wxResourceService.addRoom(roomData);
  }

  // 删除朋友
  @Post('friends/delete')
  deleteFriendById(@Body('id') id: string): Promise<void> {
    return this.wxResourceService.deleteFriendById(id);
  }

  // 删除群聊
  @Post('rooms/delete')
  deleteRoomById(@Body('id') id: string): Promise<void> {
    return this.wxResourceService.deleteRoomById(id);
  }
  // 更新朋友
  @Post('friends/edit')
  updateFriend(@Body('id') id: string, @Body() updateData: Partial<Friend>): Promise<Friend> {
    return this.wxResourceService.updateFriend(id, updateData);
  }

  // 更新群聊
  @Post('rooms/edit')
  updateRoom(@Body('id') id: string, @Body() updateData: Partial<Room>): Promise<Room> {
    return this.wxResourceService.updateRoom(id, updateData);
  }
}
