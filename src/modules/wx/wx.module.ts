import { Module } from '@nestjs/common';
import { WxService } from './wx.service';
import { WxController } from './wx.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Friend } from './entities/friend.entity';
import { Task } from 'src/modules/task/entities/task.entity';
import { App } from 'src/modules/app/entities/app.entity';
import { AppService } from '../app/app.service';
import { Plugin } from '../plugins/entities/plugin.entity';
import { PluginsService } from '../plugins/plugins.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Friend, Task, App, Plugin])],
  controllers: [WxController],
  providers: [WxService, AppService, PluginsService],
})
export class WxModule {}
