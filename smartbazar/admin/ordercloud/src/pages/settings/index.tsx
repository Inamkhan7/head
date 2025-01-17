import AdminLayout from '@components/layouts/admin';
import SettingsForm from '@components/settings/settings-form';
import ErrorMessage from '@components/ui/error-message';
import LinkButton from '@components/ui/link-button';
import Loader from '@components/ui/loader/loader';
import { useSettingsQuery } from '@data/settings/use-settings.query';
import { useShippingClassesQuery } from '@data/shipping/use-shippingClasses.query';
import { useTaxesQuery } from '@data/tax/use-taxes.query';
import { adminOnly } from '@utils/auth-utils';
import { ROUTES } from '@utils/routes';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Settings() {
  const { t } = useTranslation();
  const { data: taxData, isLoading: taxLoading } = useTaxesQuery();
  const { data: ShippingData, isLoading: shippingLoading } =
    useShippingClassesQuery();

  const { data, isLoading: loading, error } = useSettingsQuery();

  if (loading || shippingLoading || taxLoading)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="flex items-center justify-between border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading ">
          {t('form:form-title-settings')}
        </h1>
        <LinkButton
          href={`${ROUTES.SETTINGS}/users`}
          className="h-12 w-full md:w-auto md:ms-6"
        >
          <span className="block md:hidden xl:block">
            {t('form:button-label-manage-admin-user')}
          </span>
          <span className="hidden md:block xl:hidden">
            {t('form:button-label-manage-admin-user')}
          </span>
        </LinkButton>
      </div>
      <SettingsForm
        settings={data?.options}
        taxClasses={taxData?.taxes}
        shippingClasses={ShippingData?.shippingClasses}
      />
    </>
  );
}
Settings.authenticate = {
  permissions: adminOnly,
};
Settings.Layout = AdminLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
