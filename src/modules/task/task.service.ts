import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { pagingQuery, getTimestamp } from 'src/utils/pagingQuery';

import { PaginationTaskDto } from './dto/pagination-task.dto';
import { Friend } from '../wx/entities/friend.entity';
import { Room } from '../wx/entities/room.entity';
import { Model } from 'src/services/model.service';
import { text } from 'stream/consumers';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  @InjectRepository(Task)
  private taskRepository: Repository<Task>;
  @InjectRepository(Friend)
  private friendRepository: Repository<Friend>;
  @InjectRepository(Room)
  private roomRepository: Repository<Room>;

  async addTask(addTaskDto: TaskDto) {
    const val = this.taskRepository.create(addTaskDto);
    return this.taskRepository.save(val);
  }

  async updateTask(id: string, editTaskInfo: TaskDto) {
    const result = await this.taskRepository.update(id, editTaskInfo);
    if (result.affected === 0) {
      throw new Error('Task not found');
    }
    const updatedTask = await this.taskRepository.findOne({ where: { id } });
    return updatedTask;
  }

  async findOneTaskById(id: string) {
    return this.taskRepository.findOne({ where: { id } });
  }

  async findAllTasks(paginationTaskDto: PaginationTaskDto) {
    let time = null;
    const { startTime, endTime, name, ...paginationParams } = paginationTaskDto;
    if (startTime && endTime) {
      time = getTimestamp(startTime, endTime);
    }
    const res = await pagingQuery(paginationParams, { name, time }, this.taskRepository);
    return res;
  }

  async deleteTaskById(id: string) {
    const res = await this.taskRepository.delete(id);
    if (res.affected === 0) {
      throw new Error('Task not found');
    }
    return 'ok';
  }

  async bindFriendsToTask(id: string, friendIds: string[]) {
    // 查找任务
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['friends'] });
    if (!task) {
      throw new Error('Task not found');
    }
    // 查找好友列表
    const friends = await this.friendRepository.find({ where: { id: In(friendIds) } });
    if (friends.length !== friendIds.length) {
      throw new Error('One or more Friends not found');
    }
    // 绑定好友到任务
    task.friends = friends;
    await this.taskRepository.save(task);

    return task;
  }

  async bindRoomsToTask(id: string, roomIds: string[]) {
    // 查找任务
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['rooms'] });
    if (!task) {
      throw new Error('Task not found');
    }
    // 查找好友列表
    const rooms = await this.roomRepository.find({ where: { id: In(roomIds) } });
    if (rooms.length !== roomIds.length) {
      throw new Error('One or more Rooms not found');
    }
    // 绑定好友到任务
    task.rooms = rooms;
    await this.taskRepository.save(task);
    return task;
  }
}
