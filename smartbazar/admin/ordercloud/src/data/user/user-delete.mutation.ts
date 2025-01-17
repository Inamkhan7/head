import { useMutation, useQueryClient } from "react-query";
import User from "@repositories/user";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) => User.delete(`${API_ENDPOINTS.USERS}/${id}`),
    {
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.USERS);
      },
    }
  );
};
