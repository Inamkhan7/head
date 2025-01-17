import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import Button from '@/core/atoms/ui/button';
import ProductLoader from '@/core/atoms/ui/loaders/product-loader';
import NotFound from '@/core/atoms/ui/not-found';
import rangeMap from '@/lib/range-map';
import CategoryCard from '@/core/atoms/categories/cards/card';
import ErrorMessage from '@/core/atoms/ui/error-message';
import { useCategories } from '@/framework/category';
import { CATEGORIES_PER_PAGE } from '@/framework/client/variables';
import type { Category } from '@/types';

interface Props {
  limit?: number;
  sortedBy?: string;
  orderBy?: string;
  column?: 'five' | 'auto';
  shopId?: string;
  gridClassName?: string;
  categories: Category[] | undefined;
  isLoading?: boolean;
  error?: any;
  loadMore?: any;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  className?: string;
  catalog: string;
}

export function Grid({
  className,
  gridClassName,
  categories,
  isLoading,
  error,
  loadMore,
  isLoadingMore,
  hasMore,
  limit = CATEGORIES_PER_PAGE,
  column = 'auto',
  catalog,
}: Props) {
  const { t } = useTranslation('common');

  if (error) return <ErrorMessage message={error.message} />;

  if (!isLoading && !categories?.length) {
    return (
      <div className="min-h-full w-full px-4 pt-6 pb-8 lg:p-8">
        <NotFound text="text-not-found" className="mx-auto w-7/12" />
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          {
            'grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3':
              column === 'auto',
            'grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 gap-y-10 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:gap-8 xl:gap-y-11 2xl:grid-cols-5 3xl:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]':
              column === 'five',
          },
          gridClassName
        )}
      >
        {isLoading && !categories?.length
          ? rangeMap(limit, (i) => (
              <ProductLoader key={i} uniqueKey={`category-${i}`} />
            ))
          : categories?.map((category) => (
              <CategoryCard
                category={category}
                key={category.id}
                catalog={category.type?.id || catalog}
                catalogName={category.type?.name}
              />
            ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex justify-center lg:mt-12">
          <Button
            loading={isLoadingMore}
            onClick={loadMore}
            className="h-11 text-sm font-semibold md:text-base"
          >
            {t('text-load-more')}
          </Button>
        </div>
      )}
    </div>
  );
}
interface CategoriesGridProps {
  className?: string;
  gridClassName?: string;
  variables?: any;
  column?: 'five' | 'auto';
  catalog: string;
}
export default function CategoriesGrid({
  className,
  gridClassName,
  variables,
  column = 'auto',
  catalog,
}: CategoriesGridProps) {
  const { categories, loadMore, isLoadingMore, isLoading, hasMore, error } =
    useCategories(variables);

  return (
    <Grid
      categories={categories}
      loadMore={loadMore}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      error={error}
      className={className}
      gridClassName={gridClassName}
      column={column}
      catalog={catalog}
    />
  );
}
