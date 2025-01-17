import axios from 'axios';
import { Product, ProductPaginator } from '@packages/commerce/dist/products';
import { UpdateAddressDto } from '@packages/commerce/dist/addresses';
import { GetQueryDto } from '@packages/commerce/dist/common';
import { Catalog } from '@packages/commerce/dist/catalogs';
import { Category } from '@packages/commerce/dist/categories';
import { mapCategories, mapCategory } from '../mappers/categories.mapper';
import {
  getBuyerAddress,
  mapAddress,
  mapAddresses,
} from '../mappers/address.mapper';
import { mapMyProducts, mapMyProduct, mapUser } from '../mappers/me.mappers';
import {
  mapCatalogsToTypes,
  mapCatalogToType,
} from '../mappers/catalogs.mapper';
import { mapOrders } from '../mappers/orders.mapper';
// import { mapLineItemToOrderProduct } from '../mappers/lineItems.mappes';
import { mapToQueryOptions } from '../mappers/request-query.mapper';
import { mapPaginationOptions } from '../utils/pagination';
import { getBaseUrl } from '../utils/helpers';

const getUser = async () => {
  try {
    const response = await axios.get(`${getBaseUrl()}/me`);
    return mapUser(response.data);
  } catch (err) {
    console.error('Get user error:', err);
  }
};

const getProducts = async (options: GetQueryDto): Promise<ProductPaginator> => {
  const queryOptions = mapToQueryOptions(options, 'Me_ListProducts');
  const response = await axios.get(`${getBaseUrl()}/products`);
  const catalogOptions = {
    ...options,
    search: options.search?.replace(/name:.*types/, 'types'),
  };
  const catalogs = await getCatalogs(catalogOptions);
  console.log('OOOO', response.data);
  return {
    ...mapPaginationOptions('customer/products', {}, options),
    data: mapMyProducts(response.data.results, catalogs) as Product[],
  };
};

const getProduct = async (id: string): Promise<Product> => {
  // const productResponse = await Me.GetProduct(id);
  // const catalogs = await Me.ListCatalogs();
  // const productCatalog = catalogs.Items.find(
  //   (item) => item.ID === productResponse.xp?.catalogID,
  // );
  const groupCatalogs = '';
  // catalogs.Items.filter(
  //   (item) => item.xp.settings?.group === productCatalog?.xp.settings?.group,
  // )
  //   .map((item) => item.ID)
  //   .join('|');
  const relatedProductsResponse = await getProducts({
    search: `types:${groupCatalogs}`,
  });

  return mapMyProduct({}, relatedProductsResponse.data) as Product;
};

const getProductsById = async (productIds: string[]): Promise<Product[]> => {
  // const productsResponse = await Promise.all(
  //   productIds.map((id) => Me.GetProduct(id)),
  // );
  const catalogs = await getCatalogs({});
  return mapMyProducts([], catalogs) as Product[];
};

const getCatalogs = async (options: GetQueryDto): Promise<Catalog[]> => {
  const queryOptions = mapToQueryOptions(options, 'Me_ListCatalogs');
  // const response = await Me.ListCatalogs(queryOptions);
  return mapCatalogsToTypes([]) as Catalog[];
};

const getCatalog = async (id: string): Promise<Catalog> => {
  // const response = await Me.GetCatalog(id);
  return mapCatalogToType({}) as Catalog;
};

const getCategories = async (options: GetQueryDto): Promise<Category[]> => {
  const { groups, ...queryOptions } = mapToQueryOptions(
    options,
    'Me_ListCategories',
  );
  const catalogsResponse = await getCatalogs(options);
  // const categoriesResponse = groups?.length
  //   ? (
  //       await Promise.all(
  //         groups.map(({ catalogID }) =>
  //           Me.ListCategories({
  //             ...queryOptions,
  //             catalogID,
  //             depth: '2',
  //           }),
  //         ),
  //       )
  //     ).reduce((acc, { Items }) => ({ Items: [...acc.Items, ...Items] }), {
  //       Items: [],
  //     })
  //   : await Me.ListCategories({
  //       ...queryOptions,
  //       depth: '2',
  //     });
  // const uniqCategories = uniqBy(categoriesResponse.Items, ({ ID }) => ID);
  return mapCategories([{ Items: [] }], catalogsResponse);
};

const getCategory = async (catalogId: string, categoryId: string) => {
  const catalogsResponse = await getCatalog(catalogId);
  // const categoriesResponse = await Me.ListCategories({
  //   depth: '2',
  //   search: categoryId,
  //   sortBy: ['ID'],
  //   searchOn: ['ID'],
  // });
  // if (categoriesResponse.Items.length) {
  //   return mapCategory(categoriesResponse.Items[0], [], catalogsResponse);
  // }

  return [];
};

const addAddress = async (address: UpdateAddressDto) => {
  const buyerAddress = getBuyerAddress(address);
  // const addressResponse = await Me.CreateAddress(buyerAddress);
  return mapAddress({}, [], [], '', '');
};

const updateAddress = async (addressID: string, address: UpdateAddressDto) => {
  const buyerAddress = getBuyerAddress(address);
  // await Me.PatchAddress(addressID, buyerAddress);
  return mapAddress({ ...buyerAddress, ID: addressID }, [], [], '', '');
};

const getAddresses = async () => {
  // const addressResponse = await Me.ListAddresses();
  return mapAddresses([], [], [], '', '');
};

const deleteAddress = async (addressID: string) => {
  try {
    // await Me.DeleteAddress(addressID);
    return true;
  } catch {
    return false;
  }
};

const getOrder = async (orderId) => {
  // const order = await Orders.Get('Outgoing', orderId);
  // const addresses = await getAddresses();
  // const lineItems = await LineItems.List('Outgoing', orderId);

  // const mappedOrderProducts = lineItems.Items.reduce(
  //   (products: Product[], item): Product[] => [
  //     ...products,
  //     mapLineItemToOrderProduct(item),
  //   ],
  //   [],
  // );

  return mapOrders([])?.[0];
};

const getOrders = async () => {
  const { data } = await axios.get(`${getBaseUrl()}/me/orders`);

  return mapOrders(data.results);
};

const getOrderById = async (orderId: string) => {
  // const order = await Me.ListOrders({ searchOn: ['ID'], search: orderId });
  // const addresses = await getAddresses();
  // const lineItems = await LineItems.List('Outgoing', orderId);
  // const mappedOrderProducts = lineItems.Items.reduce(
  //   (products: Product[], item): Product[] => [
  //     ...products,
  //     mapLineItemToOrderProduct(item),
  //   ],
  //   [],
  // );
  return mapOrders([])?.[0];
};

export default {
  getUser,
  getProduct,
  getProducts,
  getProductsById,
  getCatalogs,
  getCatalog,
  getCategories,
  getCategory,
  addAddress,
  updateAddress,
  getAddresses,
  deleteAddress,
  getOrders,
  getOrderById,
  getOrder,
};
