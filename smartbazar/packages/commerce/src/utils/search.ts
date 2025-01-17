export type SearchSchema = {
  [key: string]: string;
  name: string;
  'type.slug': string;
  'categories.slug': string;
  'tags.slug': string;
  status: string;
  'author.slug': string;
  'manufacturer.slug': string;
};

export const getSearchParams = <T>(
  schema: Partial<SearchSchema>,
  search?: string,
): Partial<T> => {
  return search?.split(';')?.reduce((searchParams, param) => {
    const pairs = param.split(':');

    return {
      ...searchParams,
      [schema[pairs[0]]]: pairs[1],
    };
  }, {});
};
