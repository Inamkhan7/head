import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { Tag } from '../entities/tag.entity';

export class TagPaginator extends Paginator<Tag> {
  data: Tag[];
}

export class GetTagsDto extends SearchArgs {
  orderBy?: QueryTagsOrderByColumn;
  name?: string;
  hasType?: string;
}

export enum QueryTagsOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
