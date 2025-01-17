import Card from '@components/common/card';
import Layout from '@components/layouts/admin';
import Search from '@components/common/search';
import ProductList from '@components/product/product-list';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loader/loader';
// import Select from '@components/ui/select/select';
import { SortOrder } from '@ts-types/generated';
import { useEffect, useState } from 'react';
import { useProductsQuery } from '@data/product/products.query';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CategoryTypeFilter from '@components/product/category-type-filter';
import cn from 'classnames';
import { ArrowDown } from '@components/icons/arrow-down';
import { ArrowUp } from '@components/icons/arrow-up';
import { adminOnly } from '@utils/auth-utils';
import LinkButton from '@components/ui/link-button';
import { ROUTES } from '@utils/routes';
import { useTypesQuery } from '@data/type/use-types.query';
import { useBuyersQuery } from '@data/buyers/use-buyers.query';
import { useLocalStorage } from '@utils/use-local-storage';

const PRODUCT_FILTER = 'productFilter';
type Filter = {
  catalog?: string;
  category?: string;
};

export default function ProductsPage() {
  const { data: typesData } = useTypesQuery();
  const { data: buyersData } = useBuyersQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [buyer, setBuyer] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [visible, setVisible] = useState(false);
  const [filter, saveFilter] = useLocalStorage<Filter>(PRODUCT_FILTER, {});

  useEffect(() => {
    if (type === '' && (filter?.catalog || typesData?.types.length)) {
      setType(filter?.catalog || (typesData?.types[0]?.slug as string));
    }
  }, [type, typesData]);

  useEffect(() => {
    if (buyer === '' && buyersData?.buyers?.data?.length) {
      setBuyer(buyersData?.buyers?.data?.[0]?.id as string);
    }
  }, [buyersData]);

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const {
    data,
    isLoading: loading,
    error,
  } = useProductsQuery({
    limit: 20,
    page,
    type,
    category,
    text: searchTerm,
    orderBy,
    sortedBy,
    buyer,
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
  function handleCategoryFilter({ slug }: { slug: string }) {
    setPage(1);
    setCategory(slug);
    saveFilter({ catalog: filter?.catalog, category: slug });
  }
  function handleTypeFilter({ slug }: { slug: string }) {
    setType(slug);
    setPage(1);
    saveFilter({ catalog: slug, category: filter?.category });
  }

  function handleBuyerFilter({ id }: { id: string }) {
    setBuyer(id);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-lg font-semibold text-heading">
              {t('form:input-label-products')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center ms-auto md:w-3/4">
            <Search onSearch={handleSearch} />
          </div>

          {/* <div className="flex flex-shrink-0 md:w-auto md:ms-6">
            <Select
              options={buyersData?.buyers?.data}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              placeholder={t('common:filter-by-customer')}
              onChange={handleBuyerFilter}
              defaultValue={buyersData?.buyers?.data?.[0]}
            />
          </div> */}

          <LinkButton
            href={`${ROUTES.PRODUCTS}/create`}
            className="h-12 w-full md:w-auto md:ms-6"
          >
            <span className="block md:hidden xl:block">
              + {t('form:button-label-add-product')}
            </span>
            <span className="hidden md:block xl:hidden">
              + {t('form:button-label-add')}
            </span>
          </LinkButton>

          <button
            className="relative mt-5 inline-flex items-center text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {type && (
              <span className="absolute top-1 right-4 inline-block h-2 w-2 translate-x-1/2 -translate-y-1/2 transform rounded-full bg-red-600" />
            )}
            {t('common:text-filter')}{' '}
            {visible ? (
              <ArrowUp className="ms-2" />
            ) : (
              <ArrowDown className="ms-2" />
            )}
          </button>
        </div>

        <div
          className={cn('flex w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <CategoryTypeFilter
              className="w-full"
              onCategoryFilter={handleCategoryFilter}
              onBuyerFilter={handleBuyerFilter}
              onTypeFilter={handleTypeFilter}
            />
          </div>
        </div>
      </Card>
      <ProductList
        products={data?.products}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
ProductsPage.authenticate = {
  permissions: adminOnly,
};

ProductsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
