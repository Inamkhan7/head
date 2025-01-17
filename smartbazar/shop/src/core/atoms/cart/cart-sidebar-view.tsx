import { useRouter } from 'next/router';
import { motion, AnimateSharedLayout } from 'framer-motion';
import CartCheckBagIcon from '@/core/atoms/icons/cart-check-bag';
import EmptyCartIcon from '@/core/atoms/icons/empty-cart';
import { CloseIcon } from '@/core/atoms/icons/close-icon';
import CartItem from '@/core/atoms/cart/cart-item';
import { fadeInOut } from '@/lib/motion/fade-in-out';
import { ROUTES } from '@/lib/routes';
import usePrice from '@/lib/use-price';
import { useCart } from '@/store/quick-cart/cart.context';
import { formatString } from '@/lib/format-string';
import { useTranslation } from 'next-i18next';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import {
  ComponentPropsCollection,
  DictionaryPhrases,
  LayoutServiceData,
} from '@sitecore-jss/sitecore-jss-nextjs';
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

const handlePageOnload = (
  dl_pageItem: string | number | undefined,
  dl_pageSection: string | number | undefined,
  dl_pageType: string | number | undefined,
  dl_visitor: string | number | undefined,
  dl_memberId: string | number | undefined
) => {
  const eventpageView: DataLayerEvent = {
    event: 'pageView',
    loginStatus: 'out',
    pageArea: 'pub',
    pageItem: dl_pageItem,
    pageSection: dl_pageSection,
    pageType: dl_pageType,
    visitor: dl_visitor,
    memberId: dl_memberId,
  };

  window.dataLayer.push(eventpageView);
};

const CartSidebarView = () => {
  const { t } = useTranslation('common');
  const { items, totalUniqueItems, total } = useCart();
  const [_, closeSidebar] = useAtom(drawerAtom);
  const router = useRouter();
  function handleCheckout() {
    const isRegularCheckout = items.find((item) => !Boolean(item.is_digital));
    if (isRegularCheckout) {
      router.push(ROUTES.CHECKOUT);
    } else {
      router.push(ROUTES.CHECKOUT_DIGITAL);
    }

    closeSidebar({ display: false, view: '' });
  }

  useEffect(() => {
    let url = window.location.pathname;
    let filename = url.substring(url.lastIndexOf('/') + 1);
    handlePageOnload('Articles', 'Hub Page', 'View Cart', 'XXX', 'ABC');
  }, []);

  const { price: totalPrice } = usePrice({
    amount: total,
  });
  return (
    <section className="relative flex h-full flex-col">
      <header className="fixed top-0 z-10 flex w-full max-w-md items-center justify-between border-b border-border-200 border-opacity-75 bg-light py-4 px-6">
        <div className="flex font-semibold text-accent">
          <CartCheckBagIcon className="shrink-0" width={24} height={22} />
          <span className="flex ltr:ml-2 rtl:mr-2">
            {formatString(totalUniqueItems, t('text-item'))}
          </span>
        </div>
        <button
          onClick={() => closeSidebar({ display: false, view: '' })}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-muted transition-all duration-200 hover:bg-accent hover:text-light focus:bg-accent focus:text-light focus:outline-none ltr:ml-3 ltr:-mr-2 rtl:mr-3 rtl:-ml-2"
        >
          <span className="sr-only">{t('text-close')}</span>
          <CloseIcon className="h-3 w-3" />
        </button>
      </header>
      {/* End of cart header */}

      <AnimateSharedLayout>
        <motion.div layout className="flex-grow pt-16 pb-20">
          {items.length > 0 ? (
            items?.map((item) => <CartItem item={item} key={item.id} />)
          ) : (
            <motion.div
              layout
              initial="from"
              animate="to"
              exit="from"
              variants={fadeInOut(0.25)}
              className="flex h-full flex-col items-center justify-center"
            >
              <EmptyCartIcon width={140} height={176} />
              <h4 className="mt-6 text-base font-semibold">
                {t('text-no-products')}
              </h4>
            </motion.div>
          )}
        </motion.div>
      </AnimateSharedLayout>
      {/* End of cart items */}

      {/* <footer className="sticky ltr:left-0 rtl:right-0 bottom-0 w-full py-5 px-6 z-10 bg-light"> */}
      <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
        <button
          className="flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold shadow-700 transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
          onClick={handleCheckout}
        >
          <span className="flex h-full flex-1 items-center px-5 text-light">
            {t('text-checkout')}
          </span>
          <span className="flex h-full shrink-0 items-center rounded-full bg-light px-5 text-accent">
            {totalPrice}
          </span>
        </button>
      </footer>
      {/* End of footer */}
    </section>
  );
};

export default CartSidebarView;
