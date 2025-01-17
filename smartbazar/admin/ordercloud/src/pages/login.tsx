import LoginForm from '@components/auth/login-form';
import Logo from '@components/ui/logo';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { ROUTES } from '@utils/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getAuthCredentials, isAuthenticated } from '@utils/auth-utils';
import { useRouter } from 'next/router';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});

export default function LoginPage() {
  const router = useRouter();
  const { token, permissions, internalToken } = getAuthCredentials();
  if (isAuthenticated({ token, permissions, internalToken })) {
    router.replace(ROUTES.DASHBOARD);
  }
  const { t } = useTranslation('common');
  return (
    <div className="flex h-screen items-center justify-center bg-light sm:bg-gray-100">
      <div className="m-auto w-full max-w-md rounded bg-light p-5 sm:p-8 sm:shadow">
        <div className="mb-2 flex justify-center">
          <Logo />
        </div>
        <h3 className="mb-6 mt-4 text-center text-base italic text-body">
          {t('admin-login-title')}
        </h3>
        <LoginForm />
      </div>
    </div>
  );
}
