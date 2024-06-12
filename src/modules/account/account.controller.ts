import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('用户管理')
@Controller('user')
export class AccountController {
  constructor(private readonly userService: AccountService) {}

  @ApiOperation({ summary: '保存最后操作的会话' })
  @ApiBody({ type: String })
  @Post('save-last-session-id')
  saveLastSessionId(@Body() { id, lastSessionId }: { id: string; lastSessionId: string }) {
    this.userService.saveLastSessionId(id, lastSessionId);
  }

  @ApiOperation({ summary: '获取最后的会话' })
  @ApiBody({ type: String })
  @Get('get-last-session-id')
  getLastSessionId(@Query('id') id: string) {
    return this.userService.getLastSessionId(id);
  }
}
