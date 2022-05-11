import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

import * as config from 'config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      ...config.get('google'),
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile, done: VerifyCallback): Promise<void> {
    const { name, emails, photos, id } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      picture: photos[0].value,
      googleId: id,
      accessToken,
    };

    done(null, user);
  }
}
