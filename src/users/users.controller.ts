import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import User from "./entities/users.entity";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

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
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }
}
