import { useEffect, useState } from 'react';
import Collapse from 'rc-collapse';
import ErrorMessage from '@/core/atoms/ui/error-message';
import QuoteWithLoader from '@/core/atoms/quotes/quote-with-loader';
import QuoteCard from '@/core/atoms/quotes/quote-card';
import QuoteDetails from '@/core/atoms/quotes/quote-details';
import QuoteListMobile from '@/core/atoms/quotes/quote-list-mobile';
import { useOrders } from '@/framework/order';

export default function Quotes() {
  const { orders, isLoading, error, hasMore, loadMore, isLoadingMore } =
    useOrders();
  const [order, setOrder] = useState<any>({});
  useEffect(() => {
    if (orders.length) {
      setOrder(orders[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.length]);
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <QuoteWithLoader
        notFound={!isLoading && !orders?.length}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        showLoaders={isLoading && !orders.length}
        hasNextPage={hasMore}
        order={order}
      >
        {orders.map((_order: any, index: number) => (
          <QuoteCard
            key={index}
            order={_order}
            onClick={() => setOrder(_order)}
            isActive={order?.id === _order?.id}
          />
        ))}
      </QuoteWithLoader>

      <QuoteListMobile
        notFound={!isLoading && !orders?.length}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        showLoaders={isLoading && !orders.length}
        hasNextPage={hasMore}
        order={order}
      >
        {orders.map((_order: any, index: number) => (
          <Collapse.Panel
            header={
              <QuoteCard
                key={`mobile_${index}`}
                order={_order}
                onClick={() => setOrder(_order)}
                isActive={order?.id === _order?.id}
              />
            }
            headerClass="accordion-title"
            key={index}
            className="mb-4"
          >
            <QuoteDetails order={order} />
          </Collapse.Panel>
        ))}
      </QuoteListMobile>
    </>
  );
}
