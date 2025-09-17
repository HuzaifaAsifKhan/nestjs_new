import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
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
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/dto/get.user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController', { timestamp: true });
  constructor(private tasksService: TasksService) {}

  @Get('/')
  getTasks(
    @Query(ValidationPipe) filter: GetTaskFilterDTO,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `${user.username} retreiving all tasks. filter : ${JSON.stringify(filter)}`,
    );
    return this.tasksService.getTasks(filter, user);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  addTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `${user.username} create task. data : ${JSON.stringify(createTaskDTO)}`,
    );
    return this.tasksService.addTask(createTaskDTO, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatusById(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus, // next will handle it & create a object of the pipe and use it here
    // @Body('status', new TaskStatusValidationPipe('fadsfsd', 'fasdfasd')) status: TaskStatus, // we can createa a instance of the pipe and use it here and some data as well
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatusById(id, status, user);
  }
}
