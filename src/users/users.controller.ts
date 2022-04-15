import { Body, Controller, Get, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import User from './entities/users.entity';
import RequestWithUser from 'src/interface/request-with-user.interface';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 200, description: 'Successfully created', type: User })
  @Post()
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './avatars',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  create(@Body() userDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.createNewUser(userDto, file);
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

  @ApiOperation({ summary: 'Update select user' })
  @ApiResponse({
    status: 200,
    description: 'Request completed successfully',
    type: [User],
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './avatars',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  @Put('/update/:id')
  async updateUser(
    @Req() req: RequestWithUser,
    @Body() userDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    await this.usersService.updateUser(req.user.id, userDto, file);
  }
}
