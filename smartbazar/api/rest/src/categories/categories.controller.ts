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
import { GetQueryDto } from '@packages/commerce/dist/common/dto/core-get-arguments.dto';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from '@packages/commerce/dist/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@packages/commerce/dist/categories/dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post(':catalogId')
  create(
    @Param('catalogId') catalogId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(catalogId, createCategoryDto);
  }

  @Get()
  findAll(@Query() query: GetQueryDto) {
    return this.categoriesService.getCategories(query);
  }

  @Get(':catalogId/:id')
  findOne(@Param('catalogId') catalogId: string, @Param('id') id: string) {
    return this.categoriesService.getCategory(catalogId, id);
  }

  @Put(':catalogId/:id')
  update(
    @Param('catalogId') catalogId: string,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(catalogId, id, updateCategoryDto);
  }

  @Delete(':catalogId/:id')
  remove(@Param('catalogId') catalogId: string, @Param('id') id: string) {
    return this.categoriesService.remove(catalogId, id);
  }
}
