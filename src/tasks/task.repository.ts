import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GetTaskFilterDTO } from './dto/get.task.filter.dto';
import { User } from '../auth/user.entity';
import { CreateTaskDTO } from './dto/create.task.dto';
import { TaskStatus } from './tasks.interface';

@Injectable()
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository', { timestamp: true });
  constructor(datasource: DataSource) {
    super(Task, datasource.createEntityManager());
  }

  async getAllTasks(filter: GetTaskFilterDTO, user: User): Promise<Task[]> {
    const { search, status } = filter;
    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(
          filter,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
      delete task.user; // we don't want to return the user with the task
      return task;
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user "${user.username}". Data: ${JSON.stringify(
          createTaskDTO,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
