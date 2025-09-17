import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTaskFilterDTO } from './dto/get.task.filter.dto';
import { TaskStatus } from './tasks.interface';
import { User } from '../auth/user.entity';
import { Task } from './task.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create.task.dto';
const mockUser = {
  id: 12,
  username: 'Test User',
} as User;

const mockTaskRepository = () => ({
  getAllTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;
  let repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    service = await module.get<TasksService>(TasksService);
    repository = await module.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTasks', () => {
    it('get all tasks from repository', async () => {
      repository.getAllTasks.mockResolvedValue(
        'someValue' as unknown as Task[],
      );
      expect(repository.getAllTasks).not.toHaveBeenCalled();
      const filter: GetTaskFilterDTO = {
        status: TaskStatus.OPEN,
        search: 'Some search query',
      };
      const result = await service.getTasks(filter, mockUser);
      expect(repository.getAllTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('retreive task and return it', async () => {
      repository.findOne.mockResolvedValue('some value' as unknown as Task);
      expect(repository.findOne).not.toHaveBeenCalled();
      const task = await service.getTaskById(1, mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
      expect(task).toEqual('some value');
    });

    it('throw error task is not defined', async () => {
      repository.findOne.mockResolvedValue(null);
      // expect(service.getTaskById(1, mockUser)).rejects.toThrow(
      //   'Task with ID "1" not found',
      // );// this will also work
      expect(service.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addTask', () => {
    it('create a task and return it', async () => {
      repository.createTask.mockResolvedValue('some value' as unknown as Task);
      expect(repository.createTask).not.toHaveBeenCalled();
      const result = await service.addTask(
        'task' as unknown as CreateTaskDTO,
        mockUser,
      );
      expect(repository.createTask).toHaveBeenCalledWith(
        'task' as unknown as CreateTaskDTO,
        mockUser,
      );
      expect(result).toEqual('some value');
    });
  });

  describe('deleteTaskById', () => {
    it('retreive task and delete it', async () => {
      repository.delete.mockResolvedValue({ affected: 1 });
      expect(repository.delete).not.toHaveBeenCalled();
      const result = await service.deleteTaskById(1, mockUser);
      expect(repository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('throw error task is not defined', async () => {
      repository.delete.mockResolvedValue({ affected: 0 });

      expect(service.deleteTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskStatusById', () => {
    it('update a task and return it', async () => {
      const save = jest.fn().mockImplementation(function () {
        return Promise.resolve(this);
      });
      service.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.IN_PROGRESS,
        save,
      } as unknown as Task);
      expect(service.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await service.updateTaskStatusById(
        1,
        TaskStatus.DONE,
        mockUser,
      );
      expect(service.getTaskById).toHaveBeenCalledWith(1, mockUser);
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
