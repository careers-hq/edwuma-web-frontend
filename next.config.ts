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
  },
  images: {
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
};

export default nextConfig;