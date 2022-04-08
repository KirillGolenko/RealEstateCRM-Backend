import { Controller, Delete, Get, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { EventsService } from "./events.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import Event from "./entities/event.entity";

@Controller("events")
export class EventsController {
  constructor(private eventService: EventsService) {}

  @ApiOperation({ summary: "Get all events" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Event],
  })
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Delete("/delete/:id")
  deleteTask(@Req() req) {
    this.eventService.deleteEvent(req.params.id);
  }
}
