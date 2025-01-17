import { QueryOrderByColumn } from './generic-conditions.dto';
import { SearchArgs } from './search-args.dto';

export class CoreGetArguments {
  id?: number;
  slug?: string;
}

export class GetQueryDto extends SearchArgs {
  orderBy?: QueryOrderByColumn;
  parent?: number | string = 'null';
}
