import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { Product } from '../entities/product.entity';

export class ProductPaginator extends Paginator<Product> {
  data: Product[];
}

export class GetProductsDto extends SearchArgs {
  orderBy?: QueryProductsOrderByColumn;
}

export enum QueryProductsOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
