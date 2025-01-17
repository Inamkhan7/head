import { useCart } from "@contexts/quick-cart/cart.context";
import  apiClientImpersonation, { useImpersonationToken } from "@utils/api/impersonation";
import Cookies from "js-cookie";
import { useMutation, useQuery } from "react-query";

const ORDERCLOUD_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT_ORDERCLOUD;

const fetchImpersonationProductQuery = async (impersonationToken: string | null) => {
  if (!impersonationToken || impersonationToken === 'internal-token') {
    throw new Error('Invalid or missing token');
  }

  const url = `${ORDERCLOUD_API_ENDPOINT}/v1/me/products`;
  const response = await apiClientImpersonation.get(url, {
    headers: { Authorization: `Bearer ${impersonationToken}` },
  });
  return response.data;
};

export const PlaceOrderImpersonation = async (input: any, impersonationToken: string) => {
  console.log('Input to OrderImpersonationProduct:', input); // Debug input
  const createOrderUrl = `${ORDERCLOUD_API_ENDPOINT}/v1/orders/Outgoing`;

  try {
    if (!impersonationToken) {
      throw new Error('Missing impersonation token');
    }

    const response = await apiClientImpersonation.post(createOrderUrl, input, {
      headers: { Authorization: `Bearer ${impersonationToken}` },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};


export const addLineItemsToOrder = async (orderId: string, lineItemData: any, impersonationToken:any, resetCart:any) => {
  Cookies.set('OrderId',orderId);
  console.log(orderId,'orderId');
  const url = `${ORDERCLOUD_API_ENDPOINT}/v1/orders/Outgoing/${orderId}/lineitems`;
  const submitCartUrl = `${ORDERCLOUD_API_ENDPOINT}/v1/cart/submit`;
  const submitedQuery = `${ORDERCLOUD_API_ENDPOINT}/v1/orders/Outgoing/${orderId}`
  try {
    const lineItemsResponse = await apiClientImpersonation.post(url, lineItemData, {
      headers: { Authorization: `Bearer ${impersonationToken}` },
    });

    const cartSubmitResponse = await apiClientImpersonation.post(submitCartUrl, { orderId }, {
      headers: { Authorization: `Bearer ${impersonationToken}` },
    });

    const submitCartResponse = await apiClientImpersonation.get(submitedQuery, {
      headers: { Authorization: `Bearer ${impersonationToken}` },
    });

    Cookies.remove("user_cart");
    localStorage.removeItem("user_cart");
    resetCart();
    return {
      lineItemsResponse: lineItemsResponse.data,
      cartSubmitResponse: cartSubmitResponse.data,
      submitedQuery: submitCartResponse.data,
    };
  } catch (error) {
    console.error("Error in addLineItemsToOrder:", error);
    throw error;
  }
};

export const fetchLastRequestedOrderQuery = async () => {
  const orderId = Cookies.get("OrderId");
  const url = `${ORDERCLOUD_API_ENDPOINT}/v1/orders/Outgoing/${orderId}`;
  try {
    const response = await apiClientImpersonation.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const useProductListWithImpersonation = () => {
  const { impersonationToken, isTokenReady } = useImpersonationToken('David', 'Password1234!');

  return useQuery(
    ['ImpersonationQuery', impersonationToken],
    () => fetchImpersonationProductQuery(impersonationToken),
    {
      enabled: isTokenReady && !!impersonationToken,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    }
  );
};

export const useLastRequestedOrderQuery = () => {
  return useQuery("ImpersonationQuery", fetchLastRequestedOrderQuery);
};

export const useMutationPlaceOrder = () => {
  const { impersonationToken, isTokenReady } = useImpersonationToken('David', 'Password1234!');

  return useMutation(
    (input: any) => {
      if (!impersonationToken) {
        throw new Error('Token is not ready. Please try again later.');
      }
      return PlaceOrderImpersonation(input, impersonationToken);
    },
    {
      onMutate: () => {
        if (!isTokenReady) {
          console.warn('Token is not ready. Mutation may fail.');
        }
      },
      onError: (error) => {
        console.error('Error in impersonation mutation:', error);
      },
    }
  );
};

export const useMutationLineItem = () => {
  const { impersonationToken, isTokenReady } = useImpersonationToken('David', 'Password1234!');
  const { resetCart } = useCart();
  return useMutation(
    ({ orderId, lineItemData }: { orderId: string; lineItemData: any }) =>
      addLineItemsToOrder(orderId, lineItemData, impersonationToken, resetCart),
    {
      onMutate: () => {
        if (!isTokenReady) {
          console.warn('Token is not ready. Mutation may fail.');
        }
      },
      onError: (error) => {
        console.error('Error in useMutationLineItem:', error);
      },
    }
  );
};