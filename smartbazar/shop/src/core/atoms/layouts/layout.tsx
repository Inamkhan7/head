import { useWindowSize } from 'react-use';
import useLayout from '@/lib/hooks/use-layout';
import Header from './header';
import HeaderMinimal from './header-minimal';
import MobileNavigation from './mobile-navigation';
import Footer from './footer';
import CartCounterButton from '../cart/cart-counter-button';
import { useRouter } from 'next/router';

export default function SiteLayout({ children }: React.PropsWithChildren<{}>) {
  const { width } = useWindowSize();
  const { layout, catalog } = useLayout();
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150">
      {['minimal', 'compact'].includes(layout) ? (
        <HeaderMinimal layout={layout} />
      ) : (
        <Header layout={layout} catalog={catalog} />
      )}
      {children}
      {!['compact', 'minimal', 'basic'].includes(layout) &&
        !router.pathname.includes('checkout') &&
        width > 1023 && <CartCounterButton />}
      {['compact'].includes(layout) && <Footer />}
      <MobileNavigation />
    </div>
  );
}
export const getLayout = (page: React.ReactElement) => (
  <SiteLayout>{page}</SiteLayout>
);
