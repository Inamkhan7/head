import { CreateUserGroupInput } from "@ts-types/generated"; 
import { ROUTES } from "@utils/routes";
import userGroup from "@repositories/user-group";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

export interface IUserGroupVariables {
  variables: CreateUserGroupInput
}
const ORDERCLOUD_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT_ORDERCLOUD;


export const useCreateUserGroupMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    ({ variables }: IUserGroupVariables) =>
      userGroup.create(`${ORDERCLOUD_API_ENDPOINT}/v1/buyers/${variables.BuyerID}/usergroups`, variables),
    {
      onSuccess: () => {
        router.push(ROUTES.USERGROUPS);
      },
      onSettled: ({ variables }) => {
        queryClient.invalidateQueries(`${ORDERCLOUD_API_ENDPOINT}/v1/buyers/${variables.BuyerID}/usergroups`);
      },
    }
  );
};
