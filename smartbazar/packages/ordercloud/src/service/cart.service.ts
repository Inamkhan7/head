import { Cart } from 'ordercloud-javascript-sdk';
import {
  mapCartToOcOrder,
  mapItemToOcLineItem,
  mapItemToOcNewLineItem,
  mapOcCartToCart,
} from '../mappers/cart.mapper';
import Me from './me.service';

const getCart = async () => {
  const data = await Promise.all([Cart.Get(), Cart.ListLineItems()]);
  return mapOcCartToCart(data[0], data[1].Items);
};

const updateCart = async (cart) => {
  const cartData = mapCartToOcOrder(cart);
  const data = await Cart.Patch(cartData);
  return data;
};

const addCartItem = async (item) => {
  const lineItem = mapItemToOcNewLineItem(item);
  return await Cart.CreateLineItem(lineItem);
};

const updateCartItem = async (id, item) => {
  const lineItem = mapItemToOcLineItem(item);
  await Cart.PatchLineItem(id, lineItem);
};

const deleteCartItem = async (id) => {
  await Cart.DeleteLineItem(id);
};

const deleteCart = async () => {
  await Cart.Delete();
};

const submitCart = async () => {
  const order = await Cart.Submit();
  return Me.getOrder(order.ID);
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
