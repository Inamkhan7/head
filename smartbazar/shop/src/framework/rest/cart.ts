import { authorizationAtom } from '@/store/authorization-atom';
import { useAtom } from 'jotai';
import { useMutation, useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { ROUTES } from '@/lib/routes';

export function useCart() {
  const [isAuthorized] = useAtom(authorizationAtom);
  const { data, isLoading, error } = useQuery(
    [API_ENDPOINTS.CART],
    client.cart.get,
    { enabled: isAuthorized }
  );

  return {
    authenticatedCart: data,
    isLoading,
    error,
  };
}

export function useUpdateCart() {
  const { mutate: updateCart, isLoading } = useMutation(client.cart.update, {
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      toast.error(data?.message);
    },
  });
  return {
    updateCart,
    isLoading,
  };
}

export function useSubmitCart() {
  const router = useRouter();

  const { mutate: submitCart, isLoading } = useMutation(client.cart.submit, {
    onSuccess: (data) => {
      if (data?.tracking_number) {
        router.push(`${ROUTES.ORDERS}/${data?.tracking_number}`);
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      toast.error(data?.message);
    },
  });

  return {
    submitCart,
    isLoading,
  };
}

export function useSubmitCartQuote() {
  const router = useRouter();

  const { mutate: submitQuote, isLoading } = useMutation(client.cart.submit, {
    onSuccess: (data) => {
      if (data?.tracking_number) {
        router.push(`${ROUTES.QUOTES}/${data?.tracking_number}`);
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      toast.error(data?.message);
    },
  });

  return {
    submitQuote,
    isLoading,
  };
}

export function useAddItem() {
  const { mutate: addItem, isLoading } = useMutation(client.cart.addItem, {
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      toast.error(data?.message);
    },
  });

  return {
    addItem,
    isLoading,
  };
}

export function useUpdateItem() {
  const { mutate: updateItem, isLoading } = useMutation(
    client.cart.updateItem,
    {
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};
        toast.error(data?.message);
      },
    }
  );

  return {
    updateItem,
    isLoading,
  };
}

export function useDeleteItem() {
  const { mutate: deleteItem, isLoading } = useMutation(
    client.cart.deleteItem,
    {
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};
        toast.error(data?.message);
      },
    }
  );

  return {
    deleteItem,
    isLoading,
  };
}

export function useClearCart() {
  const { mutate: clearCart, isLoading } = useMutation(client.cart.clearCart, {
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      toast.error(data?.message);
    },
  });

  return {
    clearCart,
    isLoading,
  };
}
