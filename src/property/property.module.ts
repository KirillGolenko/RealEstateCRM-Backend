import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { UploadModule } from 'src/upload/upload.module';
import Property from './entities/property.entity';
import Rent from 'src/property/entities/rent.entity';

@Module({
  controllers: [PropertyController],
  imports: [TypeOrmModule.forFeature([Property, Rent]), UploadModule],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
