import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { OrderFiles } from '../entities/order.entity';

export class OrderFilesPaginator extends Paginator<OrderFiles> {
  data: OrderFiles[];
}

export class GetOrderFilesDto extends SearchArgs {
  orderBy?: QueryOrderFilesOrderByColumn;
}

export enum QueryOrderFilesOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
