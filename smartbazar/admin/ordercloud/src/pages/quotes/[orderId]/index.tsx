import Card from '@components/common/card';
import Layout from '@components/layouts/admin';
import Image from 'next/image';
import { Table } from '@components/ui/table';
import ProgressBox from '@components/ui/progress-box/progress-box';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Button from '@components/ui/button';
import ErrorMessage from '@components/ui/error-message';
import { siteSettings } from '@settings/site.settings';
import usePrice from '@utils/use-price';
import { formatAddress } from '@utils/format-address';
import Loader from '@components/ui/loader/loader';
import ValidationError from '@components/ui/form-validation-error';
import { Attachment } from '@ts-types/generated';
import { useOrderQuery } from '@data/order/use-order.query';
import { useUpdateOrderMutation } from '@data/order/use-order-update.mutation';
import { useOrderStatusesQuery } from '@data/order-status/use-order-statuses.query';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SelectInput from '@components/ui/select-input';
import { useIsRTL } from '@utils/locals';
import { DownloadIcon } from '@components/icons/download-icon';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePdf from '@components/order/invoice-pdf';
import { useCart } from '@contexts/quick-cart/cart.context';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { clearCheckoutAtom } from '@contexts/checkout';
import { useSettings } from '@contexts/settings.context';
import { adminOnly } from '@utils/auth-utils';
import Price from '@components/common/price';

type FormValues = {
  order_status: any;
};
export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query } = useRouter();
  const router = useRouter();
  const settings = useSettings();
  const { alignLeft, alignRight } = useIsRTL();
  const { resetCart } = useCart();
  const [, resetCheckout] = useAtom(clearCheckoutAtom);
  const { b2b, orderId } = router.query;

  useEffect(() => {
    if (orderId && !b2b) {
      router.replace({
        pathname: `/orders/${orderId}`,
        query: { b2b: 'true' },
      });
    }
  }, [orderId, b2b, router]);

  useEffect(() => {
    resetCart();
    resetCheckout();
  }, [resetCart, resetCheckout]);

  const { mutate: updateOrder, isLoading: updating } = useUpdateOrderMutation();
  const { data: orderStatusData } = useOrderStatusesQuery({});
  const {
    data,
    isLoading: loading,
    error,
  } = useOrderQuery(query.orderId as string);

  const {
    handleSubmit,
    control,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { order_status: data?.order?.status?.id ?? '' },
  });

  const ChangeStatus = ({ order_status }: FormValues) => {
    updateOrder({
      variables: {
        id: data?.order?.id as string,
        input: {
          status: order_status?.id as string,
        },
      },
    });
  };
  const { price: subtotal } = usePrice(
    data && {
      amount: data?.order?.amount!,
    }
  );
  const { price: total } = usePrice(
    data && {
      amount: data?.order?.paid_total!,
    }
  );
  const { price: discount } = usePrice(
    data && {
      amount: data?.order?.discount!,
    }
  );
  const { price: delivery_fee } = usePrice(
    data && {
      amount: data?.order?.delivery_fee!,
    }
  );
  const { price: sales_tax } = usePrice(
    data && {
      amount: data?.order?.sales_tax!,
    }
  );

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  const columns = [
    {
      dataIndex: 'image',
      key: 'image',
      width: 70,
      render: (image: Attachment) => (
        <Image
          src={image?.thumbnail ?? siteSettings.product.placeholder}
          alt="alt text"
          layout="fixed"
          width={50}
          height={50}
        />
      ),
    },
    {
      title: t('table:table-item-products'),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: string, item: any) => (
        <div>
          <span>{name}</span>
          <span className="mx-2">x</span>
          <span className="font-semibold text-heading">
            {item.pivot.order_quantity}
          </span>
        </div>
      ),
    },
    {
      title: t('table:table-item-total'),
      dataIndex: 'price',
      key: 'price',
      align: alignRight,
      render: (_: any, item: any) => (
        <Price amount={[parseFloat(item.pivot.subtotal)]} component="span" />
      ),
    },
  ];

  return (
    <Card>
      <div className="flex flex-col items-center lg:flex-row mb-10">
        <h3 className="mb-8 w-full whitespace-nowrap text-center text-2xl font-semibold text-heading lg:mb-0 lg:w-1/3 lg:text-start">
          {t('form:input-label-quote-id')} - {data?.order?.tracking_number}
        </h3>
      </div>

      <div className="mb-10">
        {data?.order ? (
          <Table
            //@ts-ignore
            columns={columns}
            emptyText={t('table:empty-table-data')}
            data={data?.order?.products!}
            rowKey="id"
            scroll={{ x: 300 }}
          />
        ) : (
          <span>{t('common:no-order-found')}</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="mb-10 w-full sm:mb-0 sm:w-1/2 sm:pe-8">
          <h3 className="mb-3 border-b border-border-200 pb-2 font-semibold text-heading">
            {t('common:billing-address')}
          </h3>

          <div className="flex flex-col items-start space-y-1 text-sm text-body">
            <span>{data?.order?.customer?.name}</span>
            {data?.order?.billing_address && (
              <span>{formatAddress(data.order.billing_address)}</span>
            )}
            {data?.order?.customer_contact && (
              <span>{data?.order?.customer_contact}</span>
            )}
          </div>
        </div>

        <div className="w-full sm:w-1/2 sm:ps-8">
          <h3 className="mb-3 border-b border-border-200 pb-2 font-semibold text-heading text-start sm:text-end">
            {t('common:shipping-address')}
          </h3>

          <div className="flex flex-col items-start space-y-1 text-sm text-body text-start sm:items-end sm:text-end">
            <span>{data?.order?.customer?.name}</span>
            {data?.order?.shipping_address && (
              <span>{formatAddress(data.order.shipping_address)}</span>
            )}
            {data?.order?.customer_contact && (
              <span>{data?.order?.customer_contact}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
OrderDetailsPage.Layout = Layout;

OrderDetailsPage.authenticate = {
  permissions: adminOnly,
};

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
