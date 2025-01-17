import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { PriceSchedule } from '../entities/priceschedule.entity';

export class PriceSchedulePaginator extends Paginator<PriceSchedule> {
  data: PriceSchedule[];
}

export class GetPriceScheduleDto extends SearchArgs {
  orderBy?: QueryPriceScheduleByColumn;
}

export enum QueryPriceScheduleByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
