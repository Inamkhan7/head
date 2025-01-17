import { Order as OCOrder } from 'ordercloud-javascript-sdk';
import { Order } from '@packages/commerce/dist/orders';
import { Product } from '@packages/commerce/dist/products';
import { Address } from '@packages/commerce/dist/addresses';
import { OrderStatus } from '../constants/orderStatus';

export const mapOrder = (
  order: OCOrder,
  orderProducts: Product[],
  shippingAddress?: Address,
  billingAddress?: Address,
) => ({
  id: order.ID,
  tracking_number: order.ID,
  status: {
    serial: OrderStatus[order.Status],
    name: order.Status,
  },
  created_at: new Date(order.DateCreated),
  amount: order.Subtotal,
  total: order.Total,
  discount: 0,
  delivery_fee: order.ShippingCost,
  sales_tax: order.TaxCost,
  shipping_address: shippingAddress?.address,
  billing_address: billingAddress?.address,
  products: orderProducts,
});

export const mapOrders = (
  orders: OCOrder[],
  addresses: Address[],
  products: Product[][],
): Order[] => {
  return orders.map((order, index) => {
    const shipping_address = addresses.find(
      (address) => address.id === order.ShippingAddressID,
    );
    const billing_address = addresses.find(
      (address) => address.id === order.BillingAddressID,
    );
    const orderProducts = products[index];
    return mapOrder(order, orderProducts, shipping_address, billing_address);
  }) as Order[];
};

export const mapAdminOrder = (order: OCOrder) =>
  ({
    id: order.ID,
    tracking_number: order.ID,
    status: {
      serial: OrderStatus[order.Status],
      name: order.Status,
    },
    created_at: new Date(order.DateCreated),
    amount: order.Subtotal,
    total: order.Total,
    discount: 0,
    delivery_fee: order.ShippingCost,
    sales_tax: order.TaxCost,
    shipping_address: {
      street_address: order.ShippingAddressID,
    },
  } as Order);

export const mapAdminOrders = (orders: OCOrder[]): Order[] =>
  orders.map(mapAdminOrder);
