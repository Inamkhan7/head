
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
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
import { getStaticPaths } from '@/framework/categories.ssr';
export { getStaticPaths };
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
export const getStaticProps: GetStaticProps = async (context) => {
  const props = await sitecorePagePropsFactory.create({
    ...context,
    params: {
      pages: [(context.params?.catalog as string) ?? '', 'articles', (context.params?.articleId as string) ?? ''],
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