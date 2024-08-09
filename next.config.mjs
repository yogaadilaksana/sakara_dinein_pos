
const isProd = process.env.NODE_ENV === 'production';

export default {
  // Use the CDN in production and localhost for development.
  assetPrefix: isProd ? 'https://cdn.mydomain.com' : undefined,

  // Optionally configure other settings
  reactStrictMode: true,  // Enable React's strict mode
  images: {
    domains: ['sakaracoffe.shop'],  // Allow images from the CDN
  },
};
