import { GetQueryDto } from '@packages/commerce/dist/common';

const genericSearchMap = {
  'categories.slug': (ops, val) => ({ ...ops, 'categories:in': val }),
  name: (ops, val) => ({ ...ops, search: val }),
};

const catalogSearchMap = {
  ...genericSearchMap,
  'type.slug': (ops, val) => ({ ...ops, text: val, searchOn: 'ID' }),
};

const searchMap = {
  Any: genericSearchMap,
  catalog: catalogSearchMap,
};

export const mapSearchParams = (
  searchStr?: string,
  schemaName: keyof typeof searchMap = 'Any',
) => {
  if (searchStr) {
    const mapSchema = searchMap[schemaName];

    return searchStr?.split(';').reduce((ops, item) => {
      const [k, v] = item.split(':');
      const mapper = mapSchema[k];
      return mapper ? mapper(ops, v) : ops;
    }, {});
  }

  return {};
};

type Pagination = {
  limit?: number;
  page?: number;
};

const paginationMap = {
  limit: 'limit',
  page: 'page',
};

export const mapToPaginationParams = (pagination: Pagination) => {
  if (pagination) {
    return Object.keys(pagination).reduce((obj, ok) => {
      if (paginationMap[ok] && pagination[ok]) {
        return { ...obj, [paginationMap[ok]]: pagination[ok] };
      }
      return obj;
    }, {});
  }

  return {};
};

export const mapToQueryOptions = (
  options: GetQueryDto,
  schemaName: keyof typeof searchMap = 'Any',
) => ({
  ...mapSearchParams(options?.search, schemaName),
  ...mapToPaginationParams(options),
});

export const objectToQueryString = (obj: { [key: string]: string }) =>
  Object.keys(obj)
    .reduce((query, ok) => [...query, `${[ok]}=${obj[ok]}`], [])
    .join('&');
