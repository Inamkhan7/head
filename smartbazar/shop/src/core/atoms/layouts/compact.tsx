import SectionBlock from '@/core/atoms/ui/section-block';
import FilterBar from './filter-bar';
import Categories from '@/core/atoms/categories/categories';
import CallToAction from '@/core/atoms/cta/call-to-action';
import ProductsGrid from '@/core/atoms/products/grid';
import GroupProducts from '@/core/atoms/products/group-products';
import PopularProductsGrid from '@/core/atoms/products/popular-products';
import TopAuthorsGrid from '@/core/atoms/author/top-authors-grid';
import Banner from '@/core/atoms/banners/banner';
import TopManufacturersGrid from '@/core/atoms/manufacturer/top-manufacturers-grid';
import { useTranslation } from 'next-i18next';
import SellingProductsGrid from '@/core/atoms/products/selling-products';
import type { HomePageProps } from '@/types';
import ProductGridHome from '../products/grids/home';

export default function CompactLayout({ variables }: HomePageProps) {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-1 flex-col bg-white">
      <FilterBar className="lg:hidden" variables={variables.categories} />
      <main className="mt-6 block w-full xl:overflow-hidden">
        <SectionBlock>
          <Banner layout="compact" variables={variables.types} />
        </SectionBlock>
        <PopularProductsGrid variables={variables.popularProducts} />
        <Categories layout="compact" variables={variables.categories} />
        <GroupProducts />
        <SectionBlock title={t('text-new-arrival')}>
          <ProductGridHome
            column="five"
            variables={{
              ...variables.products,
              sortedBy: 'DESC',
              orderBy: 'created_at',
            }}
          />
        </SectionBlock>
        <TopAuthorsGrid />
        {/* <SellingProductsGrid limit={6} /> */}
        <TopManufacturersGrid />
        <CallToAction />
      </main>
    </div>
  );
}
