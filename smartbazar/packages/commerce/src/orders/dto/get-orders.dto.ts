import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { Order } from '../entities/order.entity';

export class OrderPaginator extends Paginator<Order> {
  data: Order[];
}

export class GetOrdersDto extends SearchArgs {
  tracking_number?: string;
  orderBy?: string;
  customer_id?: number;
  shop_id?: string;
}
