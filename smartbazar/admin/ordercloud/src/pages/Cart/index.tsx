import Card from '@components/common/card';
import Layout from '@components/layouts/admin';
// import Search from '@components/common/search';
// import LinkButton from '@components/ui/link-button';
import { useState } from 'react';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ROUTES } from '@utils/routes';
// import { useCartsQuery } from '@data/cart/use-cart.query';

import { adminOnly } from '@utils/auth-utils';

export default function Carts() {
  // const [searchTerm, setSearchTerm] = useState('');
  // const [page, setPage] = useState(1);
  const { t } = useTranslation();

  // const {
  //   data,
  //   isLoading: loading,
  //   error,
  // } = useCartsQuery({
  //   limit: 20,
  //   page,
  //   text: searchTerm,
  //   orderBy,
  //   sortedBy,
  // });

  // if (loading) return <Loader text={t('common:text-loading')} />;
  // if (error) return <ErrorMessage message={error.message} />;
  // function handleSearch({ searchText }: { searchText: string }) {
  //   setSearchTerm(searchText);
  //   setPage(1);
  // }
  // function handlePagination(current: any) {
  //   setPage(current);
  // }
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading">
              {t('form:input-label-cart')}
            </h1>
          </div>

          {/* <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-3/4">
            <Search onSearch={handleSearch} />
            <LinkButton
              href={`${ROUTES.CART}/create`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('form:input-label-add-cart')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          </div> */}
        </div>
      </Card>

    </>
  );
}

Carts.authenticate = {
  permissions: adminOnly,
};
Carts.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
