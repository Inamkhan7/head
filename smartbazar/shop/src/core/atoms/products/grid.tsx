import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import Button from '@/core/atoms/ui/button';
import ProductLoader from '@/core/atoms/ui/loaders/product-loader';
import NotFound from '@/core/atoms/ui/not-found';
import rangeMap from '@/lib/range-map';
import ProductCard from '@/core/atoms/products/cards/card';
import ErrorMessage from '@/core/atoms/ui/error-message';
import { useProducts } from '@/framework/product';
import { PRODUCTS_PER_PAGE } from '@/framework/client/variables';
import type { Product } from '@/types';

interface Props {
  limit?: number;
  sortedBy?: string;
  orderBy?: string;
  column?: 'five' | 'auto' | 'three';
  shopId?: string;
  gridClassName?: string;
  products: Product[] | undefined;
  isLoading?: boolean;
  error?: any;
  loadMore?: any;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  className?: string;
  productUrlPrefix: string;
}

export function Grid({
  className,
  gridClassName,
  products,
  isLoading,
  error,
  loadMore,
  isLoadingMore,
  hasMore,
  limit = PRODUCTS_PER_PAGE,
  column = 'auto',
  productUrlPrefix,
}: Props) {
  const { t } = useTranslation('common');

  if (error) return <ErrorMessage message={error.message} />;

  if (!isLoading && !products?.length) {
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
            'grid grid-cols-1 gap-6 gap-y-10 lg:grid-cols-3 xl:grid-cols-3 xl:gap-8 xl:gap-y-11 2xl:grid-cols-3 3xl:grid-cols-3':
              column === 'three',
          },
          gridClassName
        )}
      >
        {isLoading && !products?.length
          ? rangeMap(limit, (i) => (
              <ProductLoader key={i} uniqueKey={`product-${i}`} />
            ))
          : products?.map((product) => (
              <ProductCard
                productUrlPrefix={productUrlPrefix}
                product={product}
                key={product.id}
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
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
interface ProductsGridProps {
  className?: string;
  gridClassName?: string;
  variables?: any;
  column?: 'five' | 'auto';
}
export default function ProductsGrid({
  className,
  gridClassName,
  variables,
  column = 'auto',
}: ProductsGridProps) {
  const { products, loadMore, isLoadingMore, isLoading, hasMore, error } =
    useProducts(variables);

  return (
    <Grid
      products={products}
      loadMore={loadMore}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      error={error}
      className={className}
      gridClassName={gridClassName}
      column={column}
      productUrlPrefix={`${variables.type}/products`}
    />
  );
}
