import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ImportationsService } from './importations.service';
import { Prisma } from '@prisma/client';

@Controller('importations')
export class ImportationsController {
  constructor(private readonly importationsService: ImportationsService) {}

  @Post()
  create(@Body() createImportationDto: Prisma.ImportationsCreateInput) {
    return this.importationsService.create(createImportationDto);
  }

  @Get()
  findAll() {
    return this.importationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImportationDto: Prisma.ImportationsUpdateInput,
  ) {
    return this.importationsService.update(+id, updateImportationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.importationsService.remove(+id);
  }
}
