import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { Coupon } from '../entities/coupon.entity';

export class CouponPaginator extends Paginator<Coupon> {
  data: Coupon[];
}

export class GetCouponsDto extends SearchArgs {
  orderBy?: QueryCouponsOrderByColumn;
}

export enum QueryCouponsOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
  CODE = 'CODE',
  AMOUNT = 'AMOUNT',
}
