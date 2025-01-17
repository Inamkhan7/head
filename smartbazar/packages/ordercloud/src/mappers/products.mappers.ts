import { kebabCase } from 'lodash';
import {
  CategoryProductAssignment,
  PriceSchedule,
} from 'ordercloud-javascript-sdk';
import { Product as OC_Product } from 'ordercloud-javascript-sdk/dist/models/Product';
import { Category } from '@packages/commerce/dist/categories';
import {
  CreateProductDto,
  Product,
  ProductStatus,
  UpdateProductDto,
} from '@packages/commerce/dist/products';
import { Catalog } from '@packages/commerce/dist/catalogs';

type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const mapProduct = (
  product: PartiallyOptional<OC_Product, 'Name'>,
  catalog: Catalog,
  categories?: Category[],
): Partial<Product> => ({
  id: product.ID,
  name: product?.Name,
  slug: product.xp?.slug,
  description: product.Description,
  product_type: product.xp?.product_type,
  categories: categories,
  price: product.xp?.price,
  type_id: catalog.id || product.xp?.catalogID,
  shop_id: 6,
  unit: product.xp?.unit,
  sku: product.xp?.sku,
  quantity: product.Inventory?.QuantityAvailable,
  in_stock: true,
  is_taxable: false,
  status: product.Active ? ProductStatus.PUBLISH : ProductStatus.DRAFT,
  image: product.xp?.image,
  gallery: product.xp?.gallery,
  type: catalog,
  tags: [],
});

export const mapProducts = (
  products: OC_Product[],
  catalog: Catalog,
): Partial<Product>[] =>
  products.map((product) => mapProduct(product, catalog));

export const mapToProduct = (
  product: CreateProductDto | UpdateProductDto,
): OC_Product => ({
  Name: product.name,
  Description: product.description,
  Active: product.status === 'publish',
  ID: kebabCase(product.name),
  Inventory: {
    QuantityAvailable: product.quantity,
  },
  xp: {
    image: product.image,
    unit: product.unit,
    product_type: product.product_type,
    price: product.price,
    sku: product.sku,
    sale_price: product.sale_price,
    gallery: product.gallery,
    slug: kebabCase(product.name),
    is_taxable: 0,
    catalogID: product.type_id,
    categories: product.categories,
  },
});

export const mapToPriceSchedule = (input: CreateProductDto): PriceSchedule => ({
  Name: input.name,
  ID: kebabCase(input.name),
  ApplyShipping: true,
  ApplyTax: true,
  MinQuantity: 1,
  UseCumulativeQuantity: false,
  RestrictedQuantity: false,
  PriceBreaks: [
    {
      Price: input.price,
      Quantity: 1,
    },
  ],
  IsOnSale: false,
});

export const mapToCategoryAssignment = (
  categoryId: string,
  productId: string,
): CategoryProductAssignment => ({
  CategoryID: categoryId,
  ProductID: productId,
});
