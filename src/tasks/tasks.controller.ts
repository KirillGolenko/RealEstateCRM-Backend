import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { TasksService } from "./tasks.service";
import { TasksDto } from "./dto/tasks.dto";
import Task from "./entities/tasks.entity";
import RequestWithUser from "src/interface/request-with-user.interface";

@ApiTags("Tasks")
@UseGuards(JwtAuthGuard)
@Controller("tasks")
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @ApiOperation({ summary: "Create new task" })
  @ApiResponse({ status: 200, description: "Successfully created", type: Task })
  @Post()
  create(@Body() tasksDto: TasksDto, @Req() req: RequestWithUser) {
    return this.tasksService.createNewTask(tasksDto, req.user.id);
  }

  @ApiOperation({ summary: "Get all tasks" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Task],
  })
  @Get()
  getAll() {
    return this.tasksService.getAllTasks();
  }

  @ApiOperation({ summary: "Get one task and her performers" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Task],
  })
  @Get("/info/:id")
  getOneTask(@Req() req: RequestWithUser) {
    return this.tasksService.getOneTask(Number(req.params.id));
  }

  @ApiOperation({ summary: "Delete task" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Task],
  })
  @Put("/update/:id")
  updateTask(@Req() req: RequestWithUser) {
    return this.tasksService.updateTask(
      Number(req.params.id),
      req.body,
      req.user.id
    );
  }

  @ApiOperation({ summary: "Delete task" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Task],
  })
  @Delete("/delete/:id")
  deleteTask(@Req() req: RequestWithUser) {
    this.tasksService.deleteTask(Number(req.params.id), req.user.id);
  }
}
