import axios from 'axios';
import {
  CreateOrderDto,
  OrderPaginator,
  Order,
} from '@packages/commerce/dist/orders';
import { Product } from '@packages/commerce/dist/products';
import {
  getOCAddress,
  mapAddress,
  mapAddresses,
} from '../mappers/address.mapper';
import { mapLineItemToOrderProduct } from '../mappers/lineItems.mappes';
import { mapOrders, mapOrder } from '../mappers/orders.mapper';
import { GetQueryDto, paginate } from '@packages/commerce';
import { mapToQueryOptions } from '../mappers/request-query.mapper';
import adminUsers from './adminusers.service';
import { getBaseUrl } from '../utils/helpers';

const createOrder = (orderDirection, billingAddress, shippingAddress) => {
  // return Orders.Create(orderDirection, {
  //   BillingAddress: billingAddress,
  //   BillingAddressID: billingAddress.ID,
  //   ShippingAddressID: shippingAddress.ID,
  // });
  return null;
};

const addLineItem = (orderDirection, orderId: string, lineItem) => {
  // return LineItems.Create(orderDirection, orderId, lineItem);
  return {};
};

const getCart = async () => {
  try {
    const { data: myCart } = await axios.get(`${getBaseUrl()}/me/active-cart`);
    return myCart;
  } catch (error) {
    console.error('GET_CART ERROR', error);
    return null;
  }
};

const createNewCart = async () => {
  try {
    const { data: myCart } = await axios.post(`${getBaseUrl()}/me/carts`, {
      currency: 'USD',
    });
    return myCart;
  } catch (error) {
    console.error('CREATE_NEW_CART ERROR', error);
    return null;
  }
};

const createLineItemAddressData = (cartVersion, user, actionType) => {
  const shippingAddress = user.address.find(
    (address) => address.type === 'shipping',
  );
  console.dir('WWWW', shippingAddress);
  return {
    version: cartVersion,
    actions: [
      {
        action: actionType,
        address: {
          key: 'exampleKey',
          title: 'My Address',
          salutation: '',
          firstName: user.name,
          lastName: 'Baggins',
          streetName: shippingAddress.address.street_address,
          streetNumber: '',
          additionalStreetInfo: '',
          postalCode: shippingAddress.address.postalCode,
          city: shippingAddress.address.city,
          region: '',
          state: '',
          country: shippingAddress.address.country,
          company: '',
          department: '',
          building: '',
          apartment: '',
          pOBox: '',
          phone: shippingAddress.address.phone,
          mobile: '',
          email: user.email,
          fax: '',
          additionalAddressInfo: 'no additional Info',
          externalId: 'Information not needed',
        },
      },
    ],
  };
};

const createLineItemData = (cartVersion, products, channelId) => ({
  version: cartVersion,
  actions: products.map((propduct) => ({
    action: 'addLineItem',
    productId: propduct.product_id,
    variantId: 1,
    quantity: propduct.order_quantity,
    supplyChannel: {
      typeId: 'channel',
      id: channelId,
    },
    distributionChannel: {
      typeId: 'channel',
      id: channelId,
    },
    // "externalTaxRate" : {
    //   "name" : "StandardExternalTaxRate",
    //   "amount" : 0.19,
    //   "country" : "US",
    //   "state" : "Delaware"
    // },
    shippingDetails: {
      targets: [
        {
          addressKey: 'exampleKey',
          quantity: propduct.order_quantity,
        },
      ],
    },
  })),
});

const updateCart = async (cartId, requestBody) => {
  try {
    console.log('OOOOO', requestBody);
    const { data: cart } = await axios.post(
      `${getBaseUrl()}/me/carts/${cartId}`,
      requestBody,
    );
    return cart;
  } catch (error) {
    console.error('UPDATE_CART ERROR', error);
    return null;
  }
};

const getChannels = async () => {
  try {
    const { data: channels } = await axios.get(`${getBaseUrl()}/channels`);
    return channels;
  } catch (error) {
    console.error('GET_CHANNELS ERROR', error);
    return null;
  }
};

const createOrderFromCart = async (cartId: string, version: string) => {
  try {
    const { data: order } = await axios.post(`${getBaseUrl()}/me/orders`, {
      id: cartId,
      version: version,
    });
    return order;
  } catch (error) {
    console.error('CREATE_ORDER_FROM_CART ERROR', error);
    return null;
  }
};

const createOrderFromShop = async (order: CreateOrderDto) => {
  try {
    const myCart = await getCart();
    let cart = myCart;
    let cartVersion = cart?.version;
    console.log('1111111', cart);

    if (!cart) {
      const newCart = await createNewCart();
      console.log('222222222', newCart);
      cart = newCart;
      cartVersion = newCart.version;
    }
    console.log('33333333');
    const user = await adminUsers.getAdminUser(cart.customerId);
    console.log('44444444', user);
    const lineItemAddress = createLineItemAddressData(
      cartVersion,
      user,
      'addItemShippingAddress',
    );
    console.log('55555555', lineItemAddress);
    const cartWithItemAddress = await updateCart(cart.id, lineItemAddress);
    console.log('66666666', cartWithItemAddress);
    cartVersion = cartWithItemAddress.version;

    const channels = await getChannels();
    console.log('77777777', channels);
    const lineItems = createLineItemData(
      cartVersion,
      order.products,
      channels.results[0].id,
    );
    console.log('88888888', lineItems);
    const cartWithLineItems = await updateCart(cart.id, lineItems);
    console.log('99999999', cartWithLineItems);
    cartVersion = cartWithLineItems.version;

    const shippingAddress = createLineItemAddressData(
      cartVersion,
      user,
      'setShippingAddress',
    );
    console.log('00000000', shippingAddress);
    const cartWithShippingAddress = await updateCart(cart.id, shippingAddress);
    console.log('++++++++', cartWithShippingAddress);
    cartVersion = cartWithShippingAddress.version;

    const newOrder = await createOrderFromCart(cart.id, cartVersion);
    console.log('LLLLL', newOrder);
    return mapOrder(newOrder);
  } catch (err) {
    console.error('ORDER error:', err);
  }
};

const getOrderProducts = (orderDirection, orderId: string) => {
  // return LineItems.List(orderDirection, orderId);
  return {};
};

const getOrderList = async (options: GetQueryDto): Promise<OrderPaginator> => {
  const queryOptions = mapToQueryOptions(options, 'Orders_List');
  const { data } = await axios.get(`${getBaseUrl()}/me/orders`);

  const pagination = paginate(
    data.total,
    options.page,
    20,
    data.count,
    `/orders?search=${options.search}&limit=${options.limit}`,
  );

  return {
    ...pagination,
    data: mapOrders(data.results),
  };
};

const getOrderById = async (orderId: string) => {
  const { data } = await axios.get(`${getBaseUrl()}/orders/${orderId}`);

  return mapOrder(data);
};

export default {
  createOrder,
  addLineItem,
  getOrderById,
  getOrderList,
  createOrderFromShop,
  getOrderProducts,
};
