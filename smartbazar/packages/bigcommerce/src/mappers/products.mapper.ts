import { Product } from '@packages/commerce/dist/products';

export const mapBcProductToShopProduct = (bcProduct) => {
  const productImage = bcProduct.variants
    ? bcProduct.variants.find((item) => item.image_url)
    : bcProduct.images.find((image) => image.is_thumbnail);

  return {
    id: bcProduct.id,
    name: bcProduct.name,
    slug: bcProduct.id,
    description: bcProduct.description,
    product_type: 'simple',
    price: bcProduct.price,
    type_id: '1',
    shop_id: 2,
    unit: 'unit',
    quantity: 10,
    in_stock: bcProduct.out_of_stock !== 1,
    is_taxable: false,
    status: 'publish',
    image: productImage
      ? {
          id: productImage?.id,
          thumbnail: productImage?.url_thumbnail,
          original: productImage?.url_standard,
        }
      : {},
    gallery: bcProduct.images?.map((image) => ({
      id: image?.id,
      thumbnail: image?.url_thumbnail,
      original: image?.url_standard,
    })),
  };
};

export const mapBcProductsToShopProducts = (bcProducts) =>
  bcProducts.map(mapBcProductToShopProduct);

export const mapOrderProduct = (product): Product =>
  ({
    id: product.id,
    name: product.name,
    slug: product.id,
    description: product.description,
    product_type: product.type,
    price: Number(product.price_inc_tax),
    type_id: '1',
    shop_id: 6,
    unit: product.upc,
    sku: product.sku,
    pivot: {
      order_quantity: Number(product.quantity),
      subtotal: Number(product.total_inc_tax),
      unit_price: Number(product.price_inc_tax),
    },
    in_stock: true,
    is_taxable: false,
    image: product.xp?.image,
    gallery: product.xp?.gallery,
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
      },
    },
  } as Product);

export const mapOrderProducts = (products) => products.map(mapOrderProduct);
