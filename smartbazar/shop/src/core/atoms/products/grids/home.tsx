import { useProducts } from '@/framework/product';
import { PRODUCTS_PER_PAGE } from '@/framework/client/variables';
import { Grid } from '@/core/atoms/products/grid';
import { useRouter } from 'next/router';
interface Props {
  className?: string;
  variables: any;
  column?: any;
  gridClassName?: string;
  productUrlPrefix: string;
}
export default function ProductGridHome({
  className,
  variables,
  column,
  gridClassName,
  productUrlPrefix,
}: Props) {
  const { query } = useRouter();
  const { products, loadMore, isLoadingMore, isLoading, hasMore, error } =
    useProducts({
      ...variables,
      ...(query.category && { categories: query.category }),
      ...(query.text && { text: query.text }),
      // ...(query.type && { type: query.pages?.[0] }),
    });

  return (
    <Grid
      products={products}
      loadMore={loadMore}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      error={error}
      limit={PRODUCTS_PER_PAGE}
      className={className}
      gridClassName={gridClassName}
      column={column}
      productUrlPrefix={productUrlPrefix}
    />
  );
}
