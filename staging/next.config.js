/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/lams",
  env: {
    backend: "https://aadrikainfomedia.com/auth",
  },
};

module.exports = nextConfig;