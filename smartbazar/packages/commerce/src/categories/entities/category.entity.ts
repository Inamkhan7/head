import { Attachment } from '../../common/entities/attachment.entity';
import { CoreEntity } from '../../common/entities/core.entity';
import { Product } from '../../products/entities/product.entity';
import { Catalog } from '../../catalogs/entities/catalog.entity';

export class Category extends CoreEntity {
  name: string;
  slug: string;
  parent?: Category;
  parent_id?: string;
  children?: Category[];
  details?: string;
  image?: Attachment;
  icon?: string;
  type?: Catalog;
  products?: Product[];
}
