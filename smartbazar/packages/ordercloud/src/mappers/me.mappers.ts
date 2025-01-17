import { BuyerProduct } from 'ordercloud-javascript-sdk';
import { Product, ProductStatus } from '@packages/commerce/dist/products';
import { Catalog } from '@packages/commerce/dist/catalogs';
import { User } from '@packages/commerce/dist/users';

export const mapMyProduct = (
  product: BuyerProduct,
  relatedProducts?: Product[],
  catalog?: Catalog,
): Partial<Product> => ({
  id: product.ID,
  name: product.Name,
  slug: product.xp?.slug,
  description: product.Description,
  product_type: product.xp?.product_type,
  price: product.PriceSchedule?.PriceBreaks?.[0]?.Price,
  type_id: '1',
  catalog,
  shop_id: 6,
  unit: product.xp?.unit,
  sku: product.xp?.sku,
  quantity: product.Inventory.QuantityAvailable,
  in_stock: true,
  is_taxable: false,
  status: product.Active ? ProductStatus.PUBLISH : ProductStatus.DRAFT,
  image: product.xp?.image,
  gallery: product.xp?.gallery,
  related_products: relatedProducts,
  type: {
    id: '1',
    name: 'Grocery',
    slug: process.env?.BUYER_ID,
    image: {
      id: '',
      created_at: new Date(),
      updated_at: new Date(),
    },
    icon: '',
    key: 1,
    created_at: new Date(),
    updated_at: new Date(),
    settings: {
      isHome: true,
      layoutType: 'classic',
      productCard: 'neon',
      group: '',
    },
    active: true,
  },
});

export const mapMyProducts = (
  products: BuyerProduct[],
  catalogs: Catalog[],
): Partial<Product>[] =>
  products.map((product) =>
    mapMyProduct(
      product,
      [],
      catalogs.filter((catalog) => catalog.id === product.xp?.catalogID)[0],
    ),
  );

export const mapUser = (userResponse, addressResponse): User => ({
  username: userResponse.Username,
  id: userResponse.ID || '',
  name: userResponse.FirstName || '',
  is_active: userResponse.Active || true,
  email: userResponse.Email || '',
  created_at: new Date(userResponse.DateCreated),
  updated_at: new Date(userResponse.DateCreated),
  address: addressResponse,
});
