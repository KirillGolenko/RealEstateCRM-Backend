import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import ClientsDto from './dto/clients.dto';
import Clients from './entities/clients.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients)
    private readonly clientsRepository: Repository<Clients>
  ) {}

  async createNewClient(dto: ClientsDto) {
    const client = this.clientsRepository.create(dto);
    return await this.clientsRepository.save(client);
  }

  async getAllClients() {
    const AllClients = await this.clientsRepository.find();
    return AllClients;
  }

  async getOneClient(clientId: number) {
    const property = await this.clientsRepository.findOne({ id: clientId });
    return property;
  }

  async updateClient(clientId: number, newClientsDto: ClientsDto) {
    await this.clientsRepository.update({ id: clientId }, newClientsDto);
    const changeClient = await this.clientsRepository.findOne({ id: clientId });
    return changeClient;
  }

  async deleteClient(clientId: number) {
    await this.clientsRepository.delete({ id: clientId });
  }
}
