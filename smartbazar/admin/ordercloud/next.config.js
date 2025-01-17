/** @type {import('next').NextConfig} */
const runtimeCaching = require('next-pwa/cache');
const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV === 'development',
  dest: 'public',
  runtimeCaching,
});
const { i18n } = require('./next-i18next.config');

const nextConfig = withPWA({
  experimental: {
    esmExternals: false,
  },
  i18n,
  images: {
    domains: [
      'via.placeholder.com',
      'res.cloudinary.com',
      's3.amazonaws.com',
      '18.141.64.26',
      '127.0.0.1',
      'localhost',
      'picsum.photos',
      'pickbazar-sail.test',
      'pickbazarlaravel.s3.ap-southeast-1.amazonaws.com',
      'lh3.googleusercontent.com',
      '3c4129514e729722ab40-bce9d7e93a4dbc7b86f31da364428ab7.ssl.cf3.rackcdn.com',
      'cdn.royalcanin-weshare-online.io',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});

module.exports = nextConfig;
