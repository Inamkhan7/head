import { LineItem, Order } from 'ordercloud-javascript-sdk';
import {
  AddCartItemDto,
  GetCartDto,
  UpdateCartDto,
} from '@packages/commerce/dist/customer';

export const mapOcCartToCart = (
  cart: Order,
  lineItems: LineItem[],
): GetCartDto => {
  if (lineItems) {
    return {
      items: lineItems?.map((item) => ({
        productId: item.ProductID,
        name: item.Product.Name,
        id: item.ID,
        image: item.Product.xp.image.thumbnail,
        itemTotal: item.LineTotal,
        price: item.UnitPrice,
        quantity: item.Quantity,
        stock: item.xp?.stock,
        unit: item.Product.xp.unit,
      })),
      isEmpty: !lineItems || lineItems.length === 0,
      total: cart.Total,
      totalItems: lineItems?.length,
      totalUniqueItems: lineItems?.length,
      billing_address: cart.BillingAddressID,
      shipping_address: cart.ShippingAddressID,
    };
  }

  return {
    items: [],
    isEmpty: true,
    total: 0,
    totalItems: 0,
    totalUniqueItems: 0,
  };
};

export const mapCartToOcOrder = (cart: UpdateCartDto): Order => {
  return {
    BillingAddressID: cart?.billing_address?.id,
    ShippingAddressID: cart?.shipping_address?.id,
  };
};

export const mapItemToOcLineItem = (item: AddCartItemDto): LineItem => {
  return {
    ID: item.id?.toString(),
    ProductID: item.productId?.toString(),
    Quantity: item.quantity,
    UnitPrice: item.price,
    xp: {
      stock: item.stock,
    },
  };
};

export const mapItemToOcNewLineItem = (item: AddCartItemDto): LineItem => {
  return {
    ProductID: item.id?.toString(),
    Quantity: item.quantity,
    xp: {
      stock: item.stock,
    },
  };
};
