import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WxService } from './wx.service';

import { Room } from './entities/room.entity';
import { Friend } from './entities/friend.entity';

import { PaginationWxResourceDto } from './dto/pagination-wx-resource.dto';
import {
  BindAppDto,
  BindTaskDto,
  FrientDto,
  GetFriendDetailDto,
  GetRoomDetailDto,
  MessageDto,
} from './dto/wx-resource.dto';
import { AppService } from '../app/app.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('微信资源管理')
@Controller('wx')
export class WxController {
  constructor(
    private readonly wxService: WxService,
    private readonly appService: AppService,
  ) {}

  @ApiOperation({ summary: '上传微信资源' })
  @Post('resource/upload')
  async upload(@Body() body: { rooms: Room[]; friends: Friend[] }) {
    const { rooms, friends } = body;
    await Promise.all([this.wxService.saveRooms(rooms), this.wxService.saveFriends(friends)]);
    return 'ok';
  }

  @ApiOperation({ summary: '获取所有朋友' })
  @Post('resource/friends/list')
  findAllFriends(@Body() body: PaginationWxResourceDto) {
    const { name, wxId, ...pagnation } = body;
    return this.wxService.findAllFriends(pagnation, { name, wxId });
  }

  // 获取所有群聊
  @ApiOperation({ summary: '获取所有群聊' })
  @Post('resource/rooms/list')
  findAllRooms(@Body() body: PaginationWxResourceDto) {
    const { name, wxId, ...pagnation } = body;
    return this.wxService.findAllRooms(pagnation, { name, wxId });
  }

  // 根据ID获取朋友
  @ApiOperation({ summary: '根据ID获取朋友详细' })
  @ApiBody({ type: GetFriendDetailDto })
  @Post('resource/friends/detail')
  findFriendById(@Body() { id }: GetFriendDetailDto) {
    return this.wxService.findFriendById(id);
  }

  // 根据ID获取群聊
  @ApiOperation({ summary: '根据ID获取群聊详细' })
  @ApiBody({ type: GetRoomDetailDto })
  @Post('resource/rooms/detail')
  findRoomById(@Body() { id }: GetRoomDetailDto) {
    return this.wxService.findRoomById(id);
  }

  @ApiOperation({ summary: '机器人消息' })
  @ApiBody({ type: MessageDto })
  @Post('message')
  async onMessage(@Body() { key, question }: MessageDto) {
    const [roomId, friendId] = key.split('_');
    const { findAppByFriendWxId, findAppByRoomWxId } = this.wxService;
    const app = key.includes('person') ? await findAppByFriendWxId(friendId) : await findAppByRoomWxId(roomId);
    return this.appService.reply(key, app, question);
  }

  @ApiOperation({ summary: '获取任务列表' })
  @Post('task/list')
  async getTasks() {
    const { friends, rooms } = await this.wxService.findAllTasks();

    const friendTasks = friends
      .filter((i) => i.tasks?.length)
      .map((i) =>
        i.tasks.map((task) => {
          return {
            wxId: i.wxId,
            ...task,
          };
        }),
      );
    const roomTasks = rooms
      .filter((i) => i.tasks?.length)
      .map((i) =>
        i.tasks.map((task) => {
          return {
            wxId: i.wxId,
            ...task,
          };
        }),
      );
    return {
      friendTasks: friendTasks.flat(),
      roomTasks: roomTasks.flat(),
    };
  }

  @ApiOperation({ summary: '绑定定时任务' })
  @ApiBody({ type: BindTaskDto })
  @ApiParam({ name: 'type', description: 'friend or room', enum: ['friend', 'room'] })
  @Post(':type/task/bind')
  async bindTask(@Param('type') type, @Body() { id, taskIds }: BindTaskDto) {
    if (type === 'friend') return this.wxService.bindTaskToFriendOrRoom(id, taskIds, type);
    return this.wxService.bindTaskToFriendOrRoom(id, taskIds, type);
  }

  @ApiOperation({ summary: '绑定应用' })
  @ApiParam({ name: 'type', description: 'friend or room', enum: ['friend', 'room'] })
  @ApiBody({ type: BindAppDto })
  @Post(':type/app/bind')
  async bindApp(@Param('type') type, @Body() { id, appId }: BindAppDto) {
    if (type === 'friend') return this.wxService.bindAppToFriendOrRoom(id, appId, 'friend');
    return this.wxService.bindAppToFriendOrRoom(id, appId, 'room');
  }
  // // 添加朋友
  // @ApiOperation({ summary: '添加朋友' })
  // @Post('resource/friends/create')
  // addFriend(@Body() friendData: Partial<Friend>) {
  //   return this.wxService.addFriend(friendData);
  // }

  // // 添加群聊
  // @ApiOperation({ summary: '添加群聊' })
  // @Post('resource/rooms/create')
  // addRoom(@Body() roomData: Partial<Room>): Promise<Room> {
  //   return this.wxService.addRoom(roomData);
  // }

  // // 删除朋友
  // @ApiOperation({ summary: '删除朋友' })
  // @Post('resource/friends/delete')
  // deleteFriendById(@Body('id') id: string): Promise<void> {
  //   return this.wxService.deleteFriendById(id);
  // }

  // // 删除群聊
  // @ApiOperation({ summary: '删除群聊' })
  // @Post('resource/rooms/delete')
  // deleteRoomById(@Body('id') id: string): Promise<void> {
  //   return this.wxService.deleteRoomById(id);
  // }
  // // 更新朋友
  // @ApiOperation({ summary: '更新朋友' })
  // @Post('resource/friends/edit')
  // updateFriend(@Body('id') id: string, @Body() updateData: FrientDto): Promise<Friend> {
  //   return this.wxService.updateFriend(id, updateData);
  // }

  // // 更新群聊
  // @ApiOperation({ summary: '更新群聊' })
  // @Post('resource/rooms/edit')
  // updateRoom(@Body('id') id: string, @Body() updateData: Room): Promise<Room> {
  //   return this.wxService.updateRoom(id, updateData);
  // }
}
