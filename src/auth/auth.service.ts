import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth.credential.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    return User.createUser(authCredentialDto);
  }

  login(): Promise<void> {
    return Promise.resolve();
  }
}
