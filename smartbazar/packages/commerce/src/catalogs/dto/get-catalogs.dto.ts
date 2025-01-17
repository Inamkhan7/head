import { SortOrder } from '../../common/dto/generic-conditions.dto';
import { SearchArgs } from '../../common/dto/search-args.dto';

export class GetCatalogsDto extends SearchArgs {
  orderBy?: QueryTypesOrderByOrderByClause[];
}

export class QueryTypesOrderByOrderByClause {
  column: QueryTypesOrderByColumn;
  order: SortOrder;
}

export enum QueryTypesOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
