import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UploadService } from 'src/upload/upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly uploadService: UploadService
  ) {}

  async createNewUser(dto: CreateUserDto, file?: Express.Multer.File) {
    if (file) {
      const url = await this.uploadService.saveFile(file);
      const user = this.usersRepository.create({ ...dto, imageUrl: url });
      await this.usersRepository.save(user);
      return user;
    }
    const user = this.usersRepository.create(dto);
    await this.usersRepository.save(user);
    return user;
  }

  async getAllUsers() {
    const users = await this.usersRepository.find();
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    return user;
  }

  async getUserByGoogleId(googleId: string) {
    const user = await this.usersRepository.findOne({ googleId });
    return user;
  }

  async updateUser(userId: number, newUser: CreateUserDto, file?: Express.Multer.File) {
    if (file) {
      const url = await this.uploadService.saveFile(file);
      await this.usersRepository.update({ id: userId }, { ...newUser, imageUrl: url });
    }
    await this.usersRepository.update({ id: userId }, newUser);
  }

  async verifyEmail(uuid: string) {
    const user = await this.usersRepository.findOne({ activationLink: uuid });
    if (user) {
      await this.usersRepository.update({ id: user.id }, { isActivationEmail: true });
    } else {
      throw new BadRequestException({
        message: 'User not found',
      });
    }
  }
}
