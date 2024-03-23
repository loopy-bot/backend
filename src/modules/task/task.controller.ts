import { Controller, Post, Body } from '@nestjs/common';
import { TaskService } from './task.service';
import { AddTaskDto } from './dto/add-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { PaginationTaskDto } from './dto/pagination-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  async addTask(@Body() addTaskDto: AddTaskDto): Promise<AddTaskDto> {
    return this.taskService.addTask(addTaskDto);
  }

  @Post('edit')
  async updateTask(@Body() editTaskDto: EditTaskDto): Promise<EditTaskDto> {
    return this.taskService.updateTask(editTaskDto);
  }

  @Post('list')
  async findAllTasks(@Body() paginationTaskDto: PaginationTaskDto): Promise<any> {
    return this.taskService.findAllTasks(paginationTaskDto);
  }

  @Post('delete')
  async deleteTaskById(@Body('id') id: string): Promise<string> {
    return this.taskService.deleteTaskById(id);
  }
}
