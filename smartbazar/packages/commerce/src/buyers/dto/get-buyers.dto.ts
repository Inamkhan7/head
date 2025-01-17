import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { Buyer } from '../entities/buyer.entity';

export class BuyerPaginator extends Paginator<Buyer> {
  data: Buyer[];
}

export class GetBuyerDto extends SearchArgs {
  id?: string;
  orderBy?: string;
  is_active?: boolean;
}
