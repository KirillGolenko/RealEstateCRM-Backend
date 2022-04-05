import { ApiProperty } from "@nestjs/swagger";

import { IsString, IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    example: "user@mail.ru",
    description: "User e-mail address",
  })
  @IsNotEmpty()
  @IsEmail({ message: "Incorrect e-mail address" })
  email: string;

  @ApiProperty({
    example: "qwerty",
    description: "Username",
  })
  @IsNotEmpty()
  @IsString({ message: "Data must be in string format" })
  username: string;

  @ApiProperty({
    example: "12345678",
    description: "User account password",
  })
  @IsNotEmpty()
  @Length(5, 20, {
    message: "Password length must be between 6 and 20 characters",
  })
  @IsString({ message: "Data must be in string format" })
  password: string;

  googleId?: string;
  activationLink?: string;
  imageUrl?: string;
}
