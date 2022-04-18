import { Body, Controller, Get, HttpCode, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/users/dto/user-login.dto';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';
import { GetOneUser } from 'src/decorators/get-user.decorator';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import User from 'src/users/entities/users.entity';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @HttpCode(200)
  @Post('/login')
  login(@Body() userDto: LoginUserDto) {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  logout(@Req() req) {
    return this.authService.logOut(req.user);
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 200,
    description: 'Successfully',
  })
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({
    status: 200,
    description: 'Successfully',
  })
  @Get('/verify/:uuid')
  verifyEmail(@Param('uuid') uuid: string) {
    return this.usersService.verifyEmail(uuid);
  }

  @ApiOperation({ summary: 'Forgot password form' })
  @ApiResponse({
    status: 200,
    description: 'Successfully',
  })
  @Post('/forgotPassword')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    status: 200,
    description: 'Successfully',
  })
  @UseGuards(JwtAuthGuard)
  @Put('/changePassword')
  changePassword(@GetOneUser() user: User, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(user.id, changePasswordDto);
  }
}
