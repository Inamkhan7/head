import {
  ComponentPropsContext,
  Placeholder,
  SitecoreContext,
  handleEditorFastRefresh,
  ComponentPropsCollection,
  DictionaryPhrases,
  LayoutServiceData,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { scroller } from 'react-scroll';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { NextPageWithLayout } from '@/types';
import { sitecorePagePropsFactory } from '@/lib/page-props-factory';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getStaticPaths } from '@/framework/categories.ssr';
import { componentFactory } from '@/temp/componentFactory';
import Footer from '@/core/atoms/layouts/footer';

export { getStaticPaths };

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
    utag_cfg_ovrd: {
      account: string;
      profile: string;
      env: string;
    };
    utag: any;
    callback: any;
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

const HomeLayout = dynamic(() => import('@/core/atoms/layouts/_home'));

type HomepageProps = InferGetStaticPropsType<typeof getStaticProps> &
  SitecorePageProps;

const Homepage: NextPageWithLayout<HomepageProps> = ({
  componentProps,
  layoutData,
}) => {
  const { query } = useRouter();
  const { route } = layoutData.sitecore;

  useEffect(() => {
    // Since Sitecore editors do not support Fast Refresh, need to refresh EE chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  useEffect(() => {
    if (query.text || query.category) {
      scroller.scrollTo('grid', {
        smooth: true,
        offset: -80,
      });
    }
  }, [query.text, query.category]);

  useEffect(() => {
    let url = window.location.pathname;
    let filename = url.substring(url.lastIndexOf('/') + 1);
    handlePageOnload('ABC', 'XYZ', filename, 'AHS', 'HSE');
  }, []);

  return (
    <div>
      <ComponentPropsContext value={componentProps}>
        <SitecoreContext
          componentFactory={componentFactory}
          layoutData={layoutData}
        >
          {route && <Placeholder name="jss-main" rendering={route} />}
        </SitecoreContext>
      </ComponentPropsContext>
    </div>
  );
};

Homepage.getLayout = function getLayout(page) {
  return (
    <HomeLayout layout="basic" catalog="">
      {page}
      <Footer />
    </HomeLayout>
  );
};

export default Homepage;

export const getStaticProps: GetStaticProps = async (context) => {
  const props = await sitecorePagePropsFactory.create({
    ...context,
    params: { pages: [(context.params?.catalog as string) ?? '/'] },
  });
  return {
    props: {
      ...props,
      ...(await serverSideTranslations(context.locale!, ['common'])),
    },
    revalidate: 10,
  };
};
