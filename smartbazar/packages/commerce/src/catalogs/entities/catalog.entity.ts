import { Attachment } from '../../common/entities/attachment.entity';
import { CoreEntity } from '../../common/entities/core.entity';

export class Catalog extends CoreEntity {
  key: number;
  name: string;
  slug: string;
  image: Attachment;
  icon: string;
  banners?: Banner[];
  promotional_sliders?: Attachment[];
  settings?: CatalogSettings;
  logo?: Attachment;
  active: boolean;
}

export class Banner {
  id: number;
  title?: string;
  description?: string;
  image: Attachment;
}

export class CatalogSettings {
  isHome: boolean;
  layoutType: string;
  productCard: string;
  group: string;
}
