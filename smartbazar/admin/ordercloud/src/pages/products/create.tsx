import Layout from "@components/layouts/admin";
import CreateOrUpdateProductForm from "@components/product/product-form";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { adminOnly } from "@utils/auth-utils";

export default function CreateProductPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">Create Product</h1>
      </div>
      <CreateOrUpdateProductForm />
    </>
  );
}
CreateProductPage.Layout = Layout;

CreateProductPage.authenticate = {
  permissions: adminOnly,
};

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "form"])),
  },
});
