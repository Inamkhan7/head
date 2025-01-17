import { SearchArgs } from '../../common/dto/search-args.dto';

export class GetStaffsDto extends SearchArgs {
  orderBy?: string;
  shop_id?: string;
}
