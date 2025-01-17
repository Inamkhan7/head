import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import Search from "@components/common/search";
import OrderList from "@components/order/order-list";
import { useEffect, useState } from "react";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useOrdersQuery } from "@data/order/use-orders.query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SortOrder } from "@ts-types/generated";
import { adminOnly } from "@utils/auth-utils";
import { useRouter } from 'next/router';
import LinkButton from "@components/ui/link-button";
import { ROUTES } from "@utils/routes";
import Cookies from "js-cookie";

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [lastProduct , setLastProduct] = useState();
  const router = useRouter();
  const { b2b } = router.query;
  const isB2B = b2b === 'true';
  useEffect(() =>{
    if(router.asPath == '/orders'){
      if (!router.query.b2b) {
        router.push({
          pathname: '/orders',
          query: { b2b: 'true' },
        });
      }
    }
  },[router]);


  const {
    data,
    isLoading: loading,
    error,
  } = useOrdersQuery({
    limit: 20,
    page,
    text: searchTerm,
  });


  useEffect(() => {
    const existingOrderId = Cookies.get('OrderId');
    if (!existingOrderId && data?.orders?.data?.[0]?.id) {
      Cookies.set('OrderId', data.orders.data[0].id);
      console.log('OrderId cookie set:', data.orders.data[0].id);
    } else if (existingOrderId) {
      console.log('OrderId already exists. No action taken.');
    }
  }, [data]);
 
  // setLastProduct(data[0]);
  // console.log(lastProduct , 'lastProduct');
  if (loading) return <Loader text={t("common:text-loading")} />;
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
    {isB2B ? (<>
     <Card className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-lg font-semibold text-heading">
            {t("form:input-label-orders")}
          </h1>
        </div>

        <div className="w-full md:w-1/2 flex flex-col md:flex-row items-center ms-auto">
          <Search onSearch={handleSearch} />
        </div>
        <LinkButton
            href={`${ROUTES.ORDERS}/create`}
            className="h-12 w-full md:w-auto md:ms-6"
          >
            <span className="block md:hidden xl:block">
              + Add Order
              {/* {t('form:button-label-add-order')} */}
            </span>
            <span className="hidden md:block xl:hidden">
              + {t('form:button-label-add')}
            </span>
          </LinkButton>

          <div>
          <LinkButton
            href={`${ROUTES.ORDERS}/repeatLastProduct`}
            className="h-12 w-full md:w-auto md:ms-6"
          >
            <span className="block md:hidden xl:block">
              + Repeat Last Order
              {/* {t('form:button-label-add-order')} */}
            </span>
            <span className="hidden md:block xl:hidden">
              + {t('form:button-label-add')}
            </span>
          </LinkButton>
          </div>
      </Card>

      <OrderList
        orders={data?.orders}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
      </>):(
        <div>btob is </div>
      )}
     
    </>
  );
}

Orders.authenticate = {
  permissions: adminOnly,
};
Orders.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
