import type {
  CategoryPageProps,
  CategoryQueryOptions,
  Product,
  SingleCategoryQueryOptions,
  TypeQueryOptions,
} from '@/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import invariant from 'tiny-invariant';
import client from './client';
import { dehydrate } from 'react-query/hydration';
import { API_ENDPOINTS } from '@/framework/client/api-endpoints';
import { QueryClient } from 'react-query';
import { PRODUCTS_PER_PAGE, TYPES_PER_PAGE } from './client/variables';

// This function gets called at build time
type ParsedQueryParams = {
  category: string;
  catalog: string;
};
export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales,
}) => {
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
        params: { category: category.slug.toString(), catalog: catalogId },
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
  CategoryPageProps,
  ParsedQueryParams
> = async ({ params, locale }) => {
  try {
    const { category, catalog } = params!; //* we know it's required because of getStaticPaths

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery([API_ENDPOINTS.SETTINGS], () =>
      client.settings.all({})
    );

    let pageType = catalog;

    if (!catalog) {
      const types = await queryClient.fetchQuery(
        [API_ENDPOINTS.TYPES, { limit: TYPES_PER_PAGE }],
        ({ queryKey }) => client.types.all(queryKey[1] as TypeQueryOptions)
      );
      pageType =
        types.find((type) => type.settings.isHome)?.slug ?? types[0].slug;
    }

    await queryClient.prefetchQuery(
      [API_ENDPOINTS.TYPES, pageType],
      ({ queryKey }) => client.types.get(queryKey[1])
    );
    const productVariables = {
      type: pageType,
      limit: PRODUCTS_PER_PAGE,
    };

    const categoryVariables = {
      type: pageType,
      category,
    };
    await queryClient.prefetchQuery(
      [API_ENDPOINTS.USERS_CATALOGS, categoryVariables],
      ({ queryKey }) =>
        client.categories.get(queryKey[1] as SingleCategoryQueryOptions)
    );
    await queryClient.prefetchInfiniteQuery(
      [
        API_ENDPOINTS.PRODUCTS,
        { limit: PRODUCTS_PER_PAGE, type: pageType, categories: category },
      ],
      ({ queryKey }) => client.products.all(queryKey[1] as any)
    );

    return {
      props: {
        variables: {
          products: productVariables,
          categories: categoryVariables,
          types: {
            type: pageType,
          },
        },
        layout: 'classic',
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
