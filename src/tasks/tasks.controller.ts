import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { TaskStatus } from './tasks.interface';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create.task.dto';
import { GetTaskFilterDTO } from './dto/get.task.filter.dto';
import { TaskStatusValidationPipe } from './pipes/task.status.validation.pipe';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/')
  getTasks(@Query(ValidationPipe) filter: GetTaskFilterDTO): Promise<Task[]> {
    return this.tasksService.getTasks(filter);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  addTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksService.addTask(createTaskDTO);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateTaskStatusById(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus, // next will handle it & create a object of the pipe and use it here
    // @Body('status', new TaskStatusValidationPipe('fadsfsd', 'fasdfasd')) status: TaskStatus, // we can createa a instance of the pipe and use it here and some data as well
  ): Promise<Task> {
    return this.tasksService.updateTaskStatusById(id, status);
  }
}
