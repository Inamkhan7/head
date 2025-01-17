import type { NextPageWithLayout } from '@/types';
import HomeLayout from '@/core/atoms/layouts/_home';
import { useWindowSize } from '@/lib/use-window-size';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { scroller } from 'react-scroll';
import {
  SitecoreContext,
  ComponentPropsContext,
  handleEditorFastRefresh,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecorePageProps } from '@/lib/page-props';
import { componentFactory } from '@/temp/componentFactory';
import { getStaticPaths, getStaticProps } from '@/framework/home-pages.ssr';
import { InferGetStaticPropsType } from 'next';
export { getStaticPaths, getStaticProps };

const CartCounterButton = dynamic(
  () => import('@/core/atoms/cart/cart-counter-button'),
  { ssr: false }
);
const Classic = dynamic(() => import('@/core/atoms/layouts/classic'));
const Standard = dynamic(() => import('@/core/atoms/layouts/standard'));
const Modern = dynamic(() => import('@/core/atoms/layouts/modern'));
const Minimal = dynamic(() => import('@/core/atoms/layouts/minimal'));
const Compact = dynamic(() => import('@/core/atoms/layouts/compact'));
const Basic = dynamic(() => import('@/core/atoms/layouts/basic'));

const MAP_LAYOUT_TO_GROUP: Record<string, any> = {
  classic: Classic,
  modern: Modern,
  standard: Standard,
  minimal: Minimal,
  compact: Compact,
  default: Classic,
  basic: Basic,
};

type HomeProps = InferGetStaticPropsType<typeof getStaticProps> &
  SitecorePageProps;

const Home: NextPageWithLayout<HomeProps> = ({
  variables,
  layout,
  componentProps,
  layoutData,
}) => {
  const { query } = useRouter();
  const { width } = useWindowSize();
  // const { layout, page } = useLayout();

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

  const Component = MAP_LAYOUT_TO_GROUP[layout];

  return (
    <ComponentPropsContext value={componentProps}>
      <SitecoreContext
        componentFactory={componentFactory}
        layoutData={layoutData}
      >
        {/* <Seo title={page?.name} url={page?.slug} images={page?.banners} /> */}
        <Component variables={variables} layoutData={layoutData} />
        {!['compact', 'minimal', 'basic'].includes(layout) && width > 1023 && (
          <CartCounterButton />
        )}
      </SitecoreContext>
    </ComponentPropsContext>
  );
};

Home.getLayout = function getLayout(page) {
  return (
    <HomeLayout
      layout={page.props.layout}
      catalog={page.props.variables.types.type}
    >
      {page}
    </HomeLayout>
  );
};

export default Home;
