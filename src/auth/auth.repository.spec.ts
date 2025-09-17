import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { create } from 'domain';

const mockCredentialsDto = {
  username: 'TestUser',
  password: 'TestPassword',
};

const mockDataSource = {
  createEntityManager: jest.fn().mockReturnValue({
    save: jest.fn(),
    create: jest.fn(),
  }),
};

describe('AuthRepository', () => {
  let repository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    repository = await module.get<AuthRepository>(AuthRepository);
  });

  describe('createUser', () => {
    const save = jest.fn();
    beforeEach(() => {
      save.mockReset();
      repository.create = jest.fn().mockReturnValue({ save } as any);
    });
    it('successfully create a user', async () => {
      save.mockResolvedValue(undefined);
      await expect(
        repository.createUser(mockCredentialsDto),
      ).resolves.not.toThrow();
    });
    it('throw conflict exception', async () => {
      save.mockRejectedValue({ code: '23505' });
      await expect(repository.createUser(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });
    it('internal error', async () => {});
  });
});
