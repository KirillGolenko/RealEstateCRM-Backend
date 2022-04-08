import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { StatusTask } from "../emuns/task.enum";

@Entity("tasks")
export default class Task {
  @ApiProperty({ example: 1, description: "Task unique identificator" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "Create new repository",
    description: "Task title",
  })
  @Column()
  title: string;

  @ApiProperty({
    example: "Create private repository in GitHub",
    description: "Task description",
  })
  @Column()
  description: string;

  @ApiProperty({
    example: "2022-04-07T11:39:28.741Z",
    description: "Expire date task",
  })
  @Column({ type: "timestamp" })
  expireDate: Date;

  @ApiProperty({
    example: "TO DO",
    description: "Category task",
  })
  @Column({
    type: "enum",
    enum: StatusTask,
  })
  status: string;

  @Column("int", { array: true })
  performersId: number[];

  @ApiProperty({
    example: "To complete the task, use the instructions on the site GitHub",
    description: "Comment for task",
  })
  @Column({ default: null })
  comment: string;
}
