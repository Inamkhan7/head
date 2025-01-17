import { getLayout } from '@/core/atoms/layouts/layout';
import Order from '@/core/atoms/orders/order-view';
import Seo from '@/core/atoms/seo/seo';
export { getServerSideProps } from '@/framework/order.ssr';
export default function OrderPage() {
  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <Order />
    </>
  );
}

OrderPage.getLayout = getLayout;

// wallet_point only parent order - no children
