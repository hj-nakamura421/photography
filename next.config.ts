import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: '/photography/',
  images: { unoptimized: true },
};

export default nextConfig;
