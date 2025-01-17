import { HttpService } from '@nestjs/axios';

export const axios = new HttpService();

export const getHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Auth-Token': process?.env?.BIGCOMMERCE_STORE_API_TOKEN,
  'X-Auth-Client': process?.env?.BIGCOMMERCE_STORE_API_CLIENT_ID,
});

export const getOrder = async (orderId: string) => {
  const headers = getHeaders();

  const response = await axios.axiosRef.get(
    `${process?.env?.BIGCOMMERCE_STORE_API_URL}/v2/orders/${orderId}`,
    { headers },
  );

  return response.data;
};

export const getOrderProducts = async (orderId: string) => {
  const headers = getHeaders();

  const response = await axios.axiosRef.get(
    `${process?.env?.BIGCOMMERCE_STORE_API_URL}/v2/orders/${orderId}/products`,
    { headers },
  );

  return response.data;
};

export const getOrderShippingAddress = async (orderId) => {
  const headers = getHeaders();

  const response = await axios.axiosRef.get(
    `${process?.env?.BIGCOMMERCE_STORE_API_URL}/v2/orders/${orderId}/shipping_addresses`,
    { headers },
  );

  return response.data;
};
