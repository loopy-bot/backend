import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Friend } from '../wx/entities/friend.entity';
import { Room } from '../wx/entities/room.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Task, Friend, Room])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
