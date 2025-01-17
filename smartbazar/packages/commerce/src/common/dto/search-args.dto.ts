import { SortOrder } from './generic-conditions.dto';
import { PaginationArgs } from './pagination-args.dto';

export class SearchArgs extends PaginationArgs {
  sortedBy?: SortOrder;
  search?: string;
  text?: string;
}
