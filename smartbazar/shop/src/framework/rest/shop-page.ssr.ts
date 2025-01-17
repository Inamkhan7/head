import type {
  CategoryQueryOptions,
  HomePageProps,
  PopularProductQueryOptions,
  TypeQueryOptions,
} from '@/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import invariant from 'tiny-invariant';
import { sitecorePagePropsFactory } from '@/lib/page-props-factory';
import { sitemapFetcher } from '@/lib/sitemap-fetcher';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  CATEGORIES_PER_PAGE,
  PRODUCTS_PER_PAGE,
  TYPES_PER_PAGE,
} from './client/variables';

type ParsedQueryParams = {
  catalog: string;
};

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  invariant(locales, 'locales is not defined');
  const catalogs = await client.types.all();
  const categories = await Promise.all(
    catalogs.map((catalog) =>
      client.categories.all({ limit: 100, type: catalog.id })
    )
  );
  const paths = catalogs.flatMap(({ id: catalogId }, index) =>
    categories[index].data?.flatMap((category) =>
      locales.map((locale) => ({
        params: { categoryId: category.id, catalog: catalogId },
        locale,
      }))
    )
  );

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  HomePageProps,
  ParsedQueryParams
> = async (context) => {
  const { locale, params } = context;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([API_ENDPOINTS.SETTINGS], () =>
    client.settings.all({})
  );
  const types = await queryClient.fetchQuery(
    [API_ENDPOINTS.TYPES, { limit: TYPES_PER_PAGE }],
    ({ queryKey }) => client.types.all(queryKey[1] as TypeQueryOptions)
  );

  const { catalog } = params!;
  let pageType: string | undefined;
  if (!catalog) {
    pageType =
      types.find((type) => type.settings.isHome)?.slug ?? types[0].slug;
  } else {
    pageType = catalog;
  }
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.TYPES, pageType],
    ({ queryKey }) => client.types.get(queryKey[1])
  );
  const productVariables = {
    type: pageType,
    limit: PRODUCTS_PER_PAGE,
  };
  await queryClient.prefetchInfiniteQuery(
    [API_ENDPOINTS.PRODUCTS, { limit: PRODUCTS_PER_PAGE, type: pageType }],
    ({ queryKey }) => client.products.all(queryKey[1] as any)
  );

  const popularProductVariables = {
    type_slug: pageType,
    limit: 10,
    with: 'type;author',
  };

  // Only prefetch popular products for `book` demo
  if (pageType === 'book') {
    await queryClient.prefetchQuery(
      [API_ENDPOINTS.PRODUCTS_POPULAR, popularProductVariables],
      ({ queryKey }) =>
        client.products.popular(queryKey[1] as PopularProductQueryOptions)
    );
  }

  const categoryVariables = {
    type: pageType,
    limit: CATEGORIES_PER_PAGE,
    parent:
      types.find((t) => t.slug === pageType)?.settings.layoutType === 'minimal'
        ? 'all'
        : 'null',
  };
  await queryClient.prefetchInfiniteQuery(
    [API_ENDPOINTS.CATEGORIES, categoryVariables],
    ({ queryKey }) => client.categories.all(queryKey[1] as CategoryQueryOptions)
  );

  let sitecoreProps = {};

  try {
    sitecoreProps = await sitecorePagePropsFactory.create(context);
  } catch (err) {
    console.error('Sicecore error', err);
  }

  return {
    props: {
      ...sitecoreProps,
      variables: {
        popularProducts: popularProductVariables,
        products: productVariables,
        categories: categoryVariables,
        types: {
          type: pageType,
        },
      },
      layout:
        types.find((t) => t.slug === pageType)?.settings.layoutType ??
        'default',
      ...(await serverSideTranslations(locale!, ['common', 'banner'])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 10,
  };
};

/* Fix : locales: 14kB,
popularProducts: 30kB,
category: 22kB,
groups: 8kB,
group: 2kB,
settings: 2kB,
perProduct: 4.2 * 30 = 120kB,
total = 14 + 30 + 22 + 8 + 2 + 2 + 120 = 198kB 
others: 225 - 198 = 27kB

 */
