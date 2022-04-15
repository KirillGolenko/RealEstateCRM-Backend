import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadService } from 'src/upload/upload.service';
import { RentDto } from 'src/property/dto/rent.dto';
import { getManager, Repository } from 'typeorm';

import PropertyDto from './dto/property.dto';
import Property from './entities/property.entity';
import Rent from 'src/property/entities/rent.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Rent)
    private readonly rentRepository: Repository<Rent>,
    private readonly uploadService: UploadService
  ) {}

  async createNewProperty(dto: any, files: Express.Multer.File[]) {
    const urls = await this.uploadService.savePropertyImages(files);
    const property = this.propertyRepository.create({ ...dto, imagesUrl: urls });
    return await this.propertyRepository.save(property);
  }

  async getAllProperty() {
    const allProperty = await this.propertyRepository.find();
    return allProperty;
  }

  async getOneProperty(propertyId: number) {
    const property = await this.propertyRepository.findOne({ id: propertyId });
    return property;
  }

  async updateProperty(propertyId: number, newPropetryDto: PropertyDto) {
    await this.propertyRepository.update({ id: propertyId }, newPropetryDto);
  }

  async deleteProperty(propertyId: number) {
    await this.propertyRepository.delete({ id: propertyId });
  }

  async createNewRent(rentParam: RentDto) {
    const entityManger = getManager();
    const rentalPeriods = await entityManger.query(
      `SELECT * FROM Rent WHERE "propertyId" = ${rentParam.propertyId} AND "startDate" < '${rentParam.endDate}' AND "endDate" > '${rentParam.startDate}'`
    );
    if (!rentalPeriods.length) {
      const rent = this.rentRepository.create(rentParam);
      return await this.rentRepository.save(rent);
    } else {
      throw new HttpException(
        {
          message: 'This period is already taken',
        },
        409
      );
    }
  }

  async getOnePropertyRent(propertyId: number) {
    const rentalPeriods = await this.rentRepository.findOne({ id: propertyId });
    return rentalPeriods;
  }
}
