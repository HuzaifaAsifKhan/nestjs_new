import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuthCredentialDto } from './dto/auth.credential.dto';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  static async createUser(filter: AuthCredentialDto): Promise<void> {
    const { username, password } = filter;
    const user = new User();
    user.username = username;
    user.password = password;
    await user.save();
  }
}
