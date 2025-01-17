import Banner from '@/core/atoms/banners/banner';
import Categories from '@/core/atoms/categories/categories';
import type { HomePageProps } from '@/types';

export default function MinimalLayout({ variables }: HomePageProps) {
  return (
    <>
      <Banner layout="minimal" variables={variables.types} />
      <Categories layout="minimal" variables={variables.categories} />
    </>
  );
}
