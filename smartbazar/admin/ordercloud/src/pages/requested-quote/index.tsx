import React from 'react'; // Add this line if it's missing
import { adminOnly } from '@utils/auth-utils';
import Layout from "@components/layouts/admin";
import { useLastRequestedOrderQuery, useProductListWithImpersonation } from '@data/product/product-impersonation.query';
import Loader from '@components/ui/loader/loader';
import ErrorMessage from '@components/ui/error-message';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function RequestedQuote() {
  const { t } = useTranslation();
  const { data:userData } = useProductListWithImpersonation();

  console.log(userData,'data')
  const { data, isLoading: loading, error } = useLastRequestedOrderQuery();
  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error?.message} />;
  console.log(data)
  return (
    <div>
      {/* {data} */}
    </div>
  );
}

RequestedQuote.authenticate = {
  permissions: adminOnly,
};
RequestedQuote.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
