import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "src/mailer/mailer.service";
import { v4 as uuidv4 } from "uuid";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import { LoginUserDto } from "src/users/dto/user-login.dto";
import { ForgotPasswordDto } from "src/auth/dto/forgot-password.dto";
import { ChangePasswordDto } from "src/auth/dto/change-password.dto";
import { IToken } from "./interface/token.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import Token from "./entities/token.entity";
import User from "src/users/entities/users.entity";

import * as bcrypt from "bcryptjs";
import * as config from "config";

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
    this.saveToken({ token, userId: user.id });
    return token;
  }

  async getToken(tokenData: IToken) {
    const token = await this.tokensRepository.find({
      userId: tokenData.userId,
    });

    if (!token) {
      throw new HttpException(
        "User with this token not found",
        HttpStatus.UNAUTHORIZED
      );
    }

    return token;
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
  }

  async login(userDto: LoginUserDto) {
    try {
      const user = await this.validateUser(userDto);
      return await this.generateToken(user);
    } catch (error) {
      throw new UnauthorizedException(error.response);
    }
  }

  async validateUser(userDto: LoginUserDto) {
    try {
      const user = await this.usersService.getUserByEmail(userDto.email);
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password
      );
      if (user && passwordEquals) {
        return user;
      }
    } catch (error) {
      throw new UnauthorizedException({
        message: "Incorrect email or password",
      });
    }
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.usersService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        "User with this email address already exists",
        HttpStatus.BAD_REQUEST
      );
    }
    const uuid = uuidv4();
    const hashPassword = await bcrypt.hash(userDto.password, 8);
    const user = await this.usersService.createNewUser({
      ...userDto,
      password: hashPassword,
      activationLink: uuid,
    });

    const verifyLink = `${config.get("mailer.verifyLink")}/auth/verify/${uuid}`;

    const mailMessage = `<h3> Hello, ${user.username}! </h3> 
    <p> Please use this <a href='${verifyLink}'>Link</a> to confirm your password.</p>`;

    this.mailer.sendMessage(user.email, mailMessage);
    return await this.generateToken(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.getUserByEmail(
      forgotPasswordDto.email
    );
    if (!user) {
      throw new BadRequestException({
        message: "Incorrect email or user not registered",
      });
    }
    const token = await this.generateToken(user);
    const forgotLink = `${config.get(
      "mailer.verifyLink"
    )}/auth/forgotPassword/?token=${token}`;

    const mailMessage = `<h3> Hello, ${user.username}! </h3> 
    <p> Please use this <a href='${forgotLink}'>Link</a> to reset your password.</p>`;

    this.mailer.sendMessage(user.email, mailMessage);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const hashPassword = await bcrypt.hash(changePasswordDto.password, 8);

    await this.usersService.updateUser(userId, hashPassword);
  }
}
