import { Order } from '@packages/commerce/dist/orders';
import { mapOrderProducts } from './products.mapper';

export const mapOrder = (order, orderProducts, shippingAddress): Order =>
  ({
    id: order.id,
    tracking_number: order.id,
    status: {
      serial: order.status_id,
      name: order.status,
    },
    created_at: order.date_created,
    amount: Number(order.subtotal_inc_tax),
    total: Number(order.subtotal_inc_tax) + Number(order.shipping_cost_inc_tax),
    discount: Number(order.discount_amount),
    delivery_fee: Number(order.shipping_cost_inc_tax),
    sales_tax: Number(order.subtotal_tax),
    shipping_address: {
      street_address: [shippingAddress.street_1, shippingAddress.street_2]
        .filter((i) => i?.length)
        .join(', '),
      country: shippingAddress.country,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip: shippingAddress.zip,
      phone: shippingAddress.phone,
    },
    billing_address: {
      street_address: [
        order.billing_address.street_1,
        order.billing_address.street_2,
      ]
        .filter((i) => i?.length)
        .join(', '),
      country: order.billing_address.country,
      city: order.billing_address.city,
      state: order.billing_address.state,
      zip: order.billing_address.zip,
      phone: order.billing_address.phone,
    },
    products: mapOrderProducts(orderProducts),
  } as Order);
