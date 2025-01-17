import { sitemapFetcher } from "@/lib/sitemap-fetcher";
import { GetStaticPathsContext, GetStaticPathsResult } from "next/types";
import { ParsedUrlQuery } from "querystring";

type Params = {
  params: { [key: string]: string } 
}

type LocalizaedParams = Params & {
  locale: string;
}

export const getPathsById = async (context: GetStaticPathsContext, pathName: string, dynamicId: string) => {
  const sitemap = await sitemapFetcher.fetch(context);

  const _paths = sitemap.reduce((items, item) => {
    if (item.params.path.length === 2 && item.params.path?.[0] === pathName) {
      return [...items, {
        params: {
          [dynamicId]: item.params.path?.[1].toString(),
        },
      }]
    }
    return items;
  }, [] as Params[]);

  const paths = context.locales?.reduce((locales, locale) => {
    const localePaths = _paths.map((item) => ({
      ...item,
      locale
    }));

    return [...locales, ...localePaths];
  }, [] as LocalizaedParams[]);

  return {
    paths,
    fallback: process.env.EXPORT_MODE ? false : 'blocking',
  } as GetStaticPathsResult<ParsedUrlQuery>;
}