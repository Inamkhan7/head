import { LineItems, Me, Orders } from 'ordercloud-javascript-sdk';
import uniqBy from 'lodash/uniqBy';
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
import { mapLineItemToOrderProduct } from '../mappers/lineItems.mappes';
import { mapToQueryOptions } from '../mappers/request-query.mapper';
import { mapPaginationOptions } from '../utils/pagination';

const getUser = async () => {
  try {
    const meResponse = await Me.Get();
    const addressesResponse = await getAddresses();
    return mapUser(meResponse, addressesResponse);
  } catch (err) {
    console.error('Get user error:', err);
  }
};

const getProducts = async (options: GetQueryDto): Promise<ProductPaginator> => {
  const queryOptions = mapToQueryOptions(options, 'Me_ListProducts');
  const { Items, Meta } = await Me.ListProducts(queryOptions);
  const catalogOptions = {
    ...options,
    search: options.search?.replace(/name:.*types/, 'types'),
  };
  const catalogs = await getCatalogs(catalogOptions);
  return {
    ...mapPaginationOptions('customer/products', Meta, options),
    data: mapMyProducts(Items, catalogs) as Product[],
  };
};

const getProduct = async (id: string): Promise<Product> => {
  const productResponse = await Me.GetProduct(id);
  const catalogs = await Me.ListCatalogs();
  const productCatalog = catalogs.Items.find(
    (item) => item.ID === productResponse.xp?.catalogID,
  );
  const groupCatalogs = catalogs.Items.filter(
    (item) => item.xp.settings?.group === productCatalog?.xp.settings?.group,
  )
    .map((item) => item.ID)
    .join('|');
  const relatedProductsResponse = await getProducts({
    search: `types:${groupCatalogs}`,
  });

  return mapMyProduct(productResponse, relatedProductsResponse.data) as Product;
};

const getProductsById = async (productIds: string[]): Promise<Product[]> => {
  const productsResponse = await Promise.all(
    productIds.map((id) => Me.GetProduct(id)),
  );
  const catalogs = await getCatalogs({});
  return mapMyProducts(productsResponse, catalogs) as Product[];
};

const getCatalogs = async (options: GetQueryDto): Promise<Catalog[]> => {
  const queryOptions = mapToQueryOptions(options, 'Me_ListCatalogs');
  const response = await Me.ListCatalogs(queryOptions);
  return mapCatalogsToTypes(response.Items) as Catalog[];
};

const getCatalog = async (id: string): Promise<Catalog> => {
  const response = await Me.GetCatalog(id);
  return mapCatalogToType(response) as Catalog;
};

const getCategories = async (options: GetQueryDto): Promise<Category[]> => {
  const { groups, ...queryOptions } = mapToQueryOptions(
    options,
    'Me_ListCategories',
  );
  const catalogsResponse = await getCatalogs(options);
  const categoriesResponse = groups?.length
    ? (
        await Promise.all(
          groups.map(({ catalogID }) =>
            Me.ListCategories({
              ...queryOptions,
              catalogID,
              depth: '2',
            }),
          ),
        )
      ).reduce((acc, { Items }) => ({ Items: [...acc.Items, ...Items] }), {
        Items: [],
      })
    : await Me.ListCategories({
        ...queryOptions,
        depth: '2',
      });
  const uniqCategories = uniqBy(categoriesResponse.Items, ({ ID }) => ID);
  return mapCategories([{ Items: uniqCategories }], catalogsResponse);
};

const getCategory = async (catalogId: string, categoryId: string) => {
  const catalogsResponse = await getCatalog(catalogId);
  const categoriesResponse = await Me.ListCategories({
    depth: '2',
    search: categoryId,
    sortBy: ['ID'],
    searchOn: ['ID'],
  });
  if (categoriesResponse.Items.length) {
    return mapCategory(categoriesResponse.Items[0], [], catalogsResponse);
  }

  return [];
};

const addAddress = async (address: UpdateAddressDto) => {
  const buyerAddress = getBuyerAddress(address);
  const addressResponse = await Me.CreateAddress(buyerAddress);
  return mapAddress(addressResponse);
};

const updateAddress = async (addressID: string, address: UpdateAddressDto) => {
  const buyerAddress = getBuyerAddress(address);
  await Me.PatchAddress(addressID, buyerAddress);
  return mapAddress({ ...buyerAddress, ID: addressID });
};

const getAddresses = async () => {
  const addressResponse = await Me.ListAddresses();
  return mapAddresses(addressResponse?.Items);
};

const deleteAddress = async (addressID: string) => {
  try {
    await Me.DeleteAddress(addressID);
    return true;
  } catch {
    return false;
  }
};

const getOrder = async (orderId) => {
  const order = await Orders.Get('Outgoing', orderId);
  const addresses = await getAddresses();
  const lineItems = await LineItems.List('Outgoing', orderId);

  const mappedOrderProducts = lineItems.Items.reduce(
    (products: Product[], item): Product[] => [
      ...products,
      mapLineItemToOrderProduct(item),
    ],
    [],
  );

  return mapOrders([order], addresses, [mappedOrderProducts])[0];
};

const getOrders = async () => {
  const orders = await Me.ListOrders();
  const addresses = await getAddresses();
  const lineItems = await Promise.all(
    orders.Items.map((order) => LineItems.List('Outgoing', order.ID)),
  );
  const mappedOrderProducts = lineItems.map((lineItem) =>
    lineItem.Items.reduce(
      (products: Product[], item): Product[] => [
        ...products,
        mapLineItemToOrderProduct(item),
      ],
      [],
    ),
  );
  return mapOrders(orders.Items, addresses, mappedOrderProducts);
};

const getOrderById = async (orderId: string) => {
  const order = await Me.ListOrders({ searchOn: ['ID'], search: orderId });
  const addresses = await getAddresses();
  const lineItems = await LineItems.List('Outgoing', orderId);
  const mappedOrderProducts = lineItems.Items.reduce(
    (products: Product[], item): Product[] => [
      ...products,
      mapLineItemToOrderProduct(item),
    ],
    [],
  );
  return mapOrders(order.Items, addresses, [mappedOrderProducts])[0];
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
