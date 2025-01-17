//https://github.com/fynncfchen/storybook-addon-i18next/issues/8
import React, { Suspense, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { withI18next } from 'storybook-addon-i18next';
import * as NextImage from 'next/image';
import i18n from './i18n';
import '../src/assets/css/main.css';
import 'react-toastify/dist/ReactToastify.css';
import { RTL_LANGUAGES } from '../src/lib/constants';

function getDirection(language) {
  if (!language) return 'ltr';
  return RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
}

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  previewTabs: {
    'storybook/docs/panel': { index: -1 },
  },
};

// create and export a global types object to configure the toolbar button
// docs: https://storybook.js.org/docs/react/essentials/toolbars-and-globals
export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: i18n.defaultLocale,
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: 'US', title: 'English' },
        { value: 'es', right: 'ES', title: 'Español' },
        { value: 'ar', right: 'AR', title: 'عربي' },
        { value: 'de', right: 'DE', title: 'Deutsch' },
        { value: 'he', right: 'HE', title: 'עִברִית' },
        { value: 'zh', right: 'CH', title: '中文' },
      ],
    },
  },
};

// const langToolbox = withI18next({
//   i18n,
//   languages: {
//     en: 'English',
//     de: 'Deutsch',
//     ar: 'Arabic',
//     es: 'Spanish',
//     he: 'Hebrew',
//     zh: 'Chinese',
//   },
// });

const i18nWrapper = (Story, context) => {
  React.useEffect(() => {
    i18n.changeLanguage(context.globals.locale);
  }, [context.globals.locale]);
  return (
    <Suspense fallback="Loading locales">
      <I18nextProvider i18n={i18n}>
        <div dir={getDirection(context.globals.locale)}>
          <Story />
        </div>
      </I18nextProvider>
    </Suspense>
  );
};

export const decorators = [i18nWrapper];
