import type {Product, TypeQueryOptions } from '@/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import invariant from 'tiny-invariant';
import client from './client';
import { dehydrate, QueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/framework/client/api-endpoints';
import { TYPES_PER_PAGE } from './client/variables';
import { Auth, PriceSchedules, Tokens, PriceSchedule } from 'ordercloud-javascript-sdk';
import { Configuration } from 'ordercloud-javascript-sdk';

type ParsedQueryParams = {
  slug: string;
  catalog: string;
};

export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({ locales }) => {
  invariant(locales, 'locales is not defined');
  
  const catalogs = await client.types.all();
  const products = await Promise.all(
    catalogs.map((catalog) => client.products.all({ limit: 100, type: catalog.id }))
  );
  
  const paths = catalogs.flatMap(({ id: catalogId }, index) =>
    products[index].data?.flatMap((product) =>
      locales.map((locale) => ({
        params: { slug: product.slug.toString(), catalog: catalogId },
        locale,
      }))
    )
  );
  
  return {
    paths,
    fallback: 'blocking',
  };
};

type PageProps = {
  product: Product;
  priceSchedule: PriceSchedule;
};

const clientSecret = 'aeiTWwmVaocTPcqkEpFiInyNGRdOYHAwomzOn8ID3G3C90fsl0aXVp5zfRqI';
const clientId = 'C37C1808-34A1-4E04-BE1D-D28CD50A1F31'
// Authenticate and get access token
const authenticateOrderCloud = async () => {
  try {
    Configuration.Set({
      baseApiUrl: 'https://sandboxapi.ordercloud.io',
      timeoutInMilliseconds: 20 * 1000
    })
    const authResponse = await Auth.ClientCredentials(clientSecret,clientId, ['FullAccess']);

    // Set the access token for subsequent API calls
    Tokens.SetAccessToken(authResponse.access_token);
  } catch (error) {
    console.error('Error authenticating OrderCloud:', error);
  }
};

export const getStaticProps: GetStaticProps<PageProps, ParsedQueryParams> = async ({ params, locale }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  const { slug, catalog } = params;

  const queryClient = new QueryClient();

  const types = await queryClient.fetchQuery(
    [API_ENDPOINTS.TYPES, { limit: TYPES_PER_PAGE }],
    ({ queryKey }) => client.types.all(queryKey[1] as TypeQueryOptions)
  );

  await queryClient.prefetchQuery([API_ENDPOINTS.SETTINGS], () =>
    client.settings.all({})
  );

  let pageType: string | undefined;
  if (!catalog) {
    pageType = types.find((type) => type.settings.isHome)?.slug ?? types[0].slug;
  } else {
    pageType = catalog;
  }

  try {
    const product = await client.products.get(slug);
    console.log(product);
    
  await authenticateOrderCloud();
   const priceSchedule = await PriceSchedules.Get(product?.slug);

   console.log('price debug', priceSchedule);

    return {
      props: {
        product,
        priceSchedule,
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
