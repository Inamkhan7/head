import ErrorMessage from '@components/ui/error-message';
import { useOrderQuery } from '@data/order/use-order.query';
import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { useTranslation } from "next-i18next";
import Loader from '@components/ui/loader/loader';
import { useMutationPlaceOrder, useMutationLineItem } from '@data/product/product-impersonation.query';
import { useRouter } from 'next/router';

const RepeatLastProduct: React.FC = () => {
  const OrderId = Cookies.get('OrderId');
  const { t } = useTranslation();
  const {
    data,
    isLoading: loading,
    error,
  } = useOrderQuery(OrderId as string);
  const { mutate: createOrder } = useMutationPlaceOrder();
  const { mutate: addLineItem } = useMutationLineItem();
  const router = useRouter();

  const items = data?.order?.products;

  // Handle the order creation and line item addition
  const handleSubmitOrder = React.useCallback(() => {
    if (items) {
      const payload = {
        ...items,
        xp: { OrderType: "Quote" },
      };

      try {
        createOrder(payload, {
              onSuccess: async (response) => {
                // Extract orderId from response
                const orderId = response?.ID;
                if (orderId) {
                  items.forEach((item) => {
                    const productID = item?.slug || item?.id;
                    const quantity = item?.quantity || 1;
                   if (!productID) {
                      console.error("Product ID is not available for item:", item);
                      return;
                    }

                    addLineItem(
                      { orderId, lineItemData: { productID, quantity } },
                      {
                        onSuccess: (lineItemResponse: any) => {
                          console.log(
                            `Line item added successfully for product ${productID}:`,
                            lineItemResponse
                          );
                        },
                        onError: (error: any) => {
                          console.error(
                            `Error adding line item for product ${productID}:`,
                            error
                          );
                        },
                      }
                    );
                  });
                  Cookies.set("OrderId", orderId); // Ensure orderId is available after redirect
                  router.push(`/orders/${orderId}`);
                } else {
                  console.error("Order ID not found in response");
                }
              },
              onError: (error) => {
                console.error("Error creating order:", error);
              },
            });
      } catch (error) {
        console.error("Unexpected error in handleAddClick:", error);
      }
    }
  }, [items]);

  useEffect(() => {
    if (items) {
      handleSubmitOrder();
    }
  }, [items, handleSubmitOrder]);

  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      Processing Order...
    </div>
  );
};

export default RepeatLastProduct;
