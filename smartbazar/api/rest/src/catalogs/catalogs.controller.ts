import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CreateCatalogDto } from '@packages/commerce/dist/catalogs/dto/create-catalog.dto';
import { UpdateCatalogDto } from '@packages/commerce/dist/catalogs/dto/update-catalog.dto';
import { GetQueryDto } from '@packages/commerce/dist/common/dto/core-get-arguments.dto';

@Controller('types')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Post()
  create(@Body() createTypeDto: CreateCatalogDto) {
    return this.catalogsService.create(createTypeDto);
  }

  @Get()
  findAll(@Query() query: GetQueryDto) {
    return this.catalogsService.findAll(query);
  }

  @Get(':slug')
  getTypeBySlug(@Param('slug') slug: string) {
    return this.catalogsService.getTypeBySlug(slug);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTypeDto: UpdateCatalogDto) {
    return this.catalogsService.update(id, updateTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogsService.remove(id);
  }
}
