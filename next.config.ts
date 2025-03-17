import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Add these configurations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable compression
  
  // Add image optimization settings if not already present
  images: {
    domains: ['aiphotoshop.in'], // Updated with your domain
    formats: ['image/avif', 'image/webp'],
  },
  
  // Add i18n configuration if your site is multilingual
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};

export default nextConfig;
