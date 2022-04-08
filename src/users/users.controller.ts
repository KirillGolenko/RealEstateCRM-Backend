import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import User from "./entities/users.entity";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: "Create new user" })
  @ApiResponse({ status: 200, description: "Successfully created", type: User })
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
}
