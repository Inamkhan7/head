import { HttpService } from '@nestjs/axios';
import { Order, CreateOrderDto } from '@packages/commerce/dist/orders';
import { mapOrder } from '../mappers/order.mapper';
import { objectToQueryString } from '../mappers/request-query.mapper';
import {
  getHeaders,
  getOrder,
  getOrderProducts,
  getOrderShippingAddress,
} from './common';

const axios = new HttpService();

const createOrder = (billingAddress, shippingAddress) => null;

const mapAddress = (inputAddress) => ({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.org',
  company: '',
  address1: inputAddress?.street_address,
  address2: '',
  city: inputAddress?.city,
  state_or_province: inputAddress?.state,
  state_or_province_code: inputAddress?.state,
  country_code: 'US',
  postal_code: inputAddress?.zip,
  phone: inputAddress?.phone,
});

const mapCartProducts = (orderProducts, products) =>
  orderProducts.map((item, index) => {
    const variant = products[index].variants.find(
      (variant) => variant.inventory_level > 0,
    );

    return {
      quantity: item.order_quantity,
      product_id: item.product_id,
      variant_id: variant.id,
      option_selections: [],
    };
  });

const getProductsFromCart = async (order: CreateOrderDto) => {
  const headers = getHeaders();
  const defaultParams = {
    is_visible: 'true',
    include: 'variants',
    'id:in': order.products.map((product) => product.product_id).join(','),
  };
  const queryParams = objectToQueryString(defaultParams);
  const response = await axios.axiosRef.get(
    `${process?.env?.BIGCOMMERCE_STORE_API_URL}/v3/catalog/products?${queryParams}`,
    {
      headers,
    },
  );
  return response.data.data;
};

const createCart = async (order: CreateOrderDto, products) => {
  const headers = getHeaders();
  const response = await axios.axiosRef.post(
    `${process?.env?.BIGCOMMERCE_STORE_API_URL}/v3/carts`,
    {
      line_items: mapCartProducts(order.products, products),
    },
    {
      headers,
    },
  );

  return response.data.data;
};

const createConsignment = async (order: CreateOrderDto, cart) => {
  const headers = getHeaders();
  const consignmentData = [
    {
      line_items: cart.line_items.physical_items.map((item) => ({
        item_id: item.id,
        quantity: item.quantity,
      })),
      shipping_address: mapAddress(order.shipping_address),
    },
  ];

  const response = await axios.axiosRef.post(
    `${process?.env?.BIGCOMMERCE_STORE_API_URL}/v3/checkouts/${cart.id}/consignments?includes=consignments.available_shipping_options`,
    consignmentData,
    {
      headers,
    },
  );

  return response.data.data;
};

const setShippingOption = async (
  cartId: string,
  consignmentId: string,
  shippingOptionId: string,
) => {
  const headers = getHeaders();
  const response = await axios.axiosRef.put(
    `${process?.env?.BIGCOMMERCE_STORE_API_URL}/v3/checkouts/${cartId}/consignments/${consignmentId}`,
    {
      shipping_option_id: shippingOptionId,
    },
    {
      headers,
    },
  );

  return response.data.data;
};

const createBillingAddress = async (order: CreateOrderDto, cartId: string) => {
  const headers = getHeaders();
  const billingAddress = mapAddress(order.billing_address);

  const response = await axios.axiosRef.post(
    `${process?.env?.BIGCOMMERCE_STORE_API_URL}/v3/checkouts/${cartId}/billing-address`,
    billingAddress,
    {
      headers,
    },
  );

  return response.data.data;
};

const registerAnOrder = async (cartId: string) => {
  const headers = getHeaders();

  const response = await axios.axiosRef.post(
    `${process?.env?.BIGCOMMERCE_STORE_API_URL}/v3/checkouts/${cartId}/orders`,
    undefined,
    {
      headers,
    },
  );

  return response.data.data;
};

const createOrderFromShop = async (
  orderInput: CreateOrderDto,
): Promise<Order> => {
  const products = await getProductsFromCart(orderInput);
  const cart = await createCart(orderInput, products);
  const checkout = await createConsignment(orderInput, cart);
  const consignment = checkout.consignments[0];
  const shippingOptionId = consignment.available_shipping_options[0].id;

  await setShippingOption(cart.id, consignment.id, shippingOptionId);
  await createBillingAddress(orderInput, cart.id);

  const order = await registerAnOrder(cart.id);
  const orderDetails = await getOrder(order.id);

  const orderProducts = await getOrderProducts(order.id);
  const shippingAddress = await getOrderShippingAddress(order.id);

  return mapOrder(orderDetails, orderProducts, shippingAddress[0]);
};

const getOrderList = () => {
  return null;
}

const getOrderById = (orderId:string) => {
  return null;
}

export default {
  createOrder,
  getOrderList,
  getOrderById,
  createOrderFromShop,
};
