import { BuyerInput } from "@ts-types/custom.types";
import Buyer from "@repositories/buyer";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { ROUTES } from "@utils/routes";

export interface BuyerVariables {
  variables: BuyerInput;
}

export const useCreateBuyerMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    ({ variables }: BuyerVariables) =>
      Buyer.createBuyer(API_ENDPOINTS.BUYERS, variables),
    {
      onSuccess: () => {
        router.push(ROUTES.CUSTOMERS);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.CUSTOMERS);
      },
    }
  );
};