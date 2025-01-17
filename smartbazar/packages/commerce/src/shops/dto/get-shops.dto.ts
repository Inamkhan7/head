import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { Shop } from '../entities/shop.entity';

export class ShopPaginator extends Paginator<Shop> {
  data: Shop[];
}

export class GetShopsDto extends SearchArgs {
  orderBy?: string;
  is_active?: boolean;
}
