import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { pagingQuery, getTimestamp } from 'src/utils/pagingQuery';
import { AddTaskDto } from './dto/add-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { PaginationTaskDto } from './dto/pagination-task.dto';
import { DelTaskDto } from './dto/del-task.dto';

@Injectable()
export class TaskService {
  @InjectRepository(Task)
  private taskRepository: Repository<Task>;

  async addTask(addTaskDto: AddTaskDto) {
    const val = this.taskRepository.create(addTaskDto);
    return this.taskRepository.save(val);
  }

  async updateTask(editTaskInfo: EditTaskDto) {
    const result = await this.taskRepository.update(editTaskInfo.id, editTaskInfo);
    if (result.affected === 0) {
      throw new Error('Task not found');
    }
    const updatedTask = await this.taskRepository.findOne({ where: { id: editTaskInfo.id } });
    return updatedTask;
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

  async deleteTaskById(delTaskDto: DelTaskDto) {
    const res = await this.taskRepository.delete({ id: delTaskDto.id });
    if (res.affected === 0) {
      throw new Error('Task not found');
    }
    return 'ok';
  }
}
