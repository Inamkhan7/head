import { SortOrder } from '../../common/dto/generic-conditions.dto';
import { PaginationArgs } from '../../common/dto/pagination-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { Product } from '../../products';

export class ProductPaginator extends Paginator<Product> {
  data: Product[];
}

export class GetProductsDto extends PaginationArgs {
  orderBy?: QueryProductsOrderByColumn;
  sortedBy?: SortOrder;
  search?: string;
}

export enum QueryProductsOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
