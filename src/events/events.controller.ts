import { Controller, Delete, Get, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { EventsService } from "./events.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import Event from "./entities/event.entity";
import RequestWithUser from "src/interface/request-with-user.interface";

@ApiTags("Events")
@UseGuards(JwtAuthGuard)
@Controller("events")
export class EventsController {
  constructor(private eventService: EventsService) {}

  @ApiOperation({ summary: "Get all events" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Event],
  })
  @Get()
  getAll() {
    return this.eventService.getAllEvents();
  }

  @ApiOperation({ summary: "Delete event" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Event],
  })
  @Delete("/delete/:id")
  deleteTask(@Req() req: RequestWithUser) {
    this.eventService.deleteEvent(Number(req.params.id));
  }
}
