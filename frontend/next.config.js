

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/lams",
  env: {
    backend: "http://localhost:8000",
  },
  
};

module.exports = nextConfig;