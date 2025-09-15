import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AuthCredentialDto } from './dto/auth.credential.dto';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/task.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  static async createUser(filter: AuthCredentialDto): Promise<void> {
    const { username, password } = filter;
    try {
      const user = new User();
      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, user.salt);
      user.username = username;
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  static async validateUser(filter: AuthCredentialDto): Promise<string> {
    const { username, password } = filter;
    const user = await this.findOne({ where: { username } });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
