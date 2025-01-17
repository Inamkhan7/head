import { toQueryString } from '@packages/commerce/dist/utils';
import { paginate, GetQueryDto } from '@packages/commerce/dist/common';

type Meta = {
  total: number;
  current_page: number;
  per_page: number;
  count: number;
};

export const mapPaginationOptions = (
  endpointUrl: string,
  meta: Meta,
  options?: GetQueryDto,
) =>
  paginate(
    meta.total,
    meta.current_page,
    meta.per_page,
    meta.total,
    options
      ? `/${endpointUrl}?${toQueryString<GetQueryDto>(options)}`
      : undefined,
  );
