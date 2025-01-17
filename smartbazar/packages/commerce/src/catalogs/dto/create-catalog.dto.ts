import { PickType } from '@nestjs/swagger';
import { Catalog } from '../../catalogs/entities/catalog.entity';

export class CreateCatalogDto extends PickType(Catalog, [
  'name',
  'image',
  'icon',
  'banners',
  'promotional_sliders',
  'settings',
  'active',
]) {}
