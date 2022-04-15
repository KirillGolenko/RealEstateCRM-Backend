import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export default class User {
  @ApiProperty({ example: 1, description: 'User unique identificator' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'user@mail.ru',
    description: 'User e-mail address',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'KirillG',
    description: 'Username',
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    example: 'user123',
    description: 'User account password',
  })
  @Column()
  password: string;

  @Column({ default: null })
  lastLogin: string;

  @Column()
  activationLink: string;

  @Column({ default: false })
  isActivationEmail: boolean;

  @Column({ default: null })
  imageUrl: string;

  @Column({ default: null })
  googleId: string;
}
