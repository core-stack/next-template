/** @type {import('next').NextConfig} */
const nextConfig = {
  // if you want to use standalone output, uncomment the following line
  // transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  experimental: {
    nodeMiddleware: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals.filter(
        (external) => !external.includes('@aws-sdk/client-s3')
      );
    }
    return config;
  },
};

export default nextConfig;
