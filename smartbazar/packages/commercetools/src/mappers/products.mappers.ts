import { kebabCase } from 'lodash';
import { Category } from '@packages/commerce/dist/categories';
import {
  CreateProductDto,
  Product,
  ProductStatus,
  ProductType,
  UpdateProductDto,
} from '@packages/commerce/dist/products';
import { Catalog } from '@packages/commerce/dist/catalogs';
import { Attachment } from '@packages/commerce/dist/common/entities/attachment.entity';

type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

const getPrice = (prices, channelId?: string) => {
  const defaultPrice =
    prices[0]?.value.centAmount / Math.pow(10, prices[0]?.value.fractionDigits);

  if (channelId) {
    const price = prices.find((item) => item.channel.id === channelId);
    if (price) {
      return price.value.centAmount / Math.pow(10, price.value.fractionDigits);
    }
    return defaultPrice;
  }
  return defaultPrice;
};

export const mapProduct = (
  product,
  catalog: Catalog,
  channelId: string,
  categories?: Category[],
): Partial<Product> => ({
  id: product.id,
  name: product.masterData.current.name['en-US'],
  slug: product.masterData.current.slug['en-US'],
  description: product.masterData.current.description['en-US'],
  product_type: ProductType.SIMPLE,
  price: getPrice(product.masterData.current.masterVariant.prices, channelId),
  categories: categories,
  type_id: catalog?.id || '1',
  shop_id: 6,
  unit: '2 lbs',
  sku: product.masterData.current.masterVariant.sku,
  quantity:
    product.masterData.current.masterVariant.availability.channels[channelId]
      ?.availableQuantity,
  in_stock:
    product.masterData.current.masterVariant.availability.channels[channelId]
      ?.isOnStock,
  is_taxable: false,
  status: product.masterData.published
    ? ProductStatus.PUBLISH
    : ProductStatus.DRAFT,
  image: {
    id: product.masterData.current.masterVariant.images[0].url
      .split('/')[3]
      .split('.')[0],
    thumbnail: product.masterData.current.masterVariant.images[0].url,
    original: product.masterData.current.masterVariant.images[0].url,
  } as Attachment,
  gallery: product.masterData.current.masterVariant.images.map((image) => ({
    id: image.url.split('/')[3].split('.')[0],
    thumbnail: image.url,
    original: image.url,
  })),
  type: catalog,
  tags: [],
});

export const mapProducts = (
  products,
  catalog: Catalog,
  channelId: string,
): Partial<Product>[] =>
  products.map((product) => mapProduct(product, catalog, channelId));

export const mapToProduct = (product: CreateProductDto | UpdateProductDto) => ({
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

export const mapToPriceSchedule = (input: CreateProductDto) => ({
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
) => ({
  CategoryID: categoryId,
  ProductID: productId,
});
