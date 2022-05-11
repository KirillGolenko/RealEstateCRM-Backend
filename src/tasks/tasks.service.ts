import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventsUserTasks } from 'src/events/enums/event.enum';
import { EventsService } from 'src/events/events.service';
import { TasksDto } from './dto/tasks.dto';
import Task from './entities/tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly eventService: EventsService
  ) {}

  async createNewTask(dto: TasksDto, userId: number) {
    const task = this.tasksRepository.create(dto);
    const newTask = await this.tasksRepository.save(task);
    if (newTask) {
      await this.eventService.createNewAction({
        userId,
        action: EventsUserTasks.CREATETASK,
      });
    }
  }

  async getAllTasks() {
    const tasks = await this.tasksRepository.find();
    return tasks;
  }

  async getOneTask(taskId: number) {
    return await this.tasksRepository.findOne({ id: taskId });
  }

  async updateTask(taskId: number, newTask: TasksDto, userId: number) {
    const task = await this.tasksRepository.findOne(taskId);
    await this.tasksRepository.update({ id: taskId }, newTask);

    const modifiedTask = await this.tasksRepository.findOne(taskId);
    if (modifiedTask) {
      if (task.status === newTask.status) {
        await this.eventService.createNewAction({
          userId,
          action: EventsUserTasks.UPDATE,
        });
      } else {
        await this.eventService.createNewAction({
          userId,
          action: EventsUserTasks.MOVEMENT,
        });
      }
    }
    return modifiedTask;
  }

  async deleteTask(taskId: number, userId: number) {
    await this.tasksRepository.delete({ id: taskId });
    const task = await this.tasksRepository.findOne(taskId);

    if (!task) {
      await this.eventService.createNewAction({
        userId,
        action: EventsUserTasks.DELETE,
      });
    }
  }
}
