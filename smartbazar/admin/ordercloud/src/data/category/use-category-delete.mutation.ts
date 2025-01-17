import { useMutation, useQueryClient } from "react-query";
import Category from "@repositories/category";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface ICategoryDelete {
  variables: {
    id: string;
    catalogId: string;
  };
}

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ variables: { catalogId, id } }: ICategoryDelete) =>
      Category.delete(`${API_ENDPOINTS.CATEGORIES}/${catalogId}/${id}`),
    {
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.CATEGORIES);
      },
    }
  );
};
