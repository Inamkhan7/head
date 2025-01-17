import { Catalogs, Categories } from 'ordercloud-javascript-sdk';
import {
  Category,
  UpdateCategoryDto,
  CreateCategoryDto,
} from '@packages/commerce/dist/categories';
import { GetQueryDto } from '@packages/commerce/dist/common';
import {
  mapCategories,
  mapCategory,
  mapToCategory,
} from '../mappers/categories.mapper';
import catalogService from './catalogs.service';
import buyersService from './buyers.service';
import { mapPaginationOptions } from '../utils/pagination';
import { mapToQueryOptions } from '../mappers/request-query.mapper';
import { mapCatalogsToTypes } from '../mappers/catalogs.mapper';

const getCategories = async (options?: GetQueryDto) => {
  try {
    const queryOptions = mapToQueryOptions(options, 'Catalogs_List');
    const { Meta, Items } = await Catalogs.List(queryOptions);
    const catalogs = mapCatalogsToTypes(Items);
    const categories = await Promise.all(
      catalogs.map((catalog) =>
        Categories.List(catalog.id, {
          depth: '2',
        }),
      ),
    );

    return {
      ...mapPaginationOptions('categories', Meta, options),
      data: mapCategories(categories, catalogs),
    };
  } catch (err) {
    console.error(err);
  }
};

const getCategory = async (
  catalogId: string,
  categoryId: string,
): Promise<Category> => {
  const catalog = await catalogService.getCatalog(catalogId);
  const category = await Categories.Get(catalogId, categoryId);
  const parent = category.ParentID
    ? await await Categories.Get(catalogId, category.ParentID)
    : null;
  const mappedParent = parent ? mapCategory(parent, [], catalog) : null;
  return mapCategory(category, [], catalog, mappedParent);
};

const createCategory = async (
  catalogId: string,
  category: CreateCategoryDto,
): Promise<Category> => {
  const catalog = await catalogService.getCatalog(catalogId);
  console.log('OOO 1');
  const mappedCategory = mapToCategory(category, catalogId);
  console.log('OOO 2');
  const response = await Categories.Create(catalogId, mappedCategory);
  console.log('OOO 3');
  const { BuyerID, UserGroupID } = buyersService.getBuyer();
  console.log('OOO 4');
  await Categories.SaveAssignment(catalogId, {
    BuyerID,
    CategoryID: response.ID,
    UserGroupID,
    Visible: true,
    ViewAllProducts: true,
  });
  console.log('OOO 5');
  const data = mapCategory(response, [], catalog);
  console.log('OOO 6');
  return data;
};

const deleteCategory = async (
  catalogId: string,
  categoryId: string,
): Promise<void> => {
  const { BuyerID, UserGroupID } = buyersService.getBuyer();
  await Categories.DeleteAssignment(catalogId, categoryId, {
    buyerID: BuyerID,
    userGroupID: UserGroupID,
  });
  return Categories.Delete(catalogId, categoryId);
};

const updateCategory = async (
  catalogId: string,
  categoryId: string,
  category: UpdateCategoryDto,
): Promise<Category> => {
  const catalog = await catalogService.getCatalog(catalogId);
  const mappedCategory = mapToCategory(category, catalogId);
  const response = await Categories.Patch(
    catalogId,
    categoryId,
    mappedCategory,
  );
  return mapCategory(response, [], catalog);
};

export default {
  updateCategory,
  deleteCategory,
  createCategory,
  getCategories,
  getCategory,
};
