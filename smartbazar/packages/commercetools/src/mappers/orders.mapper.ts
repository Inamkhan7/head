import { Order } from '@packages/commerce/dist/orders';
import { OrderStatus } from '../constants/orderStatus';

export const mapOrders = (orders): Order[] => {
  return orders.map(mapOrder) as Order[];
};

export const mapOrder = (order) => ({
  id: order.id,
  tracking_number: order.id,
  status: {
    serial: OrderStatus[order.orderState],
    name: order.orderState,
  },
  created_at: new Date(order.createdAt),
  amount: order.totalPrice.centAmount,
  total: order.totalPrice.centAmount,
  paid_total: order.totalPrice.centAmount,
  discount: 0,
  delivery_fee: order.taxedShippingPrice || 0,
  sales_tax: 0,
  billing_address: order.billingAddress?.address,
  customer_contact: order.shippingAddress.phone,
  shipping_address: {
    street_address: `${order.shippingAddress.streetName} ${order.shippingAddress.streetNumber}`,
    city: order.shippingAddress.city,
    state: order.shippingAddress.state,
    zip: order.shippingAddress.postalCode,
    country: order.shippingAddress.country,
  },
  customer: {
    name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
  },
  products: order.lineItems.map((item) => ({
    id: item.id,
    image: {
      thumbnail: item.variant.images[0].url,
    },
    name: item.name['en-US'],
    pivot: {
      order_quantity: item.quantity,
      subtotal: item.totalPrice.centAmount,
    },
    price: item.price.value.centAmount,
  })),
});
