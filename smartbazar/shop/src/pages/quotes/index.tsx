import Quotes from '@/core/atoms/quotes/quotes';
import Seo from '@/core/atoms/seo/seo';
export { getStaticProps } from '@/framework/general.ssr';
import DashboardLayout from '@/layouts/_dashboard';

export default function OrdersPage() {
  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <Quotes />
    </>
  );
}
OrdersPage.authenticationRequired = true;

OrdersPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
