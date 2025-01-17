import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { Category } from '../entities/category.entity';

export class CategoryPaginator extends Paginator<Category> {
  data: Category[];
}

export class GetCategoriesDto extends SearchArgs {
  orderBy?: QueryCategoriesOrderByColumn;
  parent?: number | string = 'null';
}

export enum QueryCategoriesOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
