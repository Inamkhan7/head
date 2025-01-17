import { Meta } from 'ordercloud-javascript-sdk';
import { toQueryString } from '@packages/commerce/dist/utils';
import { paginate, GetQueryDto } from '@packages/commerce/dist/common';

export const mapPaginationOptions = (
  endpointUrl: string,
  meta: Meta,
  options?: GetQueryDto,
) =>
  paginate(
    meta.TotalCount,
    meta.Page,
    meta.PageSize,
    meta.TotalCount,
    options
      ? `/${endpointUrl}?${toQueryString<GetQueryDto>(options)}`
      : undefined,
  );
