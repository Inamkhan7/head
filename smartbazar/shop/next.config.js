/** @type {import('next').NextConfig} */
const runtimeCaching = require('next-pwa/cache');
const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV === 'development',
  dest: 'public',
  runtimeCaching,
  maximumFileSizeToCacheInBytes: 5000000,
});
const { i18n } = require('./next-i18next.config');
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  i18n,
  images: {
    domains: [
      'cdn11.bigcommerce.com',
      'pickbazarlaravel.s3.ap-southeast-1.amazonaws.com',
      'altudoheadless-sccontent.eastus.cloudapp.azure.com',
      'lh3.googleusercontent.com',
      'localhost',
      '127.0.0.1',
      'i.pravatar.cc',
      'i.imgur.com',
      'images.contentstack.io',
      'res.cloudinary.com',
      'edge.sitecorecloud.io',
    ],
  },
  ...(process.env.FRAMEWORK_PROVIDER === 'graphql' && {
    webpack(config, options) {
      config.module.rules.push({
        test: /\.graphql$/,
        exclude: /node_modules/,
        use: [options.defaultLoaders.babel, { loader: 'graphql-let/loader' }],
      });

      config.module.rules.push({
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader',
      });

      return config;
    },
  }),
  ...(process.env.NODE_ENV === 'production' && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
  staticPageGenerationTimeout: 100000,
};

module.exports = withPWA(nextConfig);
