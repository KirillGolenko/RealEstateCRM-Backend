import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import Clients from './entities/clients.entity';

@Module({
  controllers: [ClientsController],
  imports: [TypeOrmModule.forFeature([Clients])],
  providers: [ClientsService],
})
export class ClientsModule {}
