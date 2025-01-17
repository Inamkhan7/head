import Banner from '@/core/atoms/banners/banner';
// import PromotionSliders from '@/core/atoms/promotions/promotions';
import Categories from '@/core/atoms/categories/categories';
import { Element } from 'react-scroll';
import FilterBar from './filter-bar';
import ProductGridHome from '@/core/atoms/products/grids/home';
import type { HomePageProps } from '@/types';

export default function ClassicLayout({ variables }: HomePageProps) {
  return (
    <>
      <Banner layout="classic" variables={variables.types} />
      {/* <PromotionSliders variables={variables.types} /> */}
      <FilterBar variables={variables.categories} />
      <Element
        name="grid"
        className="flex border-t border-solid border-border-200 border-opacity-70"
      >
        <Categories layout="classic" variables={variables.categories} />
        <ProductGridHome
          className="px-4 pb-8 lg:p-8"
          variables={variables.products}
          productUrlPrefix={`${variables.types.type}/products`}
        />
      </Element>
    </>
  );
}
