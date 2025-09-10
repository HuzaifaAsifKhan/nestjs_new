import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks.interface';
import { CreateTaskDTO } from './dto/create.task.dto';
import { GetTaskFilterDTO } from './dto/get.task.filter.dto';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  getTasks(filter: GetTaskFilterDTO): Promise<Task[]> {
    return Task.getAllTasks(filter);
  }

  async addTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    return Task.createTask(createTaskDTO);
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async deleteTaskById(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatusById(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(+id);
    task.status = status;
    // we are using active record pattern here not data mapper pattern means we are saving record by using the entity itself
    return await task.save(); // it can also be this.taskRepository.save(task);
  }
}
