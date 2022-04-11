import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PropertyService } from './property.service';
import PropertyDto from './dto/property.dto';
import Property from './entities/property.entity';

@ApiTags("Property")
@UseGuards(JwtAuthGuard)
@Controller('property')
export class PropertyController {
  constructor(private propertyService: PropertyService) { }

  @ApiOperation({ summary: "Create new property" })
  @ApiResponse({ status: 200, description: "Successfully created", type: Property })
  @Post()
  create(@Body() propertyDto: PropertyDto) {
    return this.propertyService.createNewProperty(propertyDto);
  }

  @ApiOperation({ summary: "Get all propertys" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Property],
  })
  @Get()
  getAll() {
    return this.propertyService.getAllProperty();
  }

  @ApiOperation({ summary: "Get one property" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Property],
  })
  @Get("/:id")
  getOneTask(@Param('id') id: number) {
    return this.propertyService.getOneProperty(id);
  }

  @ApiOperation({ summary: "Edit property" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Property],
  })
  @Put("/update/:id")
  updateProperty(@Param('id') id: number, @Body() propertyDto: PropertyDto) {
    return this.propertyService.updateProperty(
    id,
    propertyDto,
    );
  }

  @ApiOperation({ summary: "Delete property" })
  @ApiResponse({
    status: 200,
    description: "Request completed successfully",
    type: [Property],
  })
  @Delete("/delete/:id")
  deleteTask(@Param('id') id: number) {
    this.propertyService.deleteProperty(id);
  }
}
