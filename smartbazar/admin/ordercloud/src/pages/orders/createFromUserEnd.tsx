import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import Search from "@components/common/search";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { adminOnly, allowedRoles } from "@utils/auth-utils";
import cn from "classnames";
import ProductCard from "@components/product/card";
import Cart from "@components/cart/cart";
import { useUI } from "@contexts/ui.context";
import DrawerWrapper from "@components/ui/drawer-wrapper";
import Drawer from "@components/ui/drawer";
import CartCounterButton from "@components/cart/cart-counter-button";
import { useRouter } from "next/router";
import { useProductListWithImpersonation } from "@data/product/product-impersonation.query";
import { normalizeProductData } from "./normalizeProductData";

export default function createFromUserEnd() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const { displayCartSidebar, closeCartSidebar } = useUI();
  const router = useRouter();
  console.log(router.asPath, 'router')

  const { data, isLoading: loading, error } = useProductListWithImpersonation();

  console.log(data,'data')

  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error?.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  return (
    <> <Card className="flex flex-col mb-8">
    <div className="w-full flex flex-col md:flex-row items-center">
      <div className="md:w-1/4 mb-4 md:mb-0">
        <h2 className="text-lg font-semibold text-heading">
           Purchasing Order
        </h2>
      </div>
      <div className="w-full md:w-3/4 flex flex-col items-center ms-auto">
        <Search onSearch={handleSearch} />
      </div>
    </div>

    <div
      className={cn("w-full flex transition")}
    >
    </div>
  </Card>

  <div className="flex space-x-5">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-6 gap-4">
        {
            data != undefined &&
              data?.Items?.map((product: any, index: number) => {
                const productWithId = {
                  ...product,
                  id: product.id || product.slug 
                };
                const normalizedProduct = normalizeProductData(productWithId);
                return (
                  <ProductCard key={index} item={normalizedProduct} />
                );
              })
            }
        </div>
      </div>

      <CartCounterButton />
      <Drawer
        open={displayCartSidebar}
        onClose={closeCartSidebar}
        variant="right"
      >
        <DrawerWrapper hideTopBar={true}>
          <Cart />
        </DrawerWrapper>
      </Drawer>
  </>
  )
}
createFromUserEnd.authenticate = {
  permissions: allowedRoles,
};
createFromUserEnd.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});