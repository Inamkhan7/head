import { HttpService } from '@nestjs/axios';
import { Catalog } from '@packages/commerce/dist/catalogs';
import { Category } from '@packages/commerce/dist/categories';
import { UpdateAddressDto } from '@packages/commerce/dist/addresses';
import { Product, ProductPaginator } from '@packages/commerce/dist/products';
import { GetQueryDto } from '@packages/commerce/dist/common';
import {
  mapBcProductsToShopProducts,
  mapBcProductToShopProduct,
} from '../mappers/products.mapper';
import {
  mapBcCategoriesToShopCategories,
  mapBcCategoryToShopCategory,
} from '../mappers/categories.mapper';
import {
  mapToQueryOptions,
  objectToQueryString,
} from '../mappers/request-query.mapper';
import { mapPaginationOptions } from '../utils/pagination';
import { mapOrder } from '../mappers/order.mapper';
import { getOrder, getOrderProducts, getOrderShippingAddress } from './common';

const axios = new HttpService();

const getUser = async () => null;

const getProducts = async (options: GetQueryDto): Promise<ProductPaginator> => {
  const defaultParams = {
    is_visible: 'true',
    include: 'images',
  };
  const queryParams = mapToQueryOptions(options, 'Any');
  const query = objectToQueryString({ ...defaultParams, ...queryParams });

  const { data } = await axios.axiosRef.get(
    `${process?.env?.BIGCOMMERCE_STORE_API_URL}/v3/catalog/products?${query}`,
    {
      headers: {
        'X-Auth-Token': process?.env?.BIGCOMMERCE_STORE_API_TOKEN,
      },
    },
  );

  return {
    ...mapPaginationOptions('customer/products', data.meta.pagination, options),
    data: mapBcProductsToShopProducts(data.data),
  };
};

const getProduct = async (id: string): Promise<Product> => {
  const { data } = await axios.axiosRef.get(
    `${process?.env?.BIGCOMMERCE_STORE_API_URL}/v3/catalog/products/${id}?include=images`,
    {
      headers: {
        'X-Auth-Token': process?.env?.BIGCOMMERCE_STORE_API_TOKEN,
      },
    },
  );

  return mapBcProductToShopProduct(data.data) as Product;
};

const getProductsById = () => null;

const catalog = {
  id: 'ametek-stc',
  key: 1,
  slug: 'ametek-stc',
  name: 'Ametek STC',
  icon: 'FurnitureIcon',
  logo: {
    id: 'vkufjozl3l1s5vsjrozf',
    original:
      'https://res.cloudinary.com/dve197bop/image/upload/q_auto:eco/v1665700676/vkufjozl3l1s5vsjrozf.png',
    thumbnail:
      'https://res.cloudinary.com/dve197bop/image/upload/q_auto:eco/v1665700676/vkufjozl3l1s5vsjrozf.png',
  },
  banners: [
    {
      id: 12,
      title: 'Pressure measurement and hardness testing',
      description:
        'High-quality products within hardness testing, pressure measurement, temperature calibration',
      image: {
        id: 'jnsjhviidsfh8qk8ct7o',
        original:
          'https://res.cloudinary.com/dve197bop/image/upload/q_auto:eco/v1665700689/jnsjhviidsfh8qk8ct7o.png',
        thumbnail:
          'https://res.cloudinary.com/dve197bop/image/upload/q_auto:eco/v1665700689/jnsjhviidsfh8qk8ct7o.png',
        created_at: new Date('2021-07-17T13:21:55+00:00'),
        updated_at: new Date('2021-07-17T13:21:55+00:00'),
      },
    },
  ],
  settings: {
    isHome: true,
    layoutType: 'classic',
    productCard: 'neon',
  },
  created_at: new Date('2021-03-08T07:18:25+00:00'),
  updated_at: new Date('2021-08-18T17:12:14+00:00'),
} as Catalog;

const getCatalogs = async (search?: GetQueryDto): Promise<Catalog[]> =>
  Promise.resolve([catalog]);

const getCatalog = async (id: string): Promise<Catalog> =>
  Promise.resolve(catalog);

type Img = {
  id: string;
  thumbnail: string;
  original: string;
};

type ProductItem = {
  image: Img;
};

const getCategories = async (): Promise<Category[]> => {
  const { data } = await axios.axiosRef.get(
    `${process?.env?.BIGCOMMERCE_STORE_API_URL}/v3/catalog/categories?is_visible=true`,
    {
      headers: {
        'X-Auth-Token': process?.env?.BIGCOMMERCE_STORE_API_TOKEN,
      },
    },
  );

  const products = await Promise.all(
    data?.data?.map((category) =>
      getProducts({ search: `categoryID:${category.id}` }),
    ),
  );

  const categoriesWithImages = data?.data?.map((item, index) => ({
    ...item,
    image: (products[index] as ProductPaginator)?.data?.find(
      (prd) => prd?.image.thumbnail,
    )?.image,
  }));

  return mapBcCategoriesToShopCategories(categoriesWithImages).filter(
    (item) => item.name !== 'Shop All',
  );
};

const getCategory = async (catalogId: string, categoryId: string) => {
  return axios.axiosRef
    .get(
      `${process?.env?.BIGCOMMERCE_STORE_API_URL}/v3/catalog/categories/${categoryId}`,
      {
        headers: {
          'X-Auth-Token': process?.env?.BIGCOMMERCE_STORE_API_TOKEN,
        },
      },
    )
    .then(({ data }) => mapBcCategoryToShopCategory(data.data));
};

const addAddress = async (address: UpdateAddressDto) => null;

const updateAddress = async (addressID: string, address: UpdateAddressDto) =>
  null;

const getAddresses = async () => Promise.resolve([]);

const deleteAddress = async (addressID: string) => null;

const getOrders = async () => Promise.resolve([]);

const getOrderById = async (orderId: string) => {
  const orderDetails = await getOrder(orderId);

  const orderProducts = await getOrderProducts(orderId);
  const shippingAddress = await getOrderShippingAddress(orderId);
  return mapOrder(orderDetails, orderProducts, shippingAddress[0]);
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
};
