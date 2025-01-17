import {
  SitecoreContext,
  ComponentPropsContext,
  handleEditorFastRefresh,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecorePageProps } from '@/lib/page-props';
import { componentFactory } from '@/temp/componentFactory';
import { InferGetStaticPropsType } from 'next';
import { scroller } from 'react-scroll';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { getLayout } from '@/core/atoms/layouts/layout';
import { NextPageWithLayout } from '@/types';
import { getStaticPaths, getStaticProps } from '@/framework/marketplace.ssr';
export { getStaticPaths, getStaticProps };

const MarketplaceLayout = dynamic(
  () => import('@/core/atoms/layouts/marketplace')
);

type MarketplaceProps = InferGetStaticPropsType<typeof getStaticProps> &
  SitecorePageProps;

const Marketplace: NextPageWithLayout<MarketplaceProps> = ({
  variables,
  componentProps,
  layoutData,
}) => {
  const { query } = useRouter();

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
    <ComponentPropsContext value={componentProps}>
      <SitecoreContext
        componentFactory={componentFactory}
        layoutData={layoutData}
      >
        <MarketplaceLayout variables={variables} layout="classic" />
      </SitecoreContext>
    </ComponentPropsContext>
  );
};

Marketplace.getLayout = getLayout;
export default Marketplace;
