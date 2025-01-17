import Button from '@/core/atoms/ui/button';
import Spinner from '@/core/atoms/ui/loaders/spinner/spinner';
import { useTranslation } from 'next-i18next';
import Collapse from 'rc-collapse';
import 'rc-collapse/assets/index.css';
import { Image } from '@/core/atoms/ui/image';
import noResult from '@/assets/no-result.svg';

interface OrdersWithLoaderProps {
  showLoaders: boolean;
  hasNextPage: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  notFound: boolean;
  order: any;
}

const OrderListMobile: React.FC<OrdersWithLoaderProps> = ({
  showLoaders,
  hasNextPage,
  isLoadingMore,
  onLoadMore,
  notFound,
  children,
  order,
}) => {
  const { t } = useTranslation('common');
  return (
    <div className="flex w-full flex-col lg:hidden">
      <div className="flex h-full w-full flex-col px-0 pb-5">
        <h3 className="pb-5 text-xl font-semibold text-heading">
          {t('profile-sidebar-orders')}
        </h3>
        {Boolean(order) && (
          <Collapse
            accordion={true}
            defaultActiveKey="active"
            expandIcon={() => null}
          >
            {showLoaders ? (
              <p>
                <Spinner showText={false} />
              </p>
            ) : (
              children
            )}

            {hasNextPage && (
              <div className="mt-8 flex justify-center">
                <Button
                  loading={isLoadingMore}
                  onClick={onLoadMore}
                  className="h-11 text-sm font-semibold md:text-base"
                >
                  {t('text-load-more')}
                </Button>
              </div>
            )}
          </Collapse>
        )}

        {notFound && (
          <div className="my-auto flex h-full w-full flex-col items-center justify-center py-10">
            <div className="mb-7 flex h-full w-5/6 items-center justify-center">
              <Image
                src={noResult}
                className="h-full w-full object-contain"
                alt="No Order Found"
              />
            </div>
            <h4 className="text-center text-sm font-semibold text-body">
              {t('error-no-orders')}
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListMobile;
