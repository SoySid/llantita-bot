/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sportingarg.vtexassets.com',
      },
      {
        protocol: 'https',
        hostname: '*.vtexassets.com',
      },
    ],
  },
};

export default nextConfig;
