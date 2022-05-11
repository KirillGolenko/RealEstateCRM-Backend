import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/user-login.dto';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { MailService } from 'src/mailer/mailer.service';
import { IToken } from './interface/token.interface';
import Token from './entities/token.entity';
import User from 'src/users/entities/users.entity';

import * as bcrypt from 'bcryptjs';
import * as config from 'config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private readonly tokensRepository: Repository<Token>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailer: MailService
  ) {}

  async generateToken(user: User) {
    const payload = { email: user.email, id: user.id };

    const token = this.jwtService.sign(payload);
    const tokenData = await this.saveToken({ token, userId: user.id });
    return tokenData;
  }

  async getToken(tokenData) {
    const token = await this.tokensRepository.findOne({
      userId: tokenData,
    });
    if (!token) {
      throw new UnauthorizedException('User unauthorized');
    }

    return token;
  }

  async getUserByToken(token) {
    const tokenData: any = this.jwtService.decode(token);
    const user = await this.usersService.getUserById(tokenData.id);
    return user;
  }

  async saveToken(tokenData: IToken) {
    const userToken = await this.tokensRepository.find({
      userId: tokenData.userId,
    });
    if (userToken) {
      this.tokensRepository.delete({
        userId: tokenData.userId,
      });
    }

    const token = this.tokensRepository.create(tokenData);
    await this.tokensRepository.save(token);
    return token;
  }

  async logOut(user) {
    this.tokensRepository.delete({
      userId: user.id,
    });
  }

  async login(userDto: LoginUserDto) {
    try {
      const user = await this.validateUser(userDto);
      const token = await this.generateToken(user);
      this.usersService.updateUser(user.id, { ...user, lastLogin: token.createdDate });
      return token.token;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Incorrect email or password',
      });
    }
  }

  async validateUser(userDto: LoginUserDto) {
    try {
      const user = await this.usersService.getUserByEmail(userDto.email);
      const passwordEquals = await bcrypt.compare(userDto.password, user.password);
      if (user && passwordEquals) {
        return user;
      }
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Incorrect email or password',
      });
    }
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.usersService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException('User with this email address already exists', HttpStatus.CONFLICT);
    }
    const uuid = uuidv4();
    const hashPassword = await bcrypt.hash(userDto.password, 8);
    const user = await this.usersService.createNewUser({
      ...userDto,
      password: hashPassword,
      activationLink: uuid,
      lastLogin: new Date().toISOString(),
    });

    const verifyLink = `${config.get('mailer.verifyLink')}/auth/verify/${uuid}`;

    const mailMessage = `<h3> Hello, ${user.username}! </h3> 
    <p> Please use this <a href='${verifyLink}'>Link</a> to confirm your password.</p>`;

    this.mailer.sendMessage(user.email, mailMessage);
    const token = await this.generateToken(user);

    return token.token;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.getUserByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new BadRequestException({
        message: 'Incorrect email or user not registered',
      });
    }
    const token = await this.generateToken(user);
    const forgotLink = `${config.get('mailer.verifyLink')}/auth/forgotPassword/?token=${token}`;

    const mailMessage = `<h3> Hello, ${user.username}! </h3> 
    <p> Please use this <a href='${forgotLink}'>Link</a> to reset your password.</p>`;

    this.mailer.sendMessage(user.email, mailMessage);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const hashPassword = await bcrypt.hash(changePasswordDto.password, 8);

    await this.usersService.updateUser(userId, hashPassword);
  }
}
