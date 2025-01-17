const path = require('path');

module.exports = {
  i18n: {
    locales: ['en'], // ['en', 'de', 'es', 'ar', 'he', 'zh'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  react: { useSuspense: false },
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
