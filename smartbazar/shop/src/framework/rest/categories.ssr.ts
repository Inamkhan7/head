import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import invariant from 'tiny-invariant';
import client from './client';
import { dehydrate } from 'react-query/hydration';
import { API_ENDPOINTS } from '@/framework/client/api-endpoints';
import { QueryClient } from 'react-query';
import { TYPES_PER_PAGE } from './client/variables';
import { TypeQueryOptions } from '@/types';
import { sitemapFetcher } from '@/lib/sitemap-fetcher';
import camelCase from 'lodash/camelCase';

export const getStaticPaths: GetStaticPaths = async (context) => {
  const { locales } = context;
  invariant(locales, 'locales is not defined');
  const catalogs = await client.types.all();
  const categories = await Promise.all(
    catalogs.map((catalog) =>
      client.categories.all({ limit: 100, type: catalog.id })
    )
  );

  const sitemap = (await sitemapFetcher.fetch(context)).reduce((acc, item) => {
    if (item.params.path.length === 1) {
      return [...acc, camelCase(item.params.path[0])];
    }
    return acc;
  }, [] as string[]);

  const paths = catalogs
    .flatMap(({ id: catalogId }, index) =>
      categories[index].data?.flatMap((category) =>
        locales.map((locale) => ({
          params: { categoryId: category.id, catalog: catalogId },
          locale,
        }))
      )
    )
    .filter((item) => sitemap.includes(camelCase(item.params.categoryId)));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const queryClient = new QueryClient();

  const types = await queryClient.fetchQuery(
    [API_ENDPOINTS.TYPES, { limit: TYPES_PER_PAGE }],
    ({ queryKey }) => client.types.all(queryKey[1] as TypeQueryOptions)
  );

  await queryClient.prefetchQuery([API_ENDPOINTS.SETTINGS], () =>
    client.settings.all({})
  );

  const { catalog } = params!;
  let pageType: string | undefined;
  if (!catalog) {
    pageType =
      types.find((type) => type.settings.isHome)?.slug ?? types[0].slug;
  } else {
    pageType = catalog as string;
  }

  try {
    const options =
      params && params.catalog ? { type: params.catalog as string } : {};
    const categories = await client.categories.all(options);
    return {
      props: {
        categories,
        variables: {
          types: {
            type: pageType,
          },
        },
        ...(await serverSideTranslations(locale!, ['common'])),
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
