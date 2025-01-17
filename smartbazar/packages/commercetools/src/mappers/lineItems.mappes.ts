import { Product } from '@packages/commerce/dist/products';

export const mapLineItemToOrderProduct = (lineItem): Product =>
  ({
    id: lineItem.Product.ID,
    name: lineItem.Product.Name,
    slug: lineItem.Product.xp?.slug,
    description: lineItem.Product.Description,
    product_type: lineItem.Product.xp?.product_type,
    price: lineItem.Product.xp?.price,
    type_id: '1',
    shop_id: 6,
    unit: lineItem.Product.xp?.unit,
    sku: lineItem.Product.xp?.sku,
    pivot: {
      order_quantity: lineItem.Quantity,
      subtotal: lineItem.LineTotal,
      unit_price: lineItem.UnitPrice,
    },
    in_stock: true,
    is_taxable: false,
    image: lineItem.Product.xp?.image,
    gallery: lineItem.Product.xp?.gallery,
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
