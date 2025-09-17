import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth.credential.dto';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(filter: AuthCredentialDto): Promise<void> {
    const { username, password } = filter;
    // const user = new User(); //its not testable
    const user = this.create(); // this is testable
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    user.username = username;
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUser(filter: AuthCredentialDto): Promise<string> {
    const { username, password } = filter;
    const user = await this.findOne({ where: { username } });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
