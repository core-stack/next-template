/** @type {import('next').NextConfig} */
const nextConfig = {
  // if you want to use standalone output, uncomment the following line
  experimental: {
    nodeMiddleware: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
