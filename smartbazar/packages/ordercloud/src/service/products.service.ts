import {
  Products,
  Categories,
  PriceSchedules,
  PriceSchedule,
  Catalogs,
} from 'ordercloud-javascript-sdk';

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
import axios from 'axios';

const url =
  'https://aiengageconnector2.azurewebsites.net:443/api/Connector/triggers/When_a_HTTP_request_is_received/invoke?api-version=2022-05-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=8jznqKQjGUyV-DunJrgDLw75lCPr-EF6YSROBU3AoNg';

interface PostData {
  ProductId: string;
  ProductName: string;
  Description: string;
  Price: number;
  Quantity: number;
  Image: string;
  Category: string[];
}

const getProductCatalogId = async (productID: string) => {
  const productAssignment = await Catalogs.ListProductAssignments({
    productID,
  });

  return productAssignment.Items[0].CatalogID;
};

const getProductCategoryId = async (productID: string, catalogID: string) => {
  const categoryAsignment = await Categories.ListProductAssignments(catalogID, {
    productID,
  });

  return categoryAsignment.Items[0]?.CategoryID;
};

const getProducts = async (options: GetQueryDto): Promise<ProductPaginator> => {
  const queryOptions = mapToQueryOptions(options, 'Products_List');
  const catalogs = await catalogService.getCatalogs(
    options.search ? { search: options.search } : undefined,
  );
  const catalog = catalogs.data[0];
  const { Items, Meta } = await Products.List(queryOptions);

  const pagination = paginate(
    Meta.TotalCount,
    Meta.Page,
    Meta.PageSize,
    Meta.TotalCount,
    `/products?search=${options.search}&limit=${options.limit}`,
  );

  return {
    ...pagination,
    data: mapProducts(Items, catalog) as Product[],
  };
};

const getProduct = async (productID: string): Promise<Product> => {
  const product = await Products.Get(productID);
  const catalogID = await getProductCatalogId(productID);
  const categoryID = await getProductCategoryId(productID, catalogID);
  const category = categoryID
    ? await categorySevice.getCategory(catalogID, categoryID)
    : null;

  const catalogs = await catalogService.getCatalogs({
    search: `name:${catalogID}`,
  });
  return mapProduct(
    product,
    catalogs.data[0],
    category ? [category] : [],
  ) as Product;
};

const getPriceSchedule = async (
  PriceScheduleID: string,
): Promise<PriceSchedule> => {
  const priceschedule = await PriceSchedules.Get(PriceScheduleID);
  return priceschedule;
};

const createProduct = async (input: CreateProductDto): Promise<Product> => {
  const productInput = mapToProduct(input);
  console.log('UUU 1');
  const catalogId = input.type_id.toString();
  const { BuyerID, UserGroupID } = buyersService.getBuyer();
  console.log('UUU 2');
  const priceSchedule = await PriceSchedules.Create(mapToPriceSchedule(input));
  console.log('UUU 3');
  const product = await Products.Create({
    ...productInput,
    DefaultPriceScheduleID: priceSchedule.ID,
  });
  console.log('UUU 4');

  postToAzureIndex(url, input)
    .then((response) => {
      console.log('Successfully posted data:', response);
    })
    .catch((error) => {
      console.error('Failed to post data:', error);
    });

  await Promise.all(
    input.categories.map((categoryId) =>
      Categories.SaveProductAssignment(
        catalogId,
        mapToCategoryAssignment(categoryId.toString(), product.ID),
      ),
    ),
  );

  console.log('UUU 5');
  await Catalogs.SaveProductAssignment({
    CatalogID: catalogId,
    ProductID: product.ID,
  });

  console.log('UUU 6');
  await Products.SaveAssignment({
    BuyerID,
    ProductID: product.ID,
    UserGroupID,
  });

  console.log('UUU 7');
  const catalog = await catalogService.getCatalog(catalogId);
  console.log('UUU 8');
  const mappedProdut = mapProduct(product, catalog) as Product;
  console.log('UUU 9');
  return mappedProdut;
};

const deleteProduct = async (productID: string): Promise<void> => {
  const catalogID = await getProductCatalogId(productID);
  const categoryID = await getProductCategoryId(productID, catalogID);
  const { BuyerID, UserGroupID } = buyersService.getBuyer();
  await Products.DeleteAssignment(productID, BuyerID, {
    userGroupID: UserGroupID,
  });
  await Categories.DeleteProductAssignment(catalogID, categoryID, productID);
  await PriceSchedules.Delete(productID);
  await Products.Delete(productID);
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
    await PriceSchedules.Patch(id, { PriceBreaks: [{ Price: input.price }] });
  }

  if (diff.categories) {
    await Promise.all(
      product.categories.map(({ id: categoryId }) =>
        Categories.DeleteProductAssignment(catalogId, categoryId, id),
      ),
    );

    await Promise.all(
      input.categories.map((categoryId) =>
        Categories.SaveProductAssignment(
          catalogId,
          mapToCategoryAssignment(categoryId.toString(), id),
        ),
      ),
    );
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
    await Products.Patch(ID, productInput);
  }
};

const postToAzureIndex = async (
  url: string,
  data: CreateProductDto,
): Promise<any> => {
  try {
    // Make POST request to the URL with the data object as the body
    const postData: PostData = {
      ProductId: data.sku,
      ProductName: data.name,
      Description: data.description,
      Price: data.price,
      Quantity: data.quantity,
      Image: data.image.thumbnail,
      Category: data.categories,
    };
    const response = await axios.post(url, postData);

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error posting data:', error);
    throw error;
  }
};

export default {
  getProduct,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  postToAzureIndex,
  getPriceSchedule,
};
