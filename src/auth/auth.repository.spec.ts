import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth.credential.dto';
import * as bcrypt from 'bcrypt';

const mockCredentialsDto: AuthCredentialDto = {
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
    // let save;
    beforeEach(() => {
      save.mockReset();
      // save = jest.fn();
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
    it('throw internal server error exception', async () => {
      save.mockRejectedValue({ code: '23502' });
      await expect(repository.createUser(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUser', () => {
    let user;
    beforeEach(() => {
      repository.findOne = jest.fn();
      user = new User();
      user.username = 'TestUser';
      user.validatePassword = jest.fn();
    });
    it('return username as validation is in success case', async () => {
      repository.findOne.mockResolvedValue(user as unknown as User);
      user.validatePassword.mockResolvedValue(true);
      expect(repository.findOne).not.toHaveBeenCalled();
      expect(user.validatePassword).not.toHaveBeenCalled();
      const result = await repository.validateUser(mockCredentialsDto);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { username: 'TestUser' },
      });
      expect(user.validatePassword).toHaveBeenCalledWith('TestPassword');
      expect(result).toEqual('TestUser');
    });
    it('return null as user not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(repository.validateUser(mockCredentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(user.validatePassword).not.toHaveBeenCalled();
    });
    it('return false as password is invalid', async () => {
      repository.findOne.mockResolvedValue(user as unknown as User);
      user.validatePassword.mockResolvedValue(false);
      await expect(repository.validateUser(mockCredentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { username: 'TestUser' },
      });
      expect(user.validatePassword).toHaveBeenCalledWith('TestPassword');
    });
  });

  // describe('hashPassword', () => {
  //   it('generate a hash', async () => {
  //     bcrypt.hash = jest.fn().mockResolvedValue('hash value');
  //     // if generateHash function is separate and store in result variable
  //     expect(bcrypt.has).toHaveBeenCalledWith('TestPassword', 'testSalt');
  //     expect(result).toEqual('hash value');
  //   });
  // });
});
