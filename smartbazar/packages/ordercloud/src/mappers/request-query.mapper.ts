import {
  SEARCH_MAP,
  FILTER_MAP,
  getValidSortKey,
  CommerceEntity,
  PARAMS,
} from '../utils';

export const mapSearchParams = (
  searchStr?: string,
  schemaName: CommerceEntity | 'Any' = 'Any',
) => {
  if (searchStr && SEARCH_MAP[schemaName]) {
    const mapSchema = SEARCH_MAP[schemaName];

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
  limit: 'pageSize',
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

const SORT_MAP = {
  updated_at: 'LastUpdated',
  created_at: '',
  name: 'Name',
  id: 'ID',
  description: 'Description',
};

export const mapSortingParams = (options, sortSchema: CommerceEntity) => {
  if (options?.orderBy && options?.sortedBy) {
    const direction = options.sortedBy.toLowerCase() === 'desc' ? '!' : '';
    const sortProp = SORT_MAP[options.orderBy];
    return sortProp && getValidSortKey(sortSchema, sortProp)
      ? {
          sortBy: `${direction}${sortProp}`,
        }
      : {};
  }
  return {};
};

export const mapCommonParams = (schema: CommerceEntity) =>
  FILTER_MAP[schema] || {};

export const mapParams = (schema: CommerceEntity, options = {}) =>
  Object.keys(options).reduce((acc, k) => {
    if (PARAMS[schema]?.[k]) {
      return {
        ...acc,
        [k]: options[k],
      };
    }

    return acc;
  }, {});

export const mapToQueryOptions = (options, schema: CommerceEntity) => ({
  ...mapParams(schema, options),
  ...mapCommonParams(schema),
  ...mapSearchParams(options?.search, schema),
  ...mapToPaginationParams(options),
  ...mapSortingParams(options, schema),
});
