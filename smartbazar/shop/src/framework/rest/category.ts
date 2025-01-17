import type {
  Category,
  CategoryPaginator,
  CategoryQueryOptions,
  SingleCategoryQueryOptions,
} from '@/types';
import { useInfiniteQuery, useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from '@/framework/utils/data-mappers';

export function useCategories(options?: Partial<CategoryQueryOptions>) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<CategoryPaginator, Error>(
    [API_ENDPOINTS.CATEGORIES, options],
    ({ queryKey, pageParam }) =>
      client.categories.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ currentPage, lastPage }) =>
        lastPage > currentPage && { page: currentPage + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    categories: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    error,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

export function useCategory(options: Partial<SingleCategoryQueryOptions>) {
  const { data, isLoading, error } = useQuery<Category, Error>(
    [API_ENDPOINTS.USERS_CATALOGS, options],
    () => client.categories.get(options)
  );

  return {
    category: data,
    isLoading,
    error,
  };
}
