import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('rent')
export default class Rent {
  @ApiProperty({ example: 1, description: 'Rent unique identificator' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2011/02/25',
    description: 'Start date of the lease',
  })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({
    example: '2011/02/25',
    description: 'End date of the lease',
  })
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty({
    example: 123456,
    description: 'Unique identificator property of the lease',
  })
  @Column()
  propertyId: number;
}
