import { useCart } from '@contexts/quick-cart/cart.context';
import { useTranslation } from 'next-i18next';
import ItemCard from './item-card';
import EmptyCartIcon from '@components/icons/empty-cart';
import usePrice from '@utils/use-price';
import { ItemInfoRow } from './item-info-row';
import { CheckAvailabilityAction } from '@components/checkout/check-availability-action';
import { useMutationPlaceOrder, useMutationLineItem } from '@data/product/product-impersonation.query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const UnverifiedItemList = () => {
  const { t } = useTranslation('common');
  const { items, total, isEmpty } = useCart();

  const router = useRouter();
  const { price: subtotal } = usePrice(
    items && {
      amount: total,
    }
  );
  const { mutate: createOrder, isLoading, isError, error } = useMutationPlaceOrder();
  const { mutate: addLineItem, isLoading: isAddingLineItem } = useMutationLineItem();

  const handleQuoteOrder = () => {
    console.log('clicked');
    if (!items || items.length === 0) {
      console.error("Items are not available or empty");
      return;
    }

    const payload = {
      ...items,
      xp: { OrderType: "Quote" },
    };
  
    try {
    // Create order
      createOrder(payload, {
        onSuccess: async (response) => {
          console.log("Order created successfully:", response);
  
          // Extract orderId from response
          const orderId = response?.ID;
          if (orderId) {
            console.log(`Order ID: ${orderId}`);
  
            items.forEach((item) => {
              const productID = item?.slug || item?.id;
              const quantity = item?.quantity || 1;
  
              if (!productID) {
                console.error("Product ID is not available for item:", item);
                return;
              }
  
              // Add line item for each product
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
            Cookies.set("OrderId", orderId); 
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
  };
  
  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col items-center space-s-4">
        <span className="text-base font-bold text-heading">
          {t('text-your-order')}
        </span>
      </div>
      <div className="flex flex-col border-b border-border-200 py-3">
        {isEmpty ? (
          <div className="mb-4 flex h-full flex-col items-center justify-center">
            <EmptyCartIcon width={140} height={176} />
            <h4 className="mt-6 text-base font-semibold">
              {t('text-no-products')}
            </h4>
          </div>
        ) : (
          items?.map((item) => <ItemCard item={item} key={item.id} />)
        )}
      </div>
      <div className="mt-4 space-y-2">
        <ItemInfoRow title={t('text-sub-total')} value={subtotal} />
        <ItemInfoRow
          title={t('text-tax')}
          value={`NaN`}
          // value={t('text-calculated-checkout')}

        />
        <ItemInfoRow
          title={t('text-estimated-shipping')}
          // value={t('text-calculated-checkout')}
          value={`NaN`}
        />
      </div>
      <CheckAvailabilityAction>
        {t('text-check-availability')}
      </CheckAvailabilityAction>
      <div className="cursor-pointer inline-flex items-center justify-center flex-shrink-0 font-semibold leading-none rounded outline-none transition duration-300 ease-in-out focus:outline-none focus:shadow focus:ring-1 focus:ring-accent-700 bg-accent text-light border border-transparent hover:bg-accent-hover px-5 py-0 h-12 w-full mt-5">
        <div onClick={handleQuoteOrder}>{t('text-request-quote')}</div>
      </div>
    </div>
  );
};
export default UnverifiedItemList;
