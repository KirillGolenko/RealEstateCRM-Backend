import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import User from "./entities/users.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async createNewUser(dto: CreateUserDto) {
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
}