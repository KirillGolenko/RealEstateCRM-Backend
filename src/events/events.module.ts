import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import Event from "./entities/event.entity";

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [TypeOrmModule.forFeature([Event])],
  exports: [EventsService],
})
export class EventsModule {}
