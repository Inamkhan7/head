import Category from "@repositories/category";
import { useQuery } from "react-query";
import { Category as TCategory } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchCategory = async (catalogId: string, id: string) => {
  const { data } = await Category.find(
    `${API_ENDPOINTS.CATEGORIES}/${catalogId}/${id}`
  );
  return data;
};

export const useCategoryQuery = (catalogId: string, id: string) => {
  return useQuery<TCategory, Error>(
    [API_ENDPOINTS.CATEGORIES, catalogId, id],
    () => fetchCategory(catalogId, id)
  );
};
