import Layout from "@components/layouts/admin";
import UserGroupCreateForm from "@components/userGroup/userGroup-form";
import { adminOnly } from "@utils/auth-utils";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function CreateUserGroups() {
  const { t } = useTranslation();
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {t("Create UserGroup")}
        </h1>
      </div>
      <UserGroupCreateForm/>
    </>
  );
}
CreateUserGroups.Layout = Layout;

CreateUserGroups.authenticate = {
  permissions: adminOnly,
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "form", "common"])),
  },
});