import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths, GetStaticProps } from 'next';
import {
  Placeholder,
  SitecoreContext,
  ComponentPropsContext,
  handleEditorFastRefresh,
  StaticPath,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecorePageProps } from '@/lib/page-props';
import { componentFactory } from '@/temp/componentFactory';
import { getLayout } from '@/core/atoms/layouts/layout';
// import Seo from '@/core/atoms/seo/seo';
import { sitecorePagePropsFactory } from '@/lib/page-props-factory';
import { useEffect } from 'react';
import invariant from 'tiny-invariant';
import { getPathsById } from '@/utils/sitecore-dynamic-paths';

export default function ArticlePage({
  layoutData,
  componentProps,
}: SitecorePageProps) {
  const { route } = layoutData.sitecore;

  useEffect(() => {
    // Since Sitecore editors do not support Fast Refresh, need to refresh EE chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  return (
    <ComponentPropsContext value={componentProps}>
      <SitecoreContext
        componentFactory={componentFactory}
        layoutData={layoutData}
      >
        {/* <Seo title="Help" url="help" /> */}
        {route && <Placeholder name="jss-main" rendering={route} />}
      </SitecoreContext>
    </ComponentPropsContext>
  );
}

ArticlePage.getLayout = getLayout;

export const getStaticPaths: GetStaticPaths = async (context) => {
  let paths: StaticPath[] = [];
  let fallback: boolean | 'blocking' = 'blocking';

  if (process.env.NODE_ENV !== 'development') {
    return await getPathsById(context, 'article', 'articleId');
  }

  const { locales } = context;
  invariant(locales, 'locales is not defined');
  paths = locales.map((locale) => ({
    params: { path: ['articles'], articleId: 'tea-sourcing' },
    locale,
  }));

  // We'll pre-render only these paths at build time also with the slash route.
  return {
    paths,
    fallback,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const props = await sitecorePagePropsFactory.create({
    ...context,
    params: {
      pages: ['articles', (context.params?.articleId as string) ?? ''],
    },
  });

  return {
    props: {
      ...props,
      ...(await serverSideTranslations(context.locale!, ['common', 'faq'])),
    },
    revalidate: 10,
  };
};
