import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("token")
export default class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  userId: number;
}
