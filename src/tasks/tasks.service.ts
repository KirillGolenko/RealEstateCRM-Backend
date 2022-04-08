import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventsUserTasks } from "src/events/enums/event.enum";
import { EventsService } from "src/events/events.service";
import { Repository } from "typeorm";
import { TasksDto } from "./dto/tasks.dto";
import Task from "./entities/tasks.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly eventService: EventsService
  ) {}

  async createNewTask(dto: TasksDto, userId: number) {
    await this.eventService.createNewAction({
      userId,
      action: EventsUserTasks.CREATETASK,
    });
    const task = this.tasksRepository.create(dto);
    return await this.tasksRepository.save(task);
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

    await this.tasksRepository.update({ id: taskId }, newTask);
    const modifiedTask = await this.tasksRepository.findOne(taskId);
    return modifiedTask;
  }

  async deleteTask(taskId: number, userId: number) {
    await this.eventService.createNewAction({
      userId,
      action: EventsUserTasks.DELETE,
    });
    await this.tasksRepository.delete({ id: taskId });
  }
}
