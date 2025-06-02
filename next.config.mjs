/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.barca.group",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  productionBrowserSourceMaps: true,
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization.minimize = false;
    }
    return config;
  },
};

export default nextConfig;
