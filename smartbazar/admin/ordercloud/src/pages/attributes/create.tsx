import Layout from "@components/layouts/admin";
import CreateOrUpdateAttributeForm from "@components/attribute/attribute-form";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { adminOnly } from "@utils/auth-utils";

export default function UpdateAttributePage() {
  const { t } = useTranslation();

  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {t("form:form-title-create-attribute")}
        </h1>
      </div>
      <CreateOrUpdateAttributeForm />
    </>
  );
}

UpdateAttributePage.Layout = Layout;

UpdateAttributePage.authenticate = {
  permissions: adminOnly,
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
