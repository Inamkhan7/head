import type {
  HomePageProps,
  TypeQueryOptions,
  CategoryQueryOptions,
} from '@/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { sitecorePagePropsFactory } from '@/lib/page-props-factory';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import invariant from 'tiny-invariant';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  CATEGORIES_PER_PAGE,
  PRODUCTS_PER_PAGE,
  TYPES_PER_PAGE,
} from './client/variables';

// This function gets called at build time
type ParsedQueryParams = {
  groupName: string;
};
export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales,
}) => {
  invariant(locales, 'locales is not defined');
  const catalogs = await client.types.all({ limit: 100 });
  const paths = catalogs
    .reduce(
      (acc: string[], catalog): string[] =>
        catalog.settings && !acc.indexOf(catalog.settings.group as string)
          ? [...acc, catalog.settings.group as string]
          : acc,
      []
    )
    .flatMap((group) =>
      locales.map((locale) => ({ params: { groupName: group }, locale }))
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
  const { params, locale } = context;
  const { groupName } = params || {}; //* we know it's required because of getStaticPaths
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([API_ENDPOINTS.SETTINGS], () =>
    client.settings.all({})
  );

  const types = await queryClient.fetchQuery(
    [
      API_ENDPOINTS.TYPES,
      {
        limit: TYPES_PER_PAGE,
        ...(groupName ? { search: `type.group:${groupName}` } : {}),
      },
    ],
    ({ queryKey }) => {
      return client.types.all(queryKey[1] as TypeQueryOptions);
    }
  );

  const catalogs = types.map(({ id }) => id);

  const productVariables = {
    types: catalogs.join('|'),
    limit: PRODUCTS_PER_PAGE,
  };

  await queryClient.prefetchInfiniteQuery(
    [API_ENDPOINTS.PRODUCTS, productVariables],
    ({ queryKey }) => client.products.all(queryKey[1] as any)
  );

  const categoryVariables = {
    limit: CATEGORIES_PER_PAGE,
    search: `type.catalogs:${catalogs.join('|')}`,
  };

  await queryClient.prefetchInfiniteQuery(
    [API_ENDPOINTS.CATEGORIES, categoryVariables],
    ({ queryKey }) => {
      return client.categories.all(queryKey[1] as CategoryQueryOptions);
    }
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
        products: productVariables,
        categories: categoryVariables,
        types: {
          type: '',
        },
      },
      layout: 'default',
      ...(await serverSideTranslations(locale!, ['common', 'banner'])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 60,
  };
};
