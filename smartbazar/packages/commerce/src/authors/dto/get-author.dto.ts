import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';

import { Author } from '../entities/author.entity';

export class AuthorPaginator extends Paginator<Author> {
  data: Author[];
}

export class GetAuthorDto extends SearchArgs {
  orderBy?: QueryAuthorsOrderByColumn;
}

export enum QueryAuthorsOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
