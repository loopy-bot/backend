import { Body, Controller, Post } from '@nestjs/common';
import { WxResourceService } from './wx-resource.service';
import { Room } from './entities/room.entity';
import { Friend } from './entities/friend.entity';
import { App } from 'src/app/entities/app.entity';

@Controller('resource')
export class WxResourceController {
  constructor(private readonly wxResourceService: WxResourceService) {}

  @Post('upload')
  upload(@Body() body: { rooms: Room; friends: Friend }) {
    console.log(body);
  }
  @Post('chat')
  async chat(@Body() body: { friendId: string; roomId: string; text: string }) {
    const { friendId, roomId, text } = body;
    const { findAppByFriendId, findAppByRoomId } = this.wxResourceService;

    // 群聊聊的优先用群聊app
    const find = roomId ? findAppByRoomId : findAppByFriendId;
    const app = await find(roomId || friendId);

    /**
     * type: 类型 - text / arraybuffer
     */
    const res = await app.reply(roomId || friendId, text);
    return res;
  }
}
