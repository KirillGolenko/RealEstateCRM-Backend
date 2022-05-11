import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ClientsService } from './clients.service';
import Clients from './entities/clients.entity';
import ClientsDto from './dto/clients.dto';

@ApiTags('Clients')
@ApiBearerAuth('token')
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @ApiOperation({ summary: 'Create new client' })
  @ApiResponse({ status: 200, description: 'Successfully created', type: Clients })
  @Post()
  create(@Body() clientsDto: ClientsDto) {
    return this.clientsService.createNewClient(clientsDto);
  }

  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({
    status: 200,
    description: 'Request completed successfully',
    type: [Clients],
  })
  @Get()
  getAllClients() {
    return this.clientsService.getAllClients();
  }

  @ApiOperation({ summary: 'Get one client' })
  @ApiResponse({
    status: 200,
    description: 'Request completed successfully',
    type: [Clients],
  })
  @Get('/info/:id')
  getOneClient(@Param('id') id: number) {
    return this.clientsService.getOneClient(id);
  }

  @ApiOperation({ summary: 'Edit client data' })
  @ApiResponse({
    status: 200,
    description: 'Request completed successfully',
    type: [Clients],
  })
  @Put('/update/:id')
  updateTask(@Param('id') id: number, @Body() clientsDto: ClientsDto) {
    return this.clientsService.updateClient(id, clientsDto);
  }

  @ApiOperation({ summary: 'Delete client' })
  @ApiResponse({
    status: 200,
    description: 'Request completed successfully',
    type: [Clients],
  })
  @Delete('/delete/:id')
  deleteTask(@Param('id') id: number) {
    this.clientsService.deleteClient(id);
  }
}
