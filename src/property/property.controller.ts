import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PropertyService } from './property.service';
import PropertyDto from './dto/property.dto';
import Property from './entities/property.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';

@ApiTags('Property')
@ApiBearerAuth('token')
@UseGuards(JwtAuthGuard)
@Controller('property')
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @ApiOperation({ summary: 'Create new property' })
  @ApiResponse({ status: 200, description: 'Successfully created', type: Property })
  @Post()
  @UseInterceptors(
    FilesInterceptor('imagesUrl', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  create(@Body() propertyDto: any, @UploadedFiles() files: Express.Multer.File[]) {
    return this.propertyService.createNewProperty(propertyDto, files);
  }

  @ApiOperation({ summary: 'Get all propertys' })
  @ApiResponse({
    status: 200,
    description: 'Request completed successfully',
    type: [Property],
  })
  @Get()
  getAll() {
    return this.propertyService.getAllProperty();
  }

  @ApiOperation({ summary: 'Get one property' })
  @ApiResponse({
    status: 200,
    description: 'Request completed successfully',
    type: [Property],
  })
  @Get('/:id')
  getOneTask(@Param('id') id: number) {
    return this.propertyService.getOneProperty(id);
  }

  @ApiOperation({ summary: 'Edit property' })
  @ApiResponse({
    status: 200,
    description: 'Request completed successfully',
    type: [Property],
  })
  @Put('/update/:id')
  updateProperty(@Param('id') id: number, @Body() propertyDto: PropertyDto) {
    return this.propertyService.updateProperty(id, propertyDto);
  }

  @ApiOperation({ summary: 'Delete property' })
  @ApiResponse({
    status: 200,
    description: 'Request completed successfully',
    type: [Property],
  })
  @Delete('/delete/:id')
  deleteTask(@Param('id') id: number) {
    this.propertyService.deleteProperty(id);
  }
}
