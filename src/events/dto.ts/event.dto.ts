import { ApiProperty } from "@nestjs/swagger";

import { IsString, IsNotEmpty } from "class-validator";

export class EventDto {
  @ApiProperty({
    example: 1,
    description: "Unique identifier of the user performing the action",
  })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: "CREATE TASK",
    description: "User actions performed on tasks",
  })
  @IsNotEmpty()
  @IsString()
  action: string;
}
