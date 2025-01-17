import { Address } from '../../addresses/entities/address.entity';
import { CoreEntity } from '../../common/entities/core.entity';
import { Order } from '../../orders/entities/order.entity';
import { Shop } from '../../shops/entities/shop.entity';
import { Profile } from './profile.entity';

export class User extends CoreEntity {
  name: string;
  email: string;
  username: string;
  password?: string;
  shop_id?: number;
  profile?: Profile;
  shops?: Shop[];
  managed_shop?: Shop;
  is_active?: boolean = true;
  address?: Address[];
  orders?: Order[];
}
