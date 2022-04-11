import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  create(@Body() tasksDto: TasksDto, @Param('id') id: number) {
    return this.tasksService.createNewTask(tasksDto, id);
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
  getOneTask(@Param('id') id: number) {
    return this.tasksService.getOneTask(id);
  }

  @ApiOperation({ summary: "Edit task" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Task],
  })
  @Put("/update/:id")
  updateTask(@Req() req: RequestWithUser, @Param('id') id: number, @Body() tasksDto: TasksDto, ) {
    return this.tasksService.updateTask(
      id,
      tasksDto,
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
  deleteTask(@Req() req: RequestWithUser, @Param('id') id: number,) {
    this.tasksService.deleteTask(id, req.user.id);
  }
}
