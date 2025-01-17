import axios from 'axios';
import { difference } from '@packages/commerce/dist/utils';
import {
  Product,
  ProductPaginator,
  UpdateProductDto,
  CreateProductDto,
} from '@packages/commerce/dist/products';
import { paginate, GetQueryDto } from '@packages/commerce/dist/common';
import catalogService from './catalogs.service';
import categorySevice from './categories.service';
import buyersService from './buyers.service';
import { mapToQueryOptions } from '../mappers/request-query.mapper';
import {
  mapProduct,
  mapProducts,
  mapToCategoryAssignment,
  mapToPriceSchedule,
  mapToProduct,
} from '../mappers/products.mappers';
import { getBaseUrl } from '../utils/helpers';
import { PriceSchedule } from 'ordercloud-javascript-sdk';

const getProductCatalogId = async (productID: string) => {
  // const productAssignment = await Catalogs.ListProductAssignments({
  //   productID,
  // });

  return ''; // productAssignment.Items[0].CatalogID;
};

const getProductCategoryId = async (productID: string, catalogID: string) => {
  // const categoryAsignment = await Categories.ListProductAssignments(catalogID, {
  //   productID,
  // });

  return ''; // categoryAsignment.Items[0]?.CategoryID;
};

const getProducts = async (options: GetQueryDto): Promise<ProductPaginator> => {
  const queryOptions = mapToQueryOptions(options, 'Products_List');
  const catalogs = await catalogService.getCatalogs(
    options.search ? { search: options.search } : undefined,
  );
  const catalog = catalogs.data[0];
  const response = await axios.get(`${getBaseUrl()}/products`, {
    params: queryOptions,
  });

  const pagination = paginate(
    response.data.limit, // Meta.TotalCount,
    1, // Meta.Page,
    response.data.limit, // Meta.PageSize,
    response.data.total, // Meta.TotalCount,
    `/products?search=${options.search}&limit=${options.limit}`,
  );

  return {
    ...pagination,
    data: mapProducts(
      response.data.results,
      catalog,
      queryOptions.buyer,
    ) as Product[],
  };
};

const getProduct = async (productID: string): Promise<Product> => {
  // const product = await Products.Get(productID);
  const catalogID = await getProductCatalogId(productID);
  const categoryID = await getProductCategoryId(productID, catalogID);
  const category = categoryID
    ? await categorySevice.getCategory(catalogID, categoryID)
    : null;

  const catalogs = await catalogService.getCatalogs({
    search: `name:${catalogID}`,
  });
  return mapProduct(
    {},
    catalogs.data[0],
    undefined,
    category ? [category] : [],
  ) as Product;
};

const getPriceSchedule = async (productID: string): Promise<PriceSchedule> => {
  // const product = await Products.Get(productID);
  return null;
};

const createProduct = async (input: CreateProductDto): Promise<Product> => {
  const productInput = mapToProduct(input);
  const catalogId = input.type_id.toString();
  const { BuyerID, UserGroupID } = buyersService.getBuyer();
  // const priceSchedule = await PriceSchedules.Create(mapToPriceSchedule(input));
  // const product = await Products.Create({
  //   ...productInput,
  //   DefaultPriceScheduleID: priceSchedule.ID,
  // });
  // await Promise.all(
  //   input.categories.map((categoryId) =>
  //     Categories.SaveProductAssignment(
  //       catalogId,
  //       mapToCategoryAssignment(categoryId.toString(), product.ID),
  //     ),
  //   ),
  // );

  // await Catalogs.SaveProductAssignment({
  //   CatalogID: catalogId,
  //   ProductID: product.ID,
  // });

  // await Products.SaveAssignment({
  //   BuyerID,
  //   ProductID: product.ID,
  //   UserGroupID,
  // });

  const catalog = await catalogService.getCatalog(catalogId);
  const mappedProdut = mapProduct({}, catalog, undefined) as Product;
  return mappedProdut;
};

const deleteProduct = async (productID: string): Promise<void> => {
  const catalogID = await getProductCatalogId(productID);
  const categoryID = await getProductCategoryId(productID, catalogID);
  const { BuyerID, UserGroupID } = buyersService.getBuyer();
  // await Products.DeleteAssignment(productID, BuyerID, {
  //   userGroupID: UserGroupID,
  // });
  // await Categories.DeleteProductAssignment(catalogID, categoryID, productID);
  // await PriceSchedules.Delete(productID);
  // await Products.Delete(productID);
  return null;
};

const updateProduct = async (id: string, input: UpdateProductDto) => {
  const product = await getProduct(id);
  const diff: Partial<Product> = difference(
    { ...product, categories: product.categories.map(({ id }) => id) },
    input,
  );

  const catalogId = input.type_id.toString();
  const { ID, ...productInput } = mapToProduct(input);

  if (diff.price) {
    // await PriceSchedules.Patch(id, { PriceBreaks: [{ Price: input.price }] });
  }

  if (diff.categories) {
    // await Promise.all(
    //   product.categories.map(({ id: categoryId }) =>
    //     Categories.DeleteProductAssignment(catalogId, categoryId, id),
    //   ),
    // );
    // await Promise.all(
    //   input.categories.map((categoryId) =>
    //     Categories.SaveProductAssignment(
    //       catalogId,
    //       mapToCategoryAssignment(categoryId.toString(), id),
    //     ),
    //   ),
    // );
  }

  if (
    diff.description ||
    diff.gallery ||
    diff.name ||
    diff.unit ||
    diff.status ||
    diff.image ||
    diff.sku ||
    diff.quantity ||
    diff.price ||
    diff.categories
  ) {
    // await Products.Patch(ID, productInput);
  }
};

export default {
  getProduct,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getPriceSchedule,
};
