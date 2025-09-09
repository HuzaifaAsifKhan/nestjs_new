import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Task, TaskStatus } from './tasks.interface';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create.task.dto';
import { GetTaskFilterDTO } from './dto/get.task.filter.dto';
import { TaskStatusValidationPipe } from './pipes/task.status.validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/')
  getTasks(@Query(ValidationPipe) filter: GetTaskFilterDTO): Task[] {
    if (Object.values(filter).length) {
      return this.tasksService.getTasks(filter);
    } else {
      return this.tasksService.getAllTasks;
    }
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  addTask(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.tasksService.addTask(createTaskDTO);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): void {
    this.tasksService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateTaskStatusById(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus, // next will handle it & create a object of the pipe and use it here
    // @Body('status', new TaskStatusValidationPipe('fadsfsd', 'fasdfasd')) status: TaskStatus, // we can createa a instance of the pipe and use it here and some data as well
  ): Task {
    return this.tasksService.updateTaskStatusById(id, status);
  }
}
