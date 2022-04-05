import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import User from "./entities/users.entity";

@Module({
  controllers: [UsersController],
  providers: [UsersService, Logger],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
})
export class UsersModule {}
