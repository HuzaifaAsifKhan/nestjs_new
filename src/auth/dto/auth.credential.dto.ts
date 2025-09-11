import { IsNotEmpty, IsString } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
