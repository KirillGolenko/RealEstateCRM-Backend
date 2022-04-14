import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/interface/request-with-user.interface';
import User from './entities/users.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 200, description: 'Successfully created', type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createNewUser(userDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Request completed successfully',
    type: [User],
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('token')
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get one user' })
  @ApiResponse({
    status: 200,
    description: 'Request completed successfully',
    type: [User],
  })
  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  @Get('/info')
  async getOneUser(@Req() req: RequestWithUser) {
    const user = await this.usersService.getUserByEmail(req.user.email);
    delete user.password;
    delete user.activationLink;
    delete user.isActivationEmail;
    delete user.googleId;
    return user;
  }
}
