import NotFound from '@/core/atoms/ui/not-found';
import { formatAddress } from '@/lib/format-address';
import { useTranslation } from 'next-i18next';
import Link from '@/core/atoms/ui/link';
import { ROUTES } from '@/lib/routes';
import { Eye } from '@/core/atoms/icons/eye-icon';
import { OrderItems } from './quote-items';
import isEmpty from 'lodash/isEmpty';
import { Order } from '@/types';
import {
  ComponentPropsCollection,
  DictionaryPhrases,
  LayoutServiceData,
} from '@sitecore-jss/sitecore-jss-nextjs';

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

interface Props {
  order: Order;
}

const QuoteDetails = ({ order }: Props) => {
  const { t } = useTranslation('common');
  const {
    products,
    shipping_address,
    billing_address,
    tracking_number,
  } = order ?? {};
 

  return (
    <div className="flex w-full flex-col border border-border-200 bg-white lg:w-2/3">
      {!isEmpty(order) ? (
        <>
          <div className="flex flex-col items-center border-b border-border-200 p-5 md:flex-row md:justify-between">
            <h2 className="mb-2 flex text-sm font-semibold text-heading md:text-lg">
              {t('text-quote-details')} <span className="px-2">-</span>{' '}
              {tracking_number}
            </h2>
            <div className="flex items-center">
              <Link
                href={`${ROUTES.QUOTES}/${tracking_number}`}
                className="flex items-center text-sm font-semibold text-accent no-underline transition duration-200 hover:text-accent-hover focus:text-accent-hover"
              >
                <Eye width={20} className="ltr:mr-2 rtl:ml-2" />
                {t('text-sub-orders')}
              </Link>
            </div>
          </div>

          <div className="flex flex-col border-b border-border-200 sm:flex-row">
            <div className="flex w-full flex-col border-b border-border-200 px-5 py-4 sm:border-b-0 ltr:sm:border-r rtl:sm:border-l md:w-full">
              <div className="mb-4">
                <span className="mb-2 block text-sm font-bold text-heading">
                  {t('text-shipping-address')}
                </span>

                <span className="text-sm text-body">
                  {formatAddress(shipping_address)}
                </span>
              </div>

              <div>
                <span className="mb-2 block text-sm font-bold text-heading">
                  {t('text-billing-address')}
                </span>

                <span className="text-sm text-body">
                  {formatAddress(billing_address)}
                </span>
              </div>
            </div>
          </div>

          {/* Quote Table */}
          <div>
            <OrderItems products={products} />
          </div>
        </>
      ) : (
        <div className="mx-auto max-w-lg">
          <NotFound text="text-no-order-found" />
        </div>
      )}
    </div>
  );
};

export default QuoteDetails;
