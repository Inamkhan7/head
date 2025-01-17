import {
  ComponentPropsContext,
  Placeholder,
  SitecoreContext,
  handleEditorFastRefresh,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecorePageProps } from '@/lib/page-props';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { scroller } from 'react-scroll';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import { NextPageWithLayout } from '@/types';
import { sitecorePagePropsFactory } from '@/lib/page-props-factory';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { componentFactory } from '@/temp/componentFactory';
import Footer from '@/core/atoms/layouts/footer';

const HomeLayout = dynamic(() => import('@/core/atoms/layouts/_home'));

type AboutpageProps = InferGetStaticPropsType<typeof getStaticProps> &
  SitecorePageProps;

const Aboutpage: NextPageWithLayout<AboutpageProps> = ({
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

Aboutpage.getLayout = function getLayout(page) {
  return (
    <HomeLayout layout="basic" catalog="">
      {page}
      <Footer />
    </HomeLayout>
  );
};

export default Aboutpage;

export const getStaticProps: GetStaticProps = async (context) => {
  const props = await sitecorePagePropsFactory.create({
    ...context,
    params: { pages: ['/about'] },
  });
  return {
    props: {
      ...props,
      ...(await serverSideTranslations(context.locale!, ['common'])),
    },
    revalidate: 10,
  };
};
