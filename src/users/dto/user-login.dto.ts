import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@mail.ru',
    description: 'User e-mail address',
  })
  @IsNotEmpty()
  @IsEmail({ message: 'Incorrect e-mail address' })
  email: string;

  @ApiProperty({
    example: 'user123',
    description: 'User account password',
  })
  @IsNotEmpty()
  @Length(5, 20, {
    message: 'Password length must be between 6 and 20 characters',
  })
  @IsString({ message: 'Data must be in string format' })
  password: string;
}
