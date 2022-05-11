import { Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Entity('property')
export default class PropertyDto {
  @ApiProperty({
    example: '421 Marine Ave',
    description: 'Name property',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'HOUSE',
    description: 'Type property',
  })
  type: string;

  @ApiProperty({
    example: 150,
    description: 'Real estate price',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 30,
    description: 'Real estate discount',
  })
  @IsNumber()
  discount: number;

  @ApiProperty({
    example: 3,
    description: 'Number of beds',
  })
  @IsNotEmpty()
  @IsNumber()
  seats: number;

  @ApiProperty({
    example: 3,
    description: 'Real property area',
  })
  @IsNotEmpty()
  @IsNumber()
  area: number;

  @ApiProperty({
    example: ['Air Conditioning', 'Balcony', 'Car Parking'],
    description: 'Property characteristics',
  })
  @IsNotEmpty()
  options: string[];

  @ApiProperty({
    example: 'BeidinA',
    description: 'User updated property details',
  })
  @IsNotEmpty()
  @IsString()
  updateBy: string;

  @ApiProperty({
    example: 'RESERVED',
    description: 'Transactions with property',
  })
  @IsNotEmpty()
  @IsString()
  manipulation: string;

  @ApiProperty({
    example: ['kvartira-v-arendu-4913689727', 'kvartira-v-arendu-879536412'],
    description: 'Links to real estate images',
  })
  imagesUrl: string[];
}
