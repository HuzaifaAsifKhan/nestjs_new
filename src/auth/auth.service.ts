import { Injectable, Logger } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth.credential.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService', { timestamp: true });
  constructor(
    private userRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    return this.userRepository.createUser(authCredentialDto);
  }

  async signIn(authCredentialDto: AuthCredentialDto): Promise<string> {
    try {
      const username =
        await this.userRepository.validateUser(authCredentialDto);
      const payload = { username };
      const token = this.jwtService.sign(payload);
      this.logger.debug(`User ${username} signed in successfully`);
      return Promise.resolve(token);
    } catch (error) {
      throw error;
    }
  }
}
