/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: '/Users/macbook/guestbook-app',
  webpack: (config, { isServer }) => {
    // Fix for async-storage issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@react-native-async-storage/async-storage': false,
      }
    }
    return config
  },
};

export default nextConfig;
