import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { Element } from 'react-scroll';
import {
  Placeholder,
  SitecoreContext,
  ComponentPropsContext,
  handleEditorFastRefresh,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecorePageProps } from '@/lib/page-props';
import { componentFactory } from '@/temp/componentFactory';
import { getLayout } from '@/core/atoms/layouts/layout';
import Seo from '@/core/atoms/seo/seo';
import { Grid } from '@/core/atoms/products/grid';
import { sitecorePagePropsFactory } from '@/lib/page-props-factory';
import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Banner, Product } from '@/types';
import { PRODUCTS_PER_PAGE } from '@/framework/client/variables';
import { ComponentPropsCollection, DictionaryPhrases, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';

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

const handlePageOnload = (
  
  dl_pageItem: string | number | undefined,
  
  dl_pageSection: string | number | undefined,

  dl_pageType: string | number | undefined,
  
  dl_memberId: string | number | undefined,

  dl_visitor: string | number | undefined,

) => {

  const eventpageView: DataLayerEvent = {

    event: 'pageView',

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

const BannerWithSearch = dynamic(
  () => import('@/core/atoms/banners/banner-without-search')
);

const banner = [
  {
    id: '1',
    title: 'Everyday Answers',
    description: 'with Joyce Meyer',
    image: {
      original:
        'https://res.cloudinary.com/dve197bop/image/upload/q_auto:eco/v1676494218/Everyday_answers_3_wdk4gm.png',
      thumbnail:
        'https://res.cloudinary.com/dve197bop/image/upload/q_auto:eco/v1676494218/Everyday_answers_3_wdk4gm.png',
    },
  },
] as Banner[];

const mapRecipies = (recipies?: any): Product[] =>
  recipies?.map(
    (item: {
      url: string;
      displayName: string;
      fields: { Image: { value: { src: string } } };
    }) => ({
      id: item.url,
      name: item.displayName,
      image: {
        id: item.url,
        original: item.fields?.Image.value?.src,
        thumbnail: item.fields?.Image.value?.src,
      },
    })
  );

export default function HelpPage({
  layoutData,
  componentProps,
}: SitecorePageProps) {
  const { route } = layoutData.sitecore;

  useEffect(() => {
    // Since Sitecore editors do not support Fast Refresh, need to refresh EE chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  useEffect(() => {
    let url = window.location.pathname;
    let filename = url.substring(url.lastIndexOf('/')+1);
    handlePageOnload(
      "ABC","XYZ",filename,"AHS","HSE"
    );
  },[]);

  const products = useMemo(
    () => mapRecipies(route?.fields?.Recipes),
    [route?.fields?.Recipes]
  );

  return (
    <ComponentPropsContext value={componentProps}>
      <SitecoreContext
        componentFactory={componentFactory}
        layoutData={layoutData}
      >
        <Seo title="Recipe" url="recipe" />
        <BannerWithSearch layout="classic" banners={banner} />
        <Element
          name="grid"
          className="flex border-t border-solid border-border-200 border-opacity-70"
        >
          <Grid
            products={products}
            loadMore={() => null}
            isLoading={false}
            isLoadingMore={false}
            hasMore={false}
            error={null}
            limit={PRODUCTS_PER_PAGE}
            className="px-4 pb-8 lg:p-8"
            productUrlPrefix=""
          />
        </Element>
        {route && <Placeholder name="jss-main" rendering={route} />}
      </SitecoreContext>
    </ComponentPropsContext>
  );
}

HelpPage.getLayout = getLayout;

export const getStaticProps: GetStaticProps = async (context) => {
  const props = await sitecorePagePropsFactory.create({
    ...context,
    params: { pages: ['articles'] },
  });

  return {
    props: {
      ...props,
      ...(await serverSideTranslations(context.locale!, ['common'])),
    },
    revalidate: 10,
  };
};

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
