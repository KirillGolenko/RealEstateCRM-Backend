import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { EventsUserTasks } from "../enums/event.enum";

@Entity("event")
export default class Event {
  @ApiProperty({ example: 1, description: "Event unique identificator" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: "Unique identifier of the user performing the action",
  })
  @Column()
  userId: number;

  @ApiProperty({
    example: "User create new task",
    description: "User actions performed on tasks",
  })
  @Column({
    type: "enum",
    enum: EventsUserTasks,
  })
  action: string;
}
