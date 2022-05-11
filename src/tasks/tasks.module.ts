import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsModule } from 'src/events/events.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import Task from './entities/tasks.entity';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [TypeOrmModule.forFeature([Task]), EventsModule],
  exports: [TasksService],
})
export class TasksModule {}
