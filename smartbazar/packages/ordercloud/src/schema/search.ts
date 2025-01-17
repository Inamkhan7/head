import { SearchSchema } from '@packages/commerce/dist/utils';

export const searchSchema: SearchSchema = {
  'author.slug': 'userID',
  'categories.slug': 'categoryID',
  'manufacturer.slug': 'sellerID',
  name: 'name',
  status: 'active',
  'tags.slug': 'categoryID',
  'type.slug': 'catalogID',
  text: 'search',
  prop: 'search',
};

export const catalogSearchParams: Partial<SearchSchema> = {
  'type.slug': 'id',
  text: 'search',
  prop: 'search',
  name: 'name',
  status: 'active',
};

export type SearchParams = {
  [key: string]: string | boolean;
  id: string;
  search: string;
  userID: string;
  categoryID: string;
  sellerID: string;
  name: string;
  status: boolean;
  catalogID: string;
};
