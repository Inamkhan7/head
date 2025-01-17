import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@packages/commerce/dist/categories';
import { GetQueryDto } from '@packages/commerce/dist/common';

const getCategories = async (options?: GetQueryDto) => Promise.resolve([]);

const getCategory = async (catalogId: string, id: string): Promise<Category> =>
  null;

const createCategory = async (
  catalogId: string,
  category: CreateCategoryDto,
): Promise<Category> => null;

const deleteCategory = async (
  catalogId: string,
  categoryId: string,
): Promise<void> => null;

const updateCategory = async (
  catalogId: string,
  categoryId: string,
  category: UpdateCategoryDto,
): Promise<Category> => null;

export default {
  updateCategory,
  deleteCategory,
  createCategory,
  getCategories,
  getCategory,
};
