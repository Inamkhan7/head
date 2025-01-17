import Layout from "@components/layouts/admin";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { adminOnly } from "@utils/auth-utils";
import CustomerCreateForm from "@components/user/user-form";
import { useAdminUserQuery } from "@data/user/use-user-query";
import router from "next/router";

export default function UpdateCustomerPage() {
  const userID = router.query.userId?.toString();
  const { t } = useTranslation();
  const { data, isLoading: loading, error } = useAdminUserQuery(userID);

  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error?.message as string} />;
  return (
    <>
      EDIT
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t("form:form-title-update-customer")}
        </h1>
      </div>
      <CustomerCreateForm initialValues={data} />
    </>
  );
}
UpdateCustomerPage.Layout = Layout;

UpdateCustomerPage.authenticate = {
  permissions: adminOnly,
};

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "form"])),
  },
});
