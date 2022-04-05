import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MailModule } from "src/mailer/mailer.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import Token from "./entities/token.entity";
import * as config from "config";

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([Token]),
    UsersModule,
    MailModule,
    JwtModule.register({
      secret: config.get("jwt.secret"),
      signOptions: { expiresIn: "24h" },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
