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
import { TasksDto } from "./dto/tasks.dto";
import Task from "./entities/tasks.entity";
import { TasksService } from "./tasks.service";

@ApiTags("Tasks")
@Controller("tasks")
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @ApiOperation({ summary: "Create new task" })
  @ApiResponse({ status: 200, description: "Successfully created", type: Task })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() tasksDto: TasksDto, @Req() req) {
    return this.tasksService.createNewTask(tasksDto, req.user.id);
  }

  @ApiOperation({ summary: "Get all tasks" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Task],
  })
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Get("/info/:id")
  getOneTask(@Req() req) {
    return this.tasksService.getOneTask(req.params.id);
  }

  @ApiOperation({ summary: "Delete task" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Task],
  })
  @UseGuards(JwtAuthGuard)
  @Put("/update/:id")
  updateTask(@Req() req) {
    return this.tasksService.updateTask(req.params.id, req.body, req.user.id);
  }

  @ApiOperation({ summary: "Delete task" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Task],
  })
  @UseGuards(JwtAuthGuard)
  @Delete("/delete/:id")
  deleteTask(@Req() req) {
    this.tasksService.deleteTask(req.params.id, req.user.id);
  }
}
