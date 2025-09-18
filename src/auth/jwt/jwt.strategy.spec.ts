import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategyService } from './jwt.strategy';
import { AuthRepository } from '../auth.repository';
import { User } from '../user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockAuthRepository = () => ({
  findOne: jest.fn(),
});

describe('Jwt Strategy', () => {
  let service;
  let repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategyService,
        { provide: AuthRepository, useFactory: mockAuthRepository },
      ],
    }).compile();

    service = await module.get<JwtStrategyService>(JwtStrategyService);
    repository = await module.get<AuthRepository>(AuthRepository);
  });

  describe('validate', () => {
    it('return a user', async () => {
      const user = new User();
      user.username = 'TestUsername';
      repository.findOne.mockResolvedValue(user);
      expect(repository.findOne).not.toHaveBeenCalled();
      const result = await service.validate({ username: 'TestUsername' });
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { username: 'TestUsername' },
      });
      expect(result).toEqual(user);
    });
    it('return unauthorize exception', async () => {
      repository.findOne.mockResolvedValue(null);
      expect(repository.findOne).not.toHaveBeenCalled();
      await expect(
        service.validate({ username: 'TestUsername' }),
      ).rejects.toThrow(UnauthorizedException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { username: 'TestUsername' },
      });
    });
  });
});
