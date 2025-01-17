import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import { useCreateQuoteOrder, useOrderStatuses } from '@/framework/order';
import ValidationError from '@/core/atoms/ui/validation-error';
import Button from '@/core/atoms/ui/button';
import { formatOrderedProduct } from '@/lib/format-ordered-product';
import { useCart } from '@/store/quick-cart/cart.context';
import { checkoutAtom, discountAtom, walletAtom } from '@/store/checkout';
import {
  calculatePaidTotal,
  calculateTotal,
} from '@/store/quick-cart/cart.utils';
import { authorizationAtom } from '@/store/authorization-atom';
import { useSubmitCartQuote } from '@/framework/cart';

export const PlaceQuoteAction: React.FC<{ className?: string }> = (props) => {
  const [isAuthorized] = useAtom(authorizationAtom);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { createQuoteOrder, isLoading } = useCreateQuoteOrder();
  const { submitQuote } = useSubmitCartQuote();

  const { orderStatuses } = useOrderStatuses({
    limit: 1,
  });

  const { items } = useCart();
  const [
    {
      billing_address,
      shipping_address,
      delivery_time,
      coupon,
      verified_response,
      payment_gateway,
      token,
    },
  ] = useAtom(checkoutAtom);
  const [discount] = useAtom(discountAtom);
  const [use_wallet_points] = useAtom(walletAtom);

  useEffect(() => {
    setErrorMessage(null);
  }, [payment_gateway]);

  const available_items = items?.filter(
    (item) => !verified_response?.unavailable_products?.includes(item.id)
  );

  const subtotal = calculateTotal(available_items);
  const total = calculatePaidTotal(
    {
      totalAmount: subtotal,
      tax: verified_response?.total_tax!,
      shipping_charge: verified_response?.shipping_charge!,
    },
    Number(discount)
  );
  const handleQuoteOrder = () => {
    // if (!use_wallet_points && !payment_gateway) {
    //   setErrorMessage('Gateway Is Required');
    //   return;
    // }
    // if (!use_wallet_points && payment_gateway === 'STRIPE' && !token) {
    //   setErrorMessage('Please Pay First');
    //   return;
    // }

    if (isAuthorized) {
      submitQuote();
      return;
    }

    let input = {
      //@ts-ignore
      products: available_items?.map((item) => formatOrderedProduct(item)),
      status: orderStatuses[0]?.id ?? '1',
      amount: subtotal,
      coupon_id: Number(coupon?.id),
      discount: discount ?? 0,
      paid_total: total,
      sales_tax: verified_response?.total_tax,
      delivery_fee: verified_response?.shipping_charge,
      total,
      delivery_time: delivery_time?.title,
      payment_gateway,
      use_wallet_points,
      billing_address: {
        ...(billing_address?.address && {
          ...billing_address.address,
          id: billing_address.id,
        }),
      },
      shipping_address: {
        ...(shipping_address?.address && {
          ...shipping_address.address,
          id: shipping_address.id,
        }),
      },
    };
    if (payment_gateway === 'STRIPE') {
      //@ts-ignore
      input.token = token;
    }

    delete input.billing_address.__typename;
    delete input.shipping_address.__typename;

    //@ts-ignore
    createQuoteOrder(input);
  };

  const isDigitalCheckout = available_items.find((item) =>
    Boolean(item.is_digital)
  );

  const formatRequiredFields = isDigitalCheckout
    ? [shipping_address, payment_gateway, available_items]
    : [
        payment_gateway,
        billing_address,
        shipping_address,
        delivery_time,
        available_items,
      ];
  const isAllRequiredFieldSelected = formatRequiredFields.every(
    (item) => !isEmpty(item)
  );
  return (
    <>
      <Button
        loading={isLoading}
        className={classNames('mt-5 w-full', props.className)}
        onClick={handleQuoteOrder}
        disabled={!isAllRequiredFieldSelected}
        {...props}
      />
      

     
      
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
    </>
  );
};
