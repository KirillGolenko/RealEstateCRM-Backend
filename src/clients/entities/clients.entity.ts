import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { DealStatus } from '../enums/clients.enum';

@Entity('clients')
export default class Clients {
  @ApiProperty({ example: 1, description: 'Client unique identificator' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Valeria Saterdinova',
    description: 'Client first and last name',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'user@mail.ru',
    description: 'Client e-mail address',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: '+355 536 47 837',
    description: 'Customer phone number',
  })
  @Column({ unique: true })
  phone: string;

  @ApiProperty({
    example: 'T23448572910138',
    description: 'Unique deal number',
  })
  @Column({ unique: true })
  dealNumber: string;

  @ApiProperty({
    example: 'Rejected',
    description: 'Deal status',
  })
  @Column({
    type: 'enum',
    enum: DealStatus,
  })
  status: string;

  @CreateDateColumn()
  createdDate: Date;
}
