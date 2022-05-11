import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Conversation from './conversation.entity';

@Entity('message')
export default class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: number;

  @Column({ nullable: false })
  message: string;

  @Column({ default: true })
  send: boolean;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @JoinColumn()
  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;
}
