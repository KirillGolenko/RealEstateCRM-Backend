import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("users")
export default class User {
  @ApiProperty({ example: "1", description: "User unique identificator" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "user@mail.ru",
    description: "User e-mail address",
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: "qwerty",
    description: "Username",
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    example: "12345678",
    description: "User account password",
  })
  @Column()
  password: string;
}