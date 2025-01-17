import Layout from '@components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { adminOnly } from '@utils/auth-utils';
import OrganizationForm from '@components/organization/organization-form';

export default function CreateCustomerPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:button-label-create-organization')}
        </h1>
      </div>
      <OrganizationForm />
    </>
  );
}

CreateCustomerPage.Layout = Layout;

CreateCustomerPage.authenticate = {
  permissions: adminOnly,
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
