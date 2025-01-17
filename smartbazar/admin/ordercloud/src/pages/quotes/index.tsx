import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import Search from "@components/common/search";
import QuoteList from "@components/quotes/quotes-list";
import { useEffect, useState } from "react";
import LinkButton from "@components/ui/link-button";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useOrdersQuery, useOrdersQuotesQuery } from "@data/order/use-orders.query";
import { useimpersonationQuoteQuery } from "@data/product/product-impersonation.query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SortOrder } from "@ts-types/generated";
import { adminOnly } from "@utils/auth-utils";
import { useRouter } from "next/router";
import { ROUTES } from '@utils/routes';


export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const router = useRouter();
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { b2b } = router.query;
  const isB2B = b2b === 'true';
  useEffect(() =>{
    if(router.asPath == '/quotes'){
      if (!router.query.b2b) {
        router.push({
          pathname: '/quotes',
          query: { b2b: 'true' },
        });
      }
    }
  },[router]);

  const {
    data,
    isLoading: loading,
    error,
  } = useOrdersQuotesQuery();

  console.log(data,"test5 data")
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
    {isB2B ? (
<>        <Card className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-lg font-semibold text-heading">
            {t("Quotes")}
           
          </h1>
        </div>

        <div className="w-full md:w-1/2 flex flex-col md:flex-row items-center ms-auto">
          <Search onSearch={handleSearch} />
          <LinkButton
              href={`${ROUTES.QUOTES}/create`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('Add-Quotes')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
        </div>
      </Card>
    

     <QuoteList
      //  orders={data}
      orders={data?.orders}
       onPagination={handlePagination}
       onOrder={setOrder}
       onSort={setColumn}
     /></>
    ):(
      <p>b2b is disable</p>
    )
    }
     
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
