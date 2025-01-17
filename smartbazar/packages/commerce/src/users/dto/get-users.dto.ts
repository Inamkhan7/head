import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { User } from '../entities/user.entity';

export class UserPaginator extends Paginator<User> {
  data: User[];
}

export class GetUsersDto extends SearchArgs {
  orderBy?: QueryUsersOrderByColumn;
}

export enum QueryUsersOrderByColumn {
  NAME = 'name',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}
