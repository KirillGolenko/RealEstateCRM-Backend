import { Injectable } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleService {
  constructor(private authService: AuthService, private userService: UsersService) {}

  public async googleLogin(req) {
    if (!req.user) {
      return 'Not found user from google';
    }

    const user = await this.userService.getUserByGoogleId(req.user.googleId);

    if (user) {
      return await this.authService.generateToken(req.user);
    }

    let password = '';
    const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!№;%:?*()_+=';
    for (let i = 0; i < 10; i++) {
      password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }

    return this.authService.registration({
      email: req.user.email,
      username: req.user.firstName,
      password: password,
      imageUrl: req.user.picture,
      googleId: req.user.googleId,
    });
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
