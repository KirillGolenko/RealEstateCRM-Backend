import { ApiProperty } from "@nestjs/swagger";

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from "class-validator";

export class TasksDto {
  @ApiProperty({
    example: "Create new repository",
    description: "Task title",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: "Create private repository in GitHub",
    description: "Task description",
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: "2022-04-07T11:39:28.741Z",
    description: "Expire date task",
  })
  @IsDateString()
  expireDate: Date;

  @ApiProperty({
    example: "TO DO",
    description: "Category task",
  })
  @IsString()
  status: string;

  @ApiProperty({
    example: [1, 2, 3, 4, 5],
    description: "Category task",
  })
  userId: number[];

  @ApiProperty({
    example: "To complete the task, use the instructions on the site GitHub",
    description: "Comment for task",
  })
  @IsOptional()
  @IsString()
  comment: string;
}
