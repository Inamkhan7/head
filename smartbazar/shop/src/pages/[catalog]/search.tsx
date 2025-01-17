import { FilterIcon } from '@/core/atoms/icons/filter-icon';
import MobileNavigation from '@/core/atoms/layouts/mobile-navigation';
import GeneralLayout from '@/core/atoms/layouts/_general';
import { Grid } from '@/core/atoms/products/grid';
import SearchCount from '@/core/atoms/search-view/search-count';
import SidebarFilter from '@/core/atoms/search-view/sidebar-filter';
import Sorting from '@/core/atoms/search-view/sorting';
import ErrorMessage from '@/core/atoms/ui/error-message';
import { PRODUCTS_PER_PAGE } from '@/framework/client/variables';
import { useProducts } from '@/framework/product';
import { drawerAtom } from '@/store/drawer-atom';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import StickyBox from 'react-sticky-box';
export { getServerSideProps } from '@/framework/search.ssr';

export default function SearchPage() {
  const {
    query: { catalog, ...restQuery },
  } = useRouter();
  const {
    products,
    isLoading,
    paginatorInfo,
    error,
    loadMore,
    isLoadingMore,
    hasMore,
  } = useProducts({
    limit: PRODUCTS_PER_PAGE,
    orderBy: 'created_at',
    sortedBy: 'DESC',
    ...(catalog && { type: catalog as string }),
    ...restQuery,
  });
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <div className="w-full">
      <div className="mb-7 flex flex-col items-center justify-between md:flex-row">
        {/* //FIXME: */}
        <SearchCount
          from={paginatorInfo?.firstItem ?? 0}
          to={paginatorInfo?.lastItem ?? 0}
          total={paginatorInfo?.total ?? 0}
        />
        <div className="mt-4 max-w-xs md:mt-0">
          <Sorting variant="dropdown" />
        </div>
      </div>
      <Grid
        productUrlPrefix={`${catalog}/products`}
        products={products}
        loadMore={loadMore}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        error={error}
        column="five"
      />
    </div>
  );
}

const GetLayout = (page: React.ReactElement) => {
  const { t } = useTranslation('common');
  const [_, setDrawerView] = useAtom(drawerAtom);
  return (
    <GeneralLayout layout="general">
      <>
        <div className="w-full bg-light">
          <div className="mx-auto flex min-h-screen w-full max-w-1920 px-5 py-10 rtl:space-x-reverse lg:space-x-10 xl:py-14 xl:px-16">
            <div className="hidden w-80 shrink-0 lg:block">
              <StickyBox offsetTop={140} offsetBottom={30}>
                <SidebarFilter />
              </StickyBox>
            </div>
            {page}
          </div>
        </div>
        <MobileNavigation>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() =>
              setDrawerView({
                display: true,
                view: 'SEARCH_FILTER',
              })
            }
            className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-none"
          >
            <span className="sr-only">{t('text-filter')}</span>
            <FilterIcon width="17.05" height="18" />
          </motion.button>
        </MobileNavigation>
      </>
    </GeneralLayout>
  );
};

SearchPage.getLayout = GetLayout;
