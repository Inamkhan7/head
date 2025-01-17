import { SortOrder } from '../../common/dto/generic-conditions.dto';
import { PaginationArgs } from '../../common/dto/pagination-args.dto';

export class GetCategoriesDto extends PaginationArgs {
  sortedBy?: SortOrder;
  search?: string;
}
