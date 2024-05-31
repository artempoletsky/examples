/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  optimizePackageImports: ['@mantine/core'],
  // output: 'standalone',
  images: {
    unoptimized: true
  },
};

export default nextConfig;
