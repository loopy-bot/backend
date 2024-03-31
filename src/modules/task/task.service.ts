import { HttpException, Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { pagingQuery } from 'src/utils/pagingQuery';

import { PaginationTaskDto } from './dto/pagination-task.dto';
import { TaskDto } from './dto/task.dto';
import { Model } from 'src/services/model.service';

@Injectable()
export class TaskService {
  @InjectRepository(Task)
  private taskRepository: Repository<Task>;

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
    let likeName = null;
    const { name, ...paginationParams } = paginationTaskDto;
    if (name) {
      likeName = Like(`%${name}%`);
    }
    const res = await pagingQuery(paginationParams, { name: likeName }, this.taskRepository);
    return res;
  }
  async activeTask(id: string) {
    const task = await this.findOneTaskById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    if (task.count === 0) {
      return '$done';
    } else if (task.count === null) {
      return this.generate(task.text);
    } else {
      try {
        task.count -= 1;
        await this.taskRepository.save(task);
      } catch (error) {
        // 处理保存失败的情况
        throw new Error(`Failed to save the task: ${error.message}`);
      }
      const res = await this.generate(task.text);
      return res;
    }
  }
  private async generate(text: string) {
    const res = await Model.genarate({
      model: 'qwen',
      question: text,
    });
    return res.text;
  }
  async deleteTaskById(id: string) {
    const res = await this.taskRepository.delete(id);
    if (res.affected === 0) {
      throw new Error('Task not found');
    }
    return 'ok';
  }
}
