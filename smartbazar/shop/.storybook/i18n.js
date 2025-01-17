import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    whitelist: ['en', 'de', 'ar', 'es', 'he', 'zh'],
    lng: 'en',
    fallbackLng: 'en',
    debug: true,
    defaultNS: 'common',
    ns: ['banner', 'common', 'faq', 'policy', 'terms'],
    backend: {
      loadPath: `./locales/{{lng}}/{{ns}}.json`,
    },
    react: {
      wait: true,
    },
  });

export default i18n;
