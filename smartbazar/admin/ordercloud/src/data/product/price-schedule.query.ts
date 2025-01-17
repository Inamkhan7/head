import { API_ENDPOINTS } from "@utils/api/endpoints";
import http from "@utils/api/http";
import { mapPaginatorData } from "@utils/data-mappers";
import { useQuery } from "react-query";

// // const ORDERCLOUD_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT_ORDERCLOUD;


export const fetchPriceSchedule = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  const url = `https://sandboxapi.ordercloud.io/v1/priceschedules?page=${page}&pageSize=${pageSize}`;
  const response = await http.get(url);
  const PriceScheduleData = response.data.Items;
  const PriceSchedulePagination = response.data.Meta;
  return {
    priceSchedule: {
      PriceScheduleData,
      paginatorInfo: mapPaginatorData({ PriceSchedulePagination }),
    },
  };
};


export const usePriceScheduleQuery = ({ page, pageSize }: { page: number; pageSize: number }) => {
  return useQuery(
    ["priceSchedule", page, pageSize],
    () => fetchPriceSchedule({ page, pageSize }),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
      retry: 3,
    }
  );
};
