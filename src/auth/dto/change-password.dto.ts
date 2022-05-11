import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
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
