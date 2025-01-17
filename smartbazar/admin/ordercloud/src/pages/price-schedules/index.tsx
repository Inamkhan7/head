import Card from '@components/common/card';
import Layout from '@components/layouts/admin';
// import AttributeList from '@components/attribute/attribute-list';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loader/loader';
import LinkButton from '@components/ui/link-button';
import { useAttributesQuery } from '@data/attributes/use-attributes.query';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ROUTES } from '@utils/routes';
import { SortOrder } from '@ts-types/generated';
import { useState } from 'react';
import { adminOnly } from '@utils/auth-utils';
import PriceSchedule from '@components/product/price-schedule';

export default function AttributePage() {
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  // const {
  //   data,
  //   isLoading: loading,
  //   error,
  // } = useAttributesQuery({ orderBy, sortedBy });

  // if (loading) return <Loader text={t('common:text-loading')} />;
  // if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:sidebar-nav-item-price-schedules')}
          </h1>
        </div>
        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-3/4">
          <LinkButton
            href={`${ROUTES.PRICE_SCHEDULES}/create`}
            className="h-12 w-full ms-auto md:w-auto"
          >
            + {t('form:button-label-add')}
          </LinkButton>
        </div>
      </Card>
      <div>
        <PriceSchedule/>
      </div>
      {/* <AttributeList
        attributes={data?.attributes as any}
        onOrder={setOrder}
        onSort={setColumn}
      /> */}
    </>
  );
}

AttributePage.authenticate = {
  permissions: adminOnly,
};

AttributePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});