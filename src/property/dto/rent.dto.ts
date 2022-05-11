import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class RentDto {
  @ApiProperty({
    example: '2011/02/25',
    description: 'Start date of the lease',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    example: '2011/02/25',
    description: 'End date of the lease',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @ApiProperty({
    example: 123456,
    description: 'Unique identificator property of the lease',
  })
  @IsNotEmpty()
  propertyId: number;
}
