import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { OrderStatus } from '../entities/order-status.entity';

export class OrderStatusPaginator extends Paginator<OrderStatus> {
  data: OrderStatus[];
}

export class GetOrderStatusesDto extends SearchArgs {
  orderBy?: QueryOrderStatusesOrderByColumn;
}

export enum QueryOrderStatusesOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
