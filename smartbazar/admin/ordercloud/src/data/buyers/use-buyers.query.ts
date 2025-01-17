import { QueryParamsType, QueryOptionsType } from "@ts-types/custom.types";
import { mapPaginatorData, stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";
import Buyers from "@repositories/type";
import { API_ENDPOINTS } from "@utils/api/endpoints";

const fetchBuyers = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  const {
    text,
    page = 1,
    limit = 20,
    orderBy = "updated_at",
    sortedBy = "DESC",
  } = params as QueryOptionsType;
  const searchString = stringifySearchQuery({
    name: text,
  });
  const url = `${API_ENDPOINTS.BUYERS}?search=${searchString}&page=${page}&limit=${limit}&orderBy=${orderBy}&sortedBy=${sortedBy}`;
  const {
    data: { data, ...rest },
  } = await Buyers.all(url);
  return { buyers: { data, paginatorInfo: mapPaginatorData({ ...rest }) } };
};

const useBuyersQuery = (params: QueryOptionsType = {}, options: any = {}) => {
  return useQuery<any, Error>([API_ENDPOINTS.BUYERS, params], fetchBuyers, {
    ...options,
    keepPreviousData: true,
  });
};

export { useBuyersQuery, fetchBuyers };
