import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks.interface';
import { CreateTaskDTO } from './dto/create.task.dto';
import { GetTaskFilterDTO } from './dto/get.task.filter.dto';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  getTasks(filter: GetTaskFilterDTO, user: User): Promise<Task[]> {
    // return Task.getAllTasks(filter, user);
    return this.taskRepository.getAllTasks(filter, user);
  }

  async addTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    // return Task.createTask(createTaskDTO, user);
    return this.taskRepository.createTask(createTaskDTO, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`, {
        cause: 'TaskNotFound',
      });
    }
    return task;
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatusById(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    // we are using active record pattern here not data mapper pattern means we are saving record by using the entity itself
    return await task.save(); // it can also be this.taskRepository.save(task);
  }
}
