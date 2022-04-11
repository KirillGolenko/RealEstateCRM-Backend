import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import PropertyDto from './dto/property.dto';
import Property from './entities/property.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>
  ) {}

  async createNewProperty(dto: PropertyDto) {
    const property = this.propertyRepository.create(dto);
    return await this.propertyRepository.save(property)
  }

  async getAllProperty() {
    const allProperty = await this.propertyRepository.find();
    return allProperty;
  }

  async getOneProperty(propertyId: number) {
    const property = await this.propertyRepository.findOne({ id: propertyId });
    return property
  }

  async updateProperty(propertyId: number, newPropetryDto: PropertyDto) {
    await this.propertyRepository.update({ id: propertyId }, newPropetryDto);
  }

  async deleteProperty(propertyId: number) {
    await this.propertyRepository.delete({ id: propertyId });
  }
}
