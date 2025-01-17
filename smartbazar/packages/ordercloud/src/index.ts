import { Configuration } from 'ordercloud-javascript-sdk';

import Auth from './service/auth.service';
import Me from './service/me.service';
import Specs from './service/specs.service';
import Catalogs from './service/catalogs.service';
import Categories from './service/categories.service';
import Products from './service/products.service';
import Orders from './service/orders.service';
import Buyers from './service/buyers.service';
import Users from './service/users.service';
import Cart from './service/cart.service';
import AdminUsers from './service/adminusers.service';
import * as settings from './settings';
import * as helpers from './utils/helpers';

const init = () =>
  Configuration.Set({
    baseApiUrl: process?.env?.ORDERCLOUD_API_ENDPOINT,
  });

export default {
  init,
  settings,
  helpers,
  Me,
  AdminUsers,
  Auth,
  Specs,
  Catalogs,
  Categories,
  Buyers,
  Products,
  Orders,
  Cart,
  Users,
};
