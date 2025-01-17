import axios from 'axios';
import {
  mapCartToOcOrder,
  mapItemToOcLineItem,
  mapItemToOcNewLineItem,
  mapOcCartToCart,
} from '../mappers/cart.mapper';
import Me from './me.service';
import { getBaseUrl } from '../utils/helpers';

const getCart = async () => {
  const { data } = await axios.get(`${getBaseUrl()}/me/active-cart`);
  return mapOcCartToCart(data, data.lineItems);
};

const updateCart = async (cart) => {
  const cartData = mapCartToOcOrder(cart);
  // const data = await Cart.Patch(cartData);
  return {};
};

const addCartItem = async (item) => {
  const lineItem = mapItemToOcNewLineItem(item);
  // const data = await Cart.CreateLineItem(lineItem);
  return {};
};

const updateCartItem = async (id, item) => {
  const lineItem = mapItemToOcLineItem(item);
  // await Cart.PatchLineItem(id, lineItem);
};

const deleteCartItem = async (id) => {
  // await Cart.DeleteLineItem(id);
};

const deleteCart = async () => {
  // await Cart.Delete();
};

const submitCart = async () => {
  const order = { id: null }; // await Cart.Submit();
  return Me.getOrder(order.id);
};

export default {
  getCart,
  deleteCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  submitCart,
  updateCart,
};
