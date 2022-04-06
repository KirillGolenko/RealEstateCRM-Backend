import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import User from "./entities/users.entity";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  private readonly logger = new Logger(UsersController.name);

  @ApiOperation({ summary: "Create new user" })
  @ApiResponse({ status: 200, description: "Successfully created", type: User })
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createNewUser(userDto);
  }

  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [User],
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: "Get one user" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [User],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/info')
  async getOneUser(@Req() req ) {
     const user = await this.usersService.getUserByEmail(req.user.email);
     delete user.password
     delete user.activationLink
     delete user.isActivationEmail
     delete user.googleId
     return user;
  }
}
