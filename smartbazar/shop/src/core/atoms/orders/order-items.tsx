import { Table } from '@/core/atoms/ui/table';
import usePrice from '@/lib/use-price';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/lib/locals';
import React, { useMemo } from 'react';
import { Image } from '@/core/atoms/ui/image';
import { productPlaceholder } from '@/lib/placeholders';

const OrderItemList = React.memo((props: any) => {
  const { price } = usePrice({
    amount: props.pivot?.unit_price,
  });
  let name = props.name;
  if (props?.pivot?.variation_option_id) {
    const variationTitle = props?.variation_options?.find(
      (vo: any) => vo?.id === props?.pivot?.variation_option_id
    )['title'];
    name = `${name} - ${variationTitle}`;
  }
  return (
    <div className="flex items-center">
      <div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded">
        <Image
          src={props.image?.thumbnail ?? productPlaceholder}
          alt={name}
          className="h-full w-full object-cover"
          layout="fill"
        />
      </div>

      <div className="flex flex-col overflow-hidden ltr:ml-4 rtl:mr-4">
        <div className="mb-1 flex">
          <span className="inline-block overflow-hidden truncate text-sm text-body">
            {name} x&nbsp;
          </span>
          <span className="inline-block overflow-hidden truncate text-sm font-semibold text-heading">
            {props.unit}
          </span>
        </div>
        <span className="mb-1 inline-block overflow-hidden truncate text-sm font-semibold text-accent">
          {price}
        </span>
      </div>
    </div>
  );
});

OrderItemList.displayName = 'OrderItemList';

const Price = React.memo(({ amount }: { amount: number }) => {
  const { price } = usePrice({ amount });
  return <p>{price}</p>;
});

Price.displayName = 'Price';

export const OrderItems = React.memo(({ products }: { products: any }) => {
  const { t } = useTranslation('common');
  const { alignLeft, alignRight } = useIsRTL();

  const orderTableColumns = useMemo(
    () => [
      {
        title: <span className="ltr:pl-20 rtl:pr-20">{t('text-item')}</span>,
        dataIndex: '',
        key: 'items',
        align: alignLeft,
        width: 250,
        ellipsis: true,
        render: (_: any, record: any) => <OrderItemList {...record} />,
      },
      {
        title: t('text-quantity'),
        dataIndex: 'pivot',
        key: 'pivot',
        align: 'center',
        width: 100,
        render: function renderQuantity(pivot: any) {
          return <p className="text-base">{pivot.order_quantity}</p>;
        },
      },
      {
        title: t('text-price'),
        dataIndex: 'pivot',
        key: 'price',
        align: alignRight,
        width: 100,
        render: (pivot: any) => <Price amount={pivot.subtotal} />,
      },
    ],
    [alignLeft, alignRight, t]
  );

  return (
    <Table
      //@ts-ignore
      columns={orderTableColumns}
      data={products}
      rowKey={(record: any) =>
        record.pivot?.variation_option_id
          ? record.pivot.variation_option_id
          : record.created_at
      }
      className="orderDetailsTable w-full"
      scroll={{ x: 350, y: 500 }}
    />
  );
});

OrderItems.displayName = 'OrderItems';
