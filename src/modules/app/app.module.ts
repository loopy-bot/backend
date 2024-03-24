import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from './entities/app.entity';
import { Plugin } from 'src/modules/plugins/entities/plugin.entity';
import { Friend } from 'src/modules/wx/entities/friend.entity';
import { Room } from 'src/modules/wx/entities/room.entity';
import { PluginsService } from '../plugins/plugins.service';

@Module({
  imports: [TypeOrmModule.forFeature([App, Plugin, Friend, Room])],
  controllers: [AppController],
  providers: [AppService, PluginsService],
})
export class AppModule {}
