import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { EventDto } from "./dto.ts/event.dto";
import Event from "./entities/event.entity";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {}

  async createNewAction(eventDto: EventDto) {
    const event = this.eventRepository.create(eventDto);
    await this.eventRepository.save(event);
  }

  async getAllEvents() {
    const events = await this.eventRepository.find();
    return events;
  }

  async deleteEvent(eventId: number) {
    await this.eventRepository.delete({ id: eventId });
  }
}
