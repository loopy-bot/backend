import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationParams, findEntitiesWithPagination, getTimestamp } from 'src/utils/findEntitiesWithPagination';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async addTask(task: Task) {
    const val = this.taskRepository.create(task);
    return this.taskRepository.save(val);
  }

  async updateTask(id, task: Task) {
    await this.taskRepository.update(id, task);
    const updateData = await this.taskRepository.findOneBy({ id });
    if (updateData) {
      new Error('Update error');
    }
    return updateData;
  }

  // 查询-分页-条件
  async findAllTasks(
    paginationParams: PaginationParams,
    conditions: { startTime?: number; endTime?: number; name?: string },
  ) {
    let time = null;
    const { startTime, endTime, ...rest } = conditions;
    if (startTime && endTime) {
      time = getTimestamp(startTime, endTime);
    }
    const res = await findEntitiesWithPagination(paginationParams, { ...rest, time }, this.taskRepository);
    return res;
  }

  async deleteTaskById(id: string) {
    const res = await this.taskRepository.delete(id);
    if (res.affected === 0) {
      throw new Error('Task not found');
    }
    return 'ok';
  }
}
