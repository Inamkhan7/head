import { SearchArgs } from '../../common/dto/search-args.dto';
import { Paginator } from '../../common/dto/paginator.dto';
import { Manufacturer } from '../entities/manufacturer.entity';

export class ManufacturerPaginator extends Paginator<Manufacturer> {
  data: Manufacturer[];
}

export class GetManufacturersDto extends SearchArgs {
  orderBy?: QueryManufacturersOrderByColumn;
}

export enum QueryManufacturersOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
