import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @MinLength(4, { message: 'username is too short' })
  @MaxLength(20,  { message: 'username is too long' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'password is too short' })
  @MaxLength(20, { message: 'password is too long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
  , { message: 'password too weak' })
  password: string;
}
