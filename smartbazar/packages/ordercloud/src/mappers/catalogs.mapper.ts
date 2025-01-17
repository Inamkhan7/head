import { kebabCase } from 'lodash';
import { Catalog as OC_Catalog } from 'ordercloud-javascript-sdk';
import {
  UpdateCatalogDto,
  CreateCatalogDto,
  Catalog,
} from '@packages/commerce/dist/catalogs';

export const mapCatalogToType = (catalog: OC_Catalog, key = -1): Catalog => ({
  key: key + 1,
  id: catalog.ID,
  slug: catalog.ID,
  name: catalog.Name,
  icon: catalog.xp?.icon,
  banners: catalog.xp?.banners,
  promotional_sliders: catalog.xp?.promotional_sliders,
  settings: catalog.xp?.settings,
  image: catalog.xp?.image,
  created_at: catalog.xp?.created_at,
  updated_at: catalog.xp?.updated_at,
  logo: catalog.xp?.logo,
  active: catalog.Active,
});

export const mapCatalogsToTypes = (catalogs: OC_Catalog[]): Catalog[] =>
  catalogs.map((catalog, key) => mapCatalogToType(catalog, key));

export const mapTypeToCatalog = ({
  name,
  active,
  ...props
}: CreateCatalogDto | UpdateCatalogDto): OC_Catalog => ({
  ID: kebabCase(name),
  Name: name,
  Active: active,
  xp: {
    ...props,
  },
});
