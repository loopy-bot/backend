import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TaskService } from './task.service';

import { PaginationTaskDto } from './dto/pagination-task.dto';
import { Model } from 'src/services/model.service';
import { ActiveTaskDto, BindFriendsOrRoomsDto, TaskDto, UpdateTaskDto } from './dto/task.dto';
import { ApiBody, ApiOAuth2, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('定时任务管理')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: '创建定时任务' })
  @Post('create')
  async addTask(@Body() addTaskDto: TaskDto) {
    return this.taskService.addTask(addTaskDto);
  }

  @ApiOperation({ summary: '编辑定时任务' })
  @ApiBody({ type: UpdateTaskDto })
  @Post('edit')
  async updateTask(@Body() { id, ...editTaskDto }: UpdateTaskDto) {
    return this.taskService.updateTask(id, editTaskDto);
  }

  @ApiOperation({ summary: '获取定时任务列表' })
  @Post('list')
  async findAllTasks(@Body() paginationTaskDto: PaginationTaskDto): Promise<any> {
    return this.taskService.findAllTasks(paginationTaskDto);
  }

  @ApiOperation({ summary: '删除定时任务' })
  @Post('delete')
  async deleteTaskById(@Body('id') id: string): Promise<string> {
    return this.taskService.deleteTaskById(id);
  }

  @ApiOperation({ summary: '绑定定时任务到好友/群聊' })
  @ApiParam({ name: 'type', enum: ['friend', 'room'] })
  @ApiBody({ type: BindFriendsOrRoomsDto })
  @Post(':type/bind')
  async bindTaskToFriend(@Param('type') type, @Body() { id, entityIds }: BindFriendsOrRoomsDto) {
    if (type === 'friend') {
      return this.taskService.bindFriendsToTask(id, entityIds);
    } else if (type === 'room') {
      return this.taskService.bindRoomsToTask(id, entityIds);
    }
  }

  @ApiOperation({ summary: '激活定时任务' })
  @ApiBody({ type: ActiveTaskDto })
  @Post('active')
  async onTaskActive(@Body() { id }: ActiveTaskDto) {
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
