import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths, GetStaticProps } from 'next';
import {
  Placeholder,
  SitecoreContext,
  ComponentPropsContext,
  handleEditorFastRefresh,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecorePageProps } from '@/lib/page-props';
import { componentFactory } from '@/temp/componentFactory';
import { getLayout } from '@/core/atoms/layouts/layout';
// import Seo from '@/core/atoms/seo/seo';
import { sitecorePagePropsFactory } from '@/lib/page-props-factory';
import { useEffect } from 'react';
import invariant from 'tiny-invariant';
import { getPathsById } from '@/utils/sitecore-dynamic-paths';

export default function HelpPage({
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

HelpPage.getLayout = getLayout;

export const getStaticPaths: GetStaticPaths = async (context) => {
  const { locales } = context;
  invariant(locales, 'locales is not defined');

  if (process.env.NODE_ENV !== 'development') {
    return await getPathsById(context, 'recipe', 'recipeId');
  }

  const paths = locales.map((locale) => ({
    params: { recipeId: 'recipe-1' },
    locale,
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const props = await sitecorePagePropsFactory.create({
    ...context,
    params: { pages: ['recipe', (context.params?.recipeId as string) ?? ''] },
  });

  return {
    props: {
      ...props,
      ...(await serverSideTranslations(context.locale!, ['common', 'faq'])),
    },
    revalidate: 10,
  };
};
