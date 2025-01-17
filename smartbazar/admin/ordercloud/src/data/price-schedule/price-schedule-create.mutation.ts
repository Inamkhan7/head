import priceSchedule from "@repositories/price-schedule";
import { CreatePriceScheduleInput } from "@ts-types/generated";
import { ROUTES } from "@utils/routes";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

export interface IPriceScheduleVariables {
  variables: CreatePriceScheduleInput;
}

export const useCreatePriceScheduleMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    ({ variables }: IPriceScheduleVariables) =>
        priceSchedule.create(
        `https://sandboxapi.ordercloud.io/v1/priceschedules`,
        variables
      ),
    {
      onSuccess: () => {
        router.push(ROUTES.PRICE_SCHEDULES);  // Redirect to Price Schedules page (or any other route)
      },
      onSettled: ({ variables }: IPriceScheduleVariables) => {
        queryClient.invalidateQueries(`https://sandboxapi.ordercloud.io/v1/priceschedules`);
      },
    }
  );
};
