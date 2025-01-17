import Card from '@components/common/card';
import Layout from '@components/layouts/admin';
import Search from '@components/common/search';
import LinkButton from '@components/ui/link-button';
import { useState } from 'react';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loader/loader';
import { SortOrder } from '@ts-types/generated';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ROUTES } from '@utils/routes';
import { useBuyersQuery } from '@data/buyers/use-buyers.query';
import { adminOnly } from '@utils/auth-utils';
import OrganizationList from '@components/organization/organization-list';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const {
    data,
    isLoading: loading,
    error,
  } = useBuyersQuery({
    limit: 20,
    page,
    text: searchTerm,
    orderBy,
    sortedBy,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }
  function handlePagination(current: any) {
    setPage(current);
  }
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading">
              {t('form:input-label-organization')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-3/4">
            <Search onSearch={handleSearch} />
            <LinkButton
              href={`${ROUTES.ORGANIZATION}/create`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('form:input-label-add-organization')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          </div>
        </div>
      </Card>
      <OrganizationList
        buyers={data?.buyers}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Customers.authenticate = {
  permissions: adminOnly,
};
Customers.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
