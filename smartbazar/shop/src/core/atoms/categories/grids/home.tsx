import { CATEGORIES_PER_PAGE } from '@/framework/client/variables';
import { Grid } from '@/core/atoms/categories/grid';
import { useRouter } from 'next/router';
import { useCategories } from '@/framework/category';
import { Category } from '@/types';

interface Props {
  className?: string;
  variables: any;
  column?: any;
  gridClassName?: string;
}

export default function CategoryGridHome({
  className,
  variables,
  column,
  gridClassName,
}: Props) {
  const { query } = useRouter();
  const { categories, loadMore, isLoadingMore, isLoading, hasMore, error } =
    useCategories({
      ...variables,
      ...(query.text && { text: query.text }),
      ...(query.catalog && { search: `type.slug:${query.catalog}` }),
    });

  const _categories = categories
    ?.map((cat) => {
      if (cat?.children?.length) {
        return [...(cat?.children as Category[])];
      }
      return cat;
    })
    .flat();

  return (
    <Grid
      categories={_categories}
      loadMore={loadMore}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      error={error}
      limit={CATEGORIES_PER_PAGE}
      className={className}
      gridClassName={gridClassName}
      column={column}
      catalog={query.catalog as string}
    />
  );
}
