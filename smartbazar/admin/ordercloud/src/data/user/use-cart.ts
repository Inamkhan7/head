import User from '@repositories/user';
import { useMutation, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
export interface IAddWalletPointsVariables {
  variables: {
    input: { productId: string; quantity: number };
  };
}

export const useUpdateCart = (props: { onSuccess?: () => void }) =>
  useMutation(
    ({ variables: { input } }: IAddWalletPointsVariables) =>
      User.addToCart(API_ENDPOINTS.ADD_TO_CART, input),
    {
      onSuccess: props.onSuccess,
    }
  );

export const useCart = () => {
  const { t } = useTranslation();

  const { mutate: addToCart, isLoading } = useUpdateCart({
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
  });

  return { addToCart, isLoading };
};
