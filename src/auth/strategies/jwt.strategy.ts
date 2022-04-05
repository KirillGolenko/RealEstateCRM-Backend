import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";

import * as config from "config";
import { IToken } from "../interface/token.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get("jwt.secret"),
    });
  }
  async validate(payload: { id: IToken }) {
    const token = this.authService.getToken(payload.id);

    if (!token) return token;
    return payload;
  }
}
