import { Injectable } from '@nestjs/common';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@packages/commerce/dist/categories';
import { GetQueryDto } from '@packages/commerce/dist/common';
import { Category } from '@packages/commerce/dist/categories';
import CommerceProvider from '../providers';
@Injectable()
export class CategoriesService {
  async create(catalogId: string, createCategoryDto: CreateCategoryDto) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Categories.createCategory(catalogId, createCategoryDto);
  }

  async getCategories(options?: GetQueryDto) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Categories.getCategories(options);
  }

  async getCategory(catalogId: string, id: string): Promise<Category> {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Categories.getCategory(catalogId, id);
  }

  async update(
    catalogId: string,
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Categories.updateCategory(
      catalogId,
      id,
      updateCategoryDto,
    );
  }

  async remove(catalogId: string, categoryId: string) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Categories.deleteCategory(catalogId, categoryId);
  }
}
