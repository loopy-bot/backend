import { Controller, Post, Body } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';
import { PaginationParams } from 'src/utils/findEntitiesWithPagination';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  async addTask(@Body() task: Task): Promise<Task> {
    return this.taskService.addTask(task);
  }

  @Post('edit')
  async updateTask(@Body('id') id: string, @Body() task: Task): Promise<Task> {
    return this.taskService.updateTask(id, task);
  }

  @Post('list')
  async findAllTasks(
    @Body() params: PaginationParams & { startTime: number; endTime: number; name: string },
  ): Promise<any> {
    const { page, pageSize, ...rest } = params;
    return this.taskService.findAllTasks({ page, pageSize }, rest);
  }

  @Post('delete')
  async deleteTaskById(@Body('id') id: string): Promise<string> {
    return this.taskService.deleteTaskById(id);
  }
}
