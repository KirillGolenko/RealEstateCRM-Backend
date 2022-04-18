import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class ClientsDto {
  @ApiProperty({
    example: 'Valeria Saterdinova',
    description: 'Client first and last name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'user@mail.ru',
    description: 'Client e-mail address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+355 536 47 837',
    description: 'Customer phone number',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'T23448572910138',
    description: 'Unique deal number',
  })
  @IsNotEmpty()
  @IsString()
  dealNumber: string;

  @ApiProperty({
    example: 'Rejected',
    description: 'Deal status',
  })
  @IsString()
  status: string;
}
