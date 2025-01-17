import { useEffect } from 'react';
import dayjs from 'dayjs';
import Link from '@/core/atoms/ui/link';
import usePrice from '@/lib/use-price';
// import { formatAddress } from '@/lib/format-address';
// import { formatString } from '@/lib/format-string';
import { ROUTES } from '@/lib/routes';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/store/quick-cart/cart.context';
import { CheckMark } from '@/core/atoms/icons/checkmark';
import Badge from '@/core/atoms/ui/badge';
import { OrderItems } from '@/core/atoms/orders/order-items';
import { useAtom } from 'jotai';
import { clearCheckoutAtom } from '@/store/checkout';
import SuborderItems from '@/core/atoms/orders/suborder-items';
import Spinner from '@/core/atoms/ui/loaders/spinner/spinner';
// import isEmpty from 'lodash/isEmpty';
// import OrderStatuses from '@/core/atoms/orders/statuses';
import { useOrder } from '@/framework/order';
import { useRouter } from 'next/router';
import { ComponentPropsCollection, DictionaryPhrases, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';

export type SitecorePageProps = {
  locale: string;
  layoutData: LayoutServiceData | null;
  dictionary: DictionaryPhrases;
  componentProps: ComponentPropsCollection;
  notFound: boolean;
};

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    location: Location;
  }
}

const handlePageOnload = (
  dl_pageItem: string | number | undefined,
  dl_pageSection: string | number | undefined,
  dl_pageType: string | number | undefined,
  dl_visitor: string | number | undefined,
  dl_memberId: string | number | undefined,
) => {

  const eventpageView: DataLayerEvent = {
    event: 'pageView',
    loginStatus: 'out',
    pageArea: 'pub',
    pageItem: dl_pageItem,
    pageSection: dl_pageSection,
    pageType: dl_pageType,
    visitor: dl_visitor,
    memberId: dl_memberId
  };
  window.dataLayer.push(eventpageView);
};

function OrderView({ order }: any) {
  const { t } = useTranslation('common');
  const { resetCart } = useCart();
  const [, resetCheckout] = useAtom(clearCheckoutAtom);

  useEffect(() => {
    resetCart();
    resetCheckout();
  }, [resetCart, resetCheckout]);

  useEffect(() => {
    handlePageOnload(
      "Purchase","Purchase Flow","Purchase","XXX", "XYZ"
    );
  },[]);

  return (
    <div className="p-4 sm:p-8">
      <div className="mx-auto w-full max-w-screen-lg rounded border bg-light p-6 shadow-sm sm:p-8 lg:p-12">
        <h2 className="mb-9 flex flex-col items-center justify-between text-base font-bold text-heading sm:mb-12 sm:flex-row">
          <span className="order-2 mt-5 ltr:mr-auto rtl:ml-auto sm:order-1 sm:mt-0">
            <span className="ltr:mr-4 rtl:ml-4">{t('text-status')} :</span>
            <Badge
              text={order?.status?.name!}
              className="whitespace-nowrap text-sm font-normal"
            />
          </span>
          <Link
            href={ROUTES.HOME}
            className="order-1 inline-flex items-center text-base font-normal text-accent underline hover:text-accent-hover hover:no-underline sm:order-2"
          >
            {t('text-back-to-home')}
          </Link>
        </h2>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 md:mb-12 lg:grid-cols-2">
          <div className="rounded border border-border-200 py-4 px-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-heading">
              {t('text-quote-number')}
            </h3>
            <p className="text-sm text-body-dark">{order?.tracking_number}</p>
          </div>
          <div className="rounded border border-border-200 py-4 px-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-heading">
              {t('text-date')}
            </h3>
            <p className="text-sm text-body-dark">
              {dayjs(order?.created_at).format('MMMM D, YYYY')}
            </p>
          </div>
          {/* <div className="rounded border border-border-200 py-4 px-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-heading">
              {t('text-total')}
            </h3>
            <p className="text-sm text-body-dark">{total}</p>
          </div> */}
          
        </div>
        {/* end of order received  */}

        <div className="mt-12">
          <OrderItems products={order?.products} />
        </div>
        {order?.children?.length > 1 ? (
          <div>
            <h2 className="mt-12 mb-6 text-xl font-bold text-heading">
              {t('text-sub-orders')}
            </h2>
            <div>
              <div className="mb-12 flex items-start rounded border border-gray-700 p-4">
                <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-sm bg-dark px-2 ltr:mr-3 rtl:ml-3">
                  <CheckMark className="h-2 w-2 shrink-0 text-light" />
                </span>
                <p className="text-sm text-heading">
                  <span className="font-bold">{t('text-note')}:</span>
                  {t('message-sub-order')}
                </p>
              </div>
              {Array.isArray(order?.children) && order?.children.length && (
                <div>
                  <SuborderItems items={order?.children} />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function Order() {
  const { query } = useRouter();
  const { order, isLoading } = useOrder({
    tracking_number: query.tracking_number!.toString(),
  });
  if (isLoading) {
    return <Spinner showText={false} />;
  }
  return <OrderView order={order} />;
}
interface DataLayerEvent {
  event: string;

  loginStatus: string;

  pageArea: string | number | undefined;

  pageItem: string | number | undefined;

  pageSection: string | number | undefined;

  pageType: string | number | undefined;

  visitor: string | number | undefined; 
  
  memberId: string | number | undefined; 
  
}
