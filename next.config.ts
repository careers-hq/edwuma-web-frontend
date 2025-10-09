import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    optimizeCss: true,
    optimizePackageImports: ['@/components/ui', '@/components/job', '@/components/layout'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jobdataapi.com',
        pathname: '/media/company/logo/**',
      },
      {
        protocol: 'https',
        hostname: 'api-test.edwuma.com',
        pathname: '/**',
      },
    ],
    // Block localhost proxy URLs completely
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  // Generate sitemap automatically
  // Sitemap is generated via app/sitemap.ts
};

export default nextConfig;