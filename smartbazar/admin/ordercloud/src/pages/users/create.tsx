import Layout from "@components/layouts/admin";
import CustomerCreateForm from "@components/user/user-form";
import { adminOnly } from "@utils/auth-utils";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function CreateCustomerPage() {
  const { t } = useTranslation();
  return (
    <>
      CREATE
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t("form:form-title-create-customer")}
        </h1>
      </div>
      <CustomerCreateForm />
    </>
  );
}
CreateCustomerPage.Layout = Layout;

CreateCustomerPage.authenticate = {
  permissions: adminOnly,
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "form", "common"])),
  },
});
