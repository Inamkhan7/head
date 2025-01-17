import Button from '@/core/atoms/ui/button';
import { useCart } from '@/store/quick-cart/cart.context';
import { useTranslation } from 'react-i18next';

const CartMerge = () => {
  const { t } = useTranslation('common');
  const { keepRemoteCart, mergeCarts } = useCart();

  return (
    <div className="m-auto w-full max-w-sm rounded-md bg-light p-4 pb-6 sm:w-[48rem] md:rounded-xl">
      <div className="h-full w-full text-center">
        <div className="flex h-full flex-col justify-between">
          <p className="mt-4 text-xl font-bold text-heading">
            {t('text-merge-cart-heading')}
          </p>
          {/* <p className="py-2 px-6 leading-relaxed text-body-dark dark:text-muted">
            {t('text-marge-cart-description')}
          </p> */}

          <div className="mt-8 flex w-full items-center justify-between space-x-4 rtl:space-x-reverse">
            <div className="w-1/3">
              <Button className="h-11 w-full sm:h-12" onClick={mergeCarts}>
                {t('text-merge-cart')}
              </Button>
            </div>

            <div className="w-1/3">
              <Button className="h-11 w-full sm:h-12" onClick={keepRemoteCart}>
                {t('text-keep-remote')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartMerge;
