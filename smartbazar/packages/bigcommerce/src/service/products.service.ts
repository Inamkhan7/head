import { PriceSchedule } from 'ordercloud-javascript-sdk';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductPaginator,
} from '@packages/commerce/dist/products';

const getProducts = async (): Promise<ProductPaginator> => {
  return fetch(`${process?.env?.BIGCOMMERCE_STORE_API_URL}/v3/catalog/products`)
    .then((data) => data.json())
    .then((jsonData) => {
      return {
        data: [],
        count: 0,
        currentPage: 0,
        firstItem: 0,
        lastItem: 0,
        lastPage: 0,
        perPage: 0,
        total: 0,
        first_page_url: '',
        last_page_url: '',
        next_page_url: '',
        prev_page_url: '',
      };
    });
};

const getProduct = async (productId: string): Promise<Product> => {
  return null;
};

const createProduct = async (input: CreateProductDto): Promise<Product> => {
  return null;
};

const deleteProduct = async (productId: string): Promise<void> => {
  return;
};

const updateProduct = async (
  id: string,
  input: UpdateProductDto,
): Promise<Product> => {
  return null;
};

const getPriceSchedule = async (productId: string): Promise<PriceSchedule> => {
  return null;
};

export default {
  getProduct,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getPriceSchedule,
};
