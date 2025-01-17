import { toQueryString } from '@packages/commerce/dist/utils';
import { paginate, GetQueryDto } from '@packages/commerce/dist/common';

export const mapPaginationOptions = (
  endpointUrl: string,
  meta,
  options?: GetQueryDto,
) =>
  paginate(
    meta.total,
    meta.offset,
    meta.limit,
    meta.total,
    options
      ? `/${endpointUrl}?${toQueryString<GetQueryDto>(options)}`
      : undefined,
  );
