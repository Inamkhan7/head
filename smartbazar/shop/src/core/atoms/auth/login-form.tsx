import { signIn } from 'next-auth/react';
import Logo from '@/core/atoms/ui/logo';
import Alert from '@/core/atoms/ui/alert';
import Input from '@/core/atoms/ui/forms/input';
import PasswordInput from '@/core/atoms/ui/forms/password-input';
import Button from '@/core/atoms/ui/button';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import { GoogleIcon } from '@/core/atoms/icons/google';
import { useModalAction } from '@/core/atoms/ui/modal/modal.context';
import { MobileIcon } from '@/core/atoms/icons/mobile-icon';
import { Form } from '@/core/atoms/ui/forms/form';
import { useLogin } from '@/framework/user';
import type { LoginUserInput } from '@/types';
import { AnonymousIcon } from '@/core/atoms/icons/anonymous-icon';
import { useRouter } from 'next/router';
import { ROUTES } from '@/lib/routes';
import { ComponentPropsCollection, DictionaryPhrases, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import { useEffect } from 'react';

export type SitecorePageProps = {
  locale: string;
  layoutData: LayoutServiceData | null;
  dictionary: DictionaryPhrases;
  componentProps: ComponentPropsCollection;
  notFound: boolean;
};

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    location: Location;
  }
}

const handlePageOnload = (
  
  dl_pageItem: string | number | undefined,
  
  dl_pageSection: string | number | undefined,

  dl_pageType: string | number | undefined,

  dl_visitor: string | number | undefined,

) => {

  const eventpageView: DataLayerEvent = {

    event: 'pageView',

    loginStatus: 'out',

    pageArea: 'pub',

    pageItem: dl_pageItem,

    pageSection: dl_pageSection,

    pageType: dl_pageType,

    visitor: dl_visitor,

  };

  window.dataLayer.push(eventpageView);

};

interface DataLayerClickEvent {
  event: string;
  loginStatus: string;
  pageArea: string;
  pageItem: string;
  pageSection: string;
  pageType: string;
  clickType: string;
  memberId: string;
  visitor: string;
}

const handlePageOnClick = () => {
  const eventData: DataLayerClickEvent = {
    event: "click",
    loginStatus: "out",
    pageArea: "pub",
    pageItem: "Login Page",
    pageSection: "Credentials",
    pageType: "Login",
    clickType: "login",
    memberId: "XXX",
    visitor: "AAA"
  };
  window.dataLayer.push(eventData);
};

const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('error-email-format')
    .required('error-email-required'),
  password: yup.string().required('error-password-required'),
});
function LoginForm() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { openModal } = useModalAction();
  const isCheckout = router.pathname.includes('checkout');
  const { mutate: login, isLoading, serverError, setServerError } = useLogin();

  useEffect(() => {
    handlePageOnload(
      "Login Page","Credentials","Login","XYZ"
    );
  },[]);

  function onSubmit({ email, password }: LoginUserInput) {
    login({
      email,
      password,
    });
  }

  return (
    <>
      <Alert
        variant="error"
        message={serverError && t(serverError)}
        className="mb-6"
        closeable={true}
        onClose={() => setServerError(null)}
      />
      <Form<LoginUserInput>
        onSubmit={onSubmit}
        validationSchema={loginFormSchema}
      >
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label={t('text-email')}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-5"
              error={t(errors.email?.message!)}
            />
            <PasswordInput
              label={t('text-password')}
              {...register('password')}
              error={t(errors.password?.message!)}
              variant="outline"
              className="mb-5"
              forgotPageRouteOnClick={() => openModal('FORGOT_VIEW')}
            />
            <div className="mt-8">
              <Button
                onClick={handlePageOnClick}
                className="h-11 w-full sm:h-12"
                loading={isLoading}
                disabled={isLoading}
              >
                {t('text-login')}
              </Button>
            </div>
          </>
        )}
      </Form>
      {/* //===============// */}
      <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
        <span className="absolute -top-2.5 bg-light px-2 ltr:left-2/4 ltr:-ml-4 rtl:right-2/4 rtl:-mr-4">
          {t('text-or')}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-4">
        <Button
          className="!bg-social-google !text-light hover:!bg-social-google-hover"
          disabled={isLoading}
          onClick={() => {
            signIn('google');
          }}
        >
          <GoogleIcon className="h-4 w-4 ltr:mr-3 rtl:ml-3" />
          {t('text-login-google')}
        </Button>

        <Button
          className="h-11 w-full !bg-gray-500 !text-light hover:!bg-gray-600 sm:h-12"
          disabled={isLoading}
          onClick={() => openModal('OTP_LOGIN')}
        >
          <MobileIcon className="h-5 text-light ltr:mr-2 rtl:ml-2" />
          {t('text-login-mobile')}
        </Button>

        {isCheckout && (
          <Button
            className="h-11 w-full !bg-pink-700 !text-light hover:!bg-pink-800 sm:h-12"
            disabled={isLoading}
            onClick={() => router.push(`${ROUTES.CHECKOUT}/guest`)}
          >
            <AnonymousIcon className="h-6 text-light ltr:mr-2 rtl:ml-2" />
            {t('text-guest-checkout')}
          </Button>
        )}
      </div>
      <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
      </div>
      <div className="text-center text-sm text-body sm:text-base">
        {t('text-no-account')}{' '}
        <button
          onClick={() => openModal('REGISTER')}
          className="font-semibold text-accent underline transition-colors duration-200 hover:text-accent-hover hover:no-underline focus:text-accent-hover focus:no-underline focus:outline-none ltr:ml-1 rtl:mr-1"
        >
          {t('text-register')}
        </button>
      </div>
    </>
  );
}

export default function LoginView() {
  const { t } = useTranslation('common');
  return (
    <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light py-6 px-5 sm:p-8 md:h-auto md:min-h-0 md:max-w-[480px] md:rounded-xl">
      <div className="flex justify-center">
        <Logo />
      </div>
      <p className="mt-4 mb-8 text-center text-sm text-body sm:mt-5 sm:mb-10 md:text-base">
        {t('login-helper')}
      </p>
      <LoginForm />
    </div>
  );
}

interface DataLayerEvent {
  event: string;

  loginStatus: string;

  pageArea: string | number | undefined;

  pageItem: string | number | undefined;

  pageSection: string | number | undefined;

  pageType: string | number | undefined;

  visitor: string | number | undefined;  
}
