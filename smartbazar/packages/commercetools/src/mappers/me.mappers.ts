import {
  Product,
  ProductStatus,
  ProductType,
} from '@packages/commerce/dist/products';
import { Catalog } from '@packages/commerce/dist/catalogs';
import { User } from '@packages/commerce/dist/users';
import { Attachment } from '@packages/commerce/dist/common/entities/attachment.entity';

export const mapMyProduct = (
  product,
  relatedProducts?: Product[],
  catalog?: Catalog,
): Partial<Product> => ({
  id: product.id,
  name: product.masterData.current.name['en-US'],
  slug: product.masterData.current.slug['en-US'],
  description: product.masterData.current.description['en-US'],
  product_type: ProductType.SIMPLE,
  price:
    product.masterData.current.masterVariant.prices[0].value.centAmount /
    Math.pow(
      10,
      product.masterData.current.masterVariant.prices[0].value.fractionDigits,
    ),
  type_id: '1',
  catalog,
  shop_id: 6,
  unit: '2 lbs',
  sku: product.masterData.current.masterVariant.sku,
  quantity:
    product.masterData.current.masterVariant.availability.channels[
      '1ce8d8f8-facc-4c9a-816f-fcd46b9ba683'
    ].availableQuantity,
  in_stock:
    product.masterData.current.masterVariant.availability.channels[
      '1ce8d8f8-facc-4c9a-816f-fcd46b9ba683'
    ].isOnStock,
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
  products,
  catalogs: Catalog[],
): Partial<Product>[] =>
  products.map((product) =>
    mapMyProduct(
      product,
      [],
      catalogs.filter((catalog) => catalog.id === product.catalogId)[0],
    ),
  );

const getAddressTitle = (address) =>
  `${address?.streetName} ${address?.building}, ${address?.city}, ${address?.state} ${address?.postalCode}, ${address?.country}`;

const mapAddress = ({ addresses, billingAddressIds }) =>
  addresses.map((address) => {
    const isBillingAddress = billingAddressIds.includes(address.id);
    const type = isBillingAddress ? 'billing' : 'shipping';

    return {
      address: {
        city: address?.city,
        country: address?.country,
        phone: '+1 202-555-0156',
        state: address?.state,
        street_address: `${address?.streetName} ${address?.building}`,
        zip: parseFloat(address?.postalCode),
      },
      id: address.id,
      title: getAddressTitle(address),
      type,
    };
  });

export const mapUser = (userResponse): User => ({
  username: userResponse.email,
  id: userResponse.id || '',
  name: userResponse.firstName || '',
  is_active: userResponse.active || true,
  email: userResponse.email || '',
  created_at: new Date(userResponse.createdAt),
  updated_at: new Date(userResponse.lastModifiedAt),
  address: mapAddress(userResponse),
});
