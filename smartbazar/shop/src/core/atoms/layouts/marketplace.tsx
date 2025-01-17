import { Element } from 'react-scroll';
import Categories from '@/core/atoms/categories/categories';
import FilterBar from './filter-bar';
import BannerWithSearch from '@/core/atoms/banners/banner-with-search';
import ProductGridHome from '@/core/atoms/products/grids/home';
import type { HomePageProps } from '@/types';
import { useRouter } from 'next/router';

const MarketplaceLayout = ({ variables }: HomePageProps) => {
  const { query } = useRouter();

  return (
    <>
      <BannerWithSearch
        layout="classic"
        banners={[
          {
            id: query.groupName as string,
            title: 'Orders Delivered in 90 Minute',
            description:
              'Get your healthy foods & snacks delivered to your door, all day, everyday',
            image: {
              id: `${query.groupName}.hero`,
              original:
                'https://res.cloudinary.com/dve197bop/image/upload/v1665146771/ghp5wwmvshgo4axnhzis.png',
              thumbnail:
                'https://res.cloudinary.com/dve197bop/image/upload/v1665146771/ghp5wwmvshgo4axnhzis.png',
            },
          },
        ]}
      />
      <FilterBar variables={variables.categories} />
      <Element
        name="grid"
        className="flex border-t border-solid border-border-200 border-opacity-70"
      >
        <Categories layout="classic" variables={variables.categories} />
        <ProductGridHome
          className="px-4 pb-8 lg:p-8"
          variables={variables.products}
          productUrlPrefix="products"
        />
      </Element>
    </>
  );
};

export default MarketplaceLayout;
