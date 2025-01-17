import { motion } from 'framer-motion';
import { useWindowSize } from 'react-use';
import { useTranslation } from 'next-i18next';
import { useAtom } from 'jotai';
import Header from './header';
import HeaderMinimal from './header-minimal';
import MobileNavigation from './mobile-navigation';
import Footer from './footer';
import { SearchIcon } from '@/core/atoms/icons/search-icon';
import { displayMobileHeaderSearchAtom } from '@/store/display-mobile-header-search-atom';
import CartCounterButton from '../cart/cart-counter-button';

export default function HomeLayout({
  children,
  layout,
  catalog,
}: React.PropsWithChildren<{ layout: string; catalog: string }>) {
  const { width } = useWindowSize();
  const { t } = useTranslation('common');
  const [, setDisplayMobileHeaderSearch] = useAtom(
    displayMobileHeaderSearchAtom
  );
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150">
      {['minimal', 'compact'].includes(layout) ? (
        <HeaderMinimal layout={layout} />
      ) : (
        <Header layout={layout} catalog={catalog} />
      )}
      <div >{children}</div>
      {!['compact', 'minimal', 'basic'].includes(layout) && width > 1023 && (
        <CartCounterButton />
      )}
      {['compact'].includes(layout) && <Footer />}
      <MobileNavigation>
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setDisplayMobileHeaderSearch((prev) => !prev)}
          className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-none"
        >
          <span className="sr-only">{t('text-search')}</span>
          <SearchIcon width="17.05" height="18" />
        </motion.button>
      </MobileNavigation>
    </div>
  );
}
