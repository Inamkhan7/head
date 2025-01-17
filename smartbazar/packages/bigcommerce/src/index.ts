import Auth from './service/auth.service';
import Me from './service/me.service';
import Specs from './service/specs.service';
import Catalogs from './service/catalogs.service';
import Categories from './service/categories.service';
import Products from './service/products.service';
import Buyers from './service/buyers.service';
import Orders from './service/orders.service';
import Users from './service/users.service';
import Cart from './service/cart.service';
import * as helpers from './utils/helpers';
import * as settings from './settings';

const init = () => null;

export default {
  init,
  helpers,
  settings,
  Me,
  Auth,
  Specs,
  Catalogs,
  Buyers,
  Categories,
  Products,
  Orders,
  Cart,
  Users,
  AdminUsers: {
    getAdminUsers: () => null,
    createAdminUser: () => null,
    getAdminUser: () => null,
    updateAdminUser: () => null,
    deleteAdminUser: () => null,
  },
};
