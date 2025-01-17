import type { AppProps } from 'next/app';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import { appWithTranslation } from 'next-i18next';
import { SessionProvider } from 'next-auth/react';
import '@/assets/css/main.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ModalProvider } from '@/core/atoms/ui/modal/modal.context';
import ManagedModal from '@/core/atoms/ui/modal/managed-modal';
import ManagedDrawer from '@/core/atoms/ui/drawer/managed-drawer';
import DefaultSeo from '@/core/atoms/seo/default-seo';
import { SearchProvider } from '@/core/atoms/ui/search/search.context';
import PrivateRoute from '@/lib/private-route';
import { CartProvider } from '@/store/quick-cart/cart.context';
import SocialLogin from '@/core/atoms/auth/social-login';
import { NextPageWithLayout } from '@/types';
import QueryProvider from '@/framework/client/query-provider';
import { useEffect } from 'react';
import Script from 'next/script';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const growthbook = new GrowthBook();

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const authenticationRequired = Component.authenticationRequired ?? false;

  useEffect(() => {
    // Load feature definitions from API
    fetch(
      `https://cdn.growthbook.io/api/features/${process?.env?.NEXT_PUBLIC_GROWTHBOOK_KEY}`
    )
      .then((res) => res.json())
      .then((json) => {
        growthbook.setFeatures(json.features);
      });
  }, []);

  useEffect(() =>{
    <script
      dangerouslySetInnerHTML={{
        __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-MZ5R8GL8');
        `,
      }}
    /> 
},[]);

  return (
    <SessionProvider session={session}>
      <QueryProvider pageProps={pageProps}>
        <GrowthBookProvider growthbook={growthbook}>
          <SearchProvider>
            <ModalProvider>
              <CartProvider>
                <>
                  <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=GTM-MZ5R8GL8`}
                  />
                  <Script id="gtm-data-layer">
                    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                      })(window,document,'script','dataLayer','GTM-MZ5R8GL8');`}
                  </Script>
                  
                  <script
                    dangerouslySetInnerHTML={{
                      __html: `
                      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MZ5R8GL8"
                      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
                      `,
                    }}
                  />
                 
                  <DefaultSeo />
                  {authenticationRequired ? (
                    <PrivateRoute>
                      {getLayout(<Component {...pageProps} />)}
                    </PrivateRoute>
                  ) : (
                    getLayout(<Component {...pageProps} />)
                  )}
                  <ManagedModal />
                  <ManagedDrawer />
                  <ToastContainer autoClose={2000} theme="colored" />
                  <SocialLogin />
                </>
              </CartProvider>
            </ModalProvider>
          </SearchProvider>
        </GrowthBookProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
export default appWithTranslation(CustomApp);
