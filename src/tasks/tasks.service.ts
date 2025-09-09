import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.interface';
import * as uuid from 'uuid';
import { CreateTaskDTO } from './dto/create.task.dto';
import { GetTaskFilterDTO } from './dto/get.task.filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  get getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasks(filter: GetTaskFilterDTO): Task[] {
    const { status, search } = filter;
    let tasks = this.tasks;

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  addTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;
    const task: Task = {
      title,
      description,
      status: TaskStatus.OPEN,
      id: uuid.v4(),
    };
    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  deleteTaskById(id: string): void {
    const task: Task = this.getTaskById(id);
    this.tasks = [...this.tasks].filter((item) => item.id !== task.id);
  }

  updateTaskStatusById(id: string, status: TaskStatus): Task {
    const task: Task = this.getTaskById(id);
    task!.status = status;
    return task;
  }
}
