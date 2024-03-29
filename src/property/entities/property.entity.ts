import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { PropertyTypes, TransactionsWithProperty } from '../enums/property.enum';

@Entity('property')
export default class Property {
  @ApiProperty({ example: 1, description: 'Property unique identificator' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '421 Marine Ave',
    description: 'Name property',
  })
  @Column()
  name: string;

  @ApiProperty({
    type: 'enum',
    enum: PropertyTypes,
  })
  @Column()
  type: string;

  @ApiProperty({
    example: 150,
    description: 'Real estate price',
  })
  @Column()
  price: number;

  @ApiProperty({
    example: 30,
    description: 'Real estate discount',
  })
  @Column({ default: null })
  discount: number;

  @ApiProperty({
    example: 3,
    description: 'Number of beds',
  })
  @Column()
  seats: number;

  @ApiProperty({
    example: 3,
    description: 'Real property area',
  })
  @Column()
  area: number;

  @ApiProperty({
    example: ['Air Conditioning', 'Balcony', 'Car Parking'],
    description: 'Property characteristics',
  })
  @IsNotEmpty()
  @Column('text', { array: true })
  details: string[];

  @UpdateDateColumn()
  updatedDate: Date;

  @ApiProperty({
    example: 'BeidinA',
    description: 'User updated property details',
  })
  @Column()
  updateBy: string;

  @ApiProperty({
    type: 'enum',
    enum: TransactionsWithProperty,
  })
  @Column()
  manipulation: string;

  @ApiProperty({
    example: ['kvartira-v-arendu-4913689727', 'kvartira-v-arendu-879536412'],
    description: 'Links to real estate images',
  })
  @IsNotEmpty()
  @Column('text', { array: true, default: null })
  imagesUrl: string[];
}
