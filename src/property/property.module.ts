import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import Property from './entities/property.entity';

@Module({
  controllers: [PropertyController],
  imports: [TypeOrmModule.forFeature([Property])],
  providers: [PropertyService]
})
export class PropertyModule {}
