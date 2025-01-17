import HomeLayout from '@/core/atoms/layouts/_home';
import ProductGridHome from '@/core/atoms/products/grids/home';
import type { NextPageWithLayout } from '@/types';

import { getStaticProps, getStaticPaths } from '@/framework/products.ssr';
import { InferGetStaticPropsType } from 'next';
import { useCategory } from '@/framework/category';
import BackButton from '@/core/atoms/ui/back-button';
import {
  ComponentPropsCollection,
  DictionaryPhrases,
  LayoutServiceData,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { useEffect } from 'react';

export { getStaticProps, getStaticPaths };

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
  memberId: string | number | undefined;
  visitor: string | number | undefined;
}

const handlePageOnload = (
  dl_pageItem: string | number | undefined,
  dl_pageSection: string | number | undefined,
  dl_pageType: string | number | undefined,
  dl_memberId: string | number | undefined,
  dl_visitor: string | number | undefined
) => {
  const eventpageView: DataLayerEvent = {
    event: 'PageView',
    loginStatus: 'out',
    pageArea: 'pub',
    pageItem: dl_pageItem,
    pageSection: dl_pageSection,
    pageType: dl_pageType,
    memberId: dl_memberId,
    visitor: dl_visitor,
  };

  window.dataLayer.push(eventpageView);
};

interface DataLayerClickEvent {
  event: string;
  loginStatus: string;
  pageArea: string;
  pageItem: string;
  pageSection: string;
  pageType: string;
  clickType: string;
  memberId: string;
  visitor: string;
}

const handlePageOnClick = () => {
  const eventData: DataLayerClickEvent = {
    event: 'click',
    loginStatus: 'out',
    pageArea: 'pub',
    pageItem: 'Login Page by Ritik',
    pageSection: 'Credentials',
    pageType: 'Login',
    clickType: 'login',
    memberId: 'XXX',
    visitor: 'AAA',
  };
  window.dataLayer.push(eventData);
};

const CategoryPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ variables }) => {
  const { category } = useCategory({
    ...variables.categories,
  });

  useEffect(() => {
    let url = window.location.pathname;
    let filename = url.substring(url.lastIndexOf('/') + 1);
    handlePageOnload(
      filename + ' Products',
      'Products',
      filename,
      'ABC',
      'XYZ'
    );
  }, []);

  return (
    <>
      <section className="static py-8 px-4 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
        <div className="absolute mt-2">
          <BackButton />
        </div>
        <header className="mb-8 text-center">
          <h1 className="text-xl font-bold md:text-2xl xl:text-3xl">
            {category?.name}
          </h1>
        </header>
      </section>
      <ProductGridHome
        className="px-4 pb-8 lg:p-8"
        variables={variables.products}
        productUrlPrefix={`${variables.types.type}/products`}
      />
    </>
  );
};

CategoryPage.getLayout = function getLayout(page) {
  return (
    <HomeLayout layout="classic" catalog={page.props.variables.types.type}>
      {page}
    </HomeLayout>
  );
};

export default CategoryPage;
