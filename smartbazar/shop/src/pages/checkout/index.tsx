import { useTranslation } from 'next-i18next';
import { billingAddressAtom, shippingAddressAtom } from '@/store/checkout';
import dynamic from 'next/dynamic';
import { getLayout } from '@/core/atoms/layouts/layout';
import { AddressType } from '@/framework/utils/constants';
import Seo from '@/core/atoms/seo/seo';
import { useUser } from '@/framework/user';
export { getStaticProps } from '@/framework/general.ssr';
import { ComponentPropsCollection, DictionaryPhrases, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import { useEffect } from 'react';

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

const ScheduleGrid = dynamic(
  () => import('@/core/atoms/checkout/schedule/schedule-grid')
);
const AddressGrid = dynamic(
  () => import('@/core/atoms/checkout/address-grid'),
  { ssr: false }
);
const RightSideView = dynamic(
  () => import('@/core/atoms/checkout/right-side-view'),
  { ssr: false }
);

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { me } = useUser();
  const { id, address } = me ?? {};

  useEffect(() => {
    let url = window.location.pathname;
    let filename = url.substring(url.lastIndexOf('/')+1);
    handlePageOnload(
      filename,"Purchase Flow","Check Out","XXX", "ABC"
    );
  },[]);

  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <div className="bg-gray-100 px-4 py-8 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
        <div className="m-auto flex w-full max-w-5xl flex-col items-center rtl:space-x-reverse lg:flex-row lg:items-start lg:space-x-8">
          <div className="w-full space-y-6 lg:max-w-2xl">
            <AddressGrid
              userId={id!}
              className="bg-light p-5 shadow-700 md:p-8"
              label={t('text-billing-address')}
              count={2}
              //@ts-ignore
              addresses={address?.filter(
                (item) => item?.type === AddressType.Billing
              )}
              atom={billingAddressAtom}
              type={AddressType.Billing}
            />
            <AddressGrid
              userId={me?.id!}
              className="bg-light p-5 shadow-700 md:p-8"
              label={t('text-shipping-address')}
              count={3}
              //@ts-ignore
              addresses={address?.filter(
                (item) => item?.type === AddressType.Shipping
              )}
              atom={shippingAddressAtom}
              type={AddressType.Shipping}
            />
            <ScheduleGrid
              className="bg-light p-5 shadow-700 md:p-8"
              label={t('text-delivery-schedule')}
              count={4}
            />
          </div>
          <div className="mt-10 mb-10 w-full sm:mb-12 lg:mb-0 lg:w-96">
            <RightSideView />
          </div>
        </div>
      </div>
    </>
  );
}
CheckoutPage.authenticationRequired = true;
CheckoutPage.getLayout = getLayout;

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
