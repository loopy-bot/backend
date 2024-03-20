import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';
import { PaginationParams } from 'src/utils/findEntitiesWithPagination';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async addTask(@Body() task: Task): Promise<Task> {
    return this.taskService.addTask(task);
  }

  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() task: Task): Promise<Task> {
    return this.taskService.updateTask(id, task);
  }

  @Get()
  async findAllTasks(
    @Query() params: PaginationParams & { startTime: number; endTime: number; name: string },
  ): Promise<any> {
    const { page, pageSize, ...rest } = params;
    return this.taskService.findAllTasks({ page, pageSize }, rest);
  }

  @Delete(':id')
  async deleteTaskById(@Param('id') id: string): Promise<string> {
    return this.taskService.deleteTaskById(id);
  }
}
