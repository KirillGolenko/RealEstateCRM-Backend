import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Message from './message.entity';

@Entity('conversation')
export default class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: number;

  @Column()
  recipient: number;

  @JoinColumn()
  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
  length: number;
}
