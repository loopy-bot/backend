import { Controller, Post, Body } from '@nestjs/common';
import { TaskService } from './task.service';

import { PaginationTaskDto } from './dto/pagination-task.dto';

import { ActiveTaskDto, TaskDto, UpdateTaskDto } from './dto/task.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('定时任务管理')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: '创建定时任务' })
  @Post('create')
  async addTask(@Body() addTaskDto: TaskDto) {
    return this.taskService.addTask(new TaskDto(addTaskDto));
  }

  @ApiOperation({ summary: '编辑定时任务' })
  @ApiBody({ type: UpdateTaskDto })
  @Post('edit')
  async updateTask(@Body() { id, ...editTaskDto }: UpdateTaskDto) {
    return this.taskService.updateTask(id, editTaskDto);
  }

  @ApiOperation({ summary: '定时任务列表' })
  @Post('list')
  async findAllTasks(@Body() paginationTaskDto: PaginationTaskDto): Promise<any> {
    return this.taskService.findAllTasks(paginationTaskDto);
  }

  @ApiOperation({ summary: '删除定时任务' })
  @Post('delete')
  async deleteTaskById(@Body('id') id: string): Promise<string> {
    return this.taskService.deleteTaskById(id);
  }

  @ApiOperation({ summary: '激活定时任务' })
  @ApiBody({ type: ActiveTaskDto })
  @Post('active')
  async onTaskActive(@Body() { id }: ActiveTaskDto) {
    return this.taskService.activeTask(id);
  }
}
