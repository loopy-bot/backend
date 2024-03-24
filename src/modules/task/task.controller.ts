import { Controller, Post, Body, Get } from '@nestjs/common';
import { TaskService } from './task.service';

import { PaginationTaskDto } from './dto/pagination-task.dto';
import { Model } from 'src/services/model.service';
import { TaskDto } from './dto/task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  async addTask(@Body() addTaskDto: TaskDto) {
    return this.taskService.addTask(addTaskDto);
  }

  @Post('edit')
  async updateTask(@Body('id') id, @Body() editTaskDto: TaskDto) {
    return this.taskService.updateTask(id, editTaskDto);
  }

  @Post('list')
  async findAllTasks(@Body() paginationTaskDto: PaginationTaskDto): Promise<any> {
    return this.taskService.findAllTasks(paginationTaskDto);
  }

  @Post('delete')
  async deleteTaskById(@Body('id') id: string): Promise<string> {
    return this.taskService.deleteTaskById(id);
  }

  @Post('rooms/bind')
  async bindTaskToRoom(@Body('id') id, @Body('roomIds') roomIds: string[]) {
    console.log(id, roomIds);
    return this.taskService.bindRoomsToTask(id, roomIds);
  }
  @Post('friends/bind')
  async bindTaskToFriend(@Body('id') id, @Body('friendIds') friendIds: string[]) {
    return this.taskService.bindFriendsToTask(id, friendIds);
  }

  @Post('active')
  async onTaskActive(@Body('id') id) {
    const task = await this.taskService.findOneTaskById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    // const res = await Model.genarate({
    //   model: 'kimi',
    //   question: task.text,
    // });
    return task.text;
  }
}
