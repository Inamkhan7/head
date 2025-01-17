import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { Withdraw } from '../entities/withdraw.entity';

export class WithdrawPaginator extends Paginator<Withdraw> {
  data: Withdraw[];
}

export class GetWithdrawsDto extends SearchArgs {
  orderBy?: string;
  status?: string;
  shop_id?: number;
}
