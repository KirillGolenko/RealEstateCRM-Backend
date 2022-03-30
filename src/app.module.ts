import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from './auth/auth.module';
import * as config from "config";

@Module({
  controllers: [],
  providers: [],
  imports: [
    TypeOrmModule.forRoot({ ...config.get("database.postgresql") }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
