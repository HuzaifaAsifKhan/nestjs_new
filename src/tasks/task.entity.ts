import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './tasks.interface';
import { CreateTaskDTO } from './dto/create.task.dto';
import { GetTaskFilterDTO } from './dto/get.task.filter.dto';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  user?: User;

  @Column()
  userId: number;

  static async createTask(
    createTaskDTO: CreateTaskDTO,
    user: User,
  ): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    delete task.user; // we don't want to return the user with the task
    return task;
  }

  static async getAllTasks(
    filter: GetTaskFilterDTO,
    user: User,
  ): Promise<Task[]> {
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
      throw new InternalServerErrorException();
    }
  }
}
