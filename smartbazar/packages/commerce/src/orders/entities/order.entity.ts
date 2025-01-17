import { UserAddress } from '../../addresses/entities/address.entity';
import { CoreEntity } from '../../common/entities/core.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { File, Product } from '../../products/entities/product.entity';
import { Shop } from '../../shops/entities/shop.entity';
import { User } from '../../users/entities/user.entity';
import { OrderStatus } from './order-status.entity';

export enum PaymentGatewayType {
  STRIPE = 'stripe',
  CASH_ON_DELIVERY = 'cod',
}

export class Order extends CoreEntity {
  tracking_number: string;
  customer_id: number;
  customer_contact: string;
  customer: User;
  parent_order?: Order;
  children: Order[];
  status: OrderStatus;
  amount: number;
  sales_tax: number;
  total: number;
  paid_total: number;
  payment_id?: string;
  payment_gateway: PaymentGatewayType;
  coupon?: Coupon;
  shop: Shop;
  discount?: number;
  delivery_fee: number;
  delivery_time: string;
  products: Product[];
  billing_address: UserAddress;
  shipping_address: UserAddress;
}

export class OrderFiles extends CoreEntity {
  purchase_key: string;
  digital_file_id: number;
  order_id?: number;
  customer_id: number;
  file: File;
  fileable: Product;
}
