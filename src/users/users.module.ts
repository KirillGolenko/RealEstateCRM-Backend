import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UploadModule } from 'src/upload/upload.module';
import User from './entities/users.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService, Logger],
  imports: [TypeOrmModule.forFeature([User]), UploadModule],
  exports: [UsersService],
})
export class UsersModule {}
