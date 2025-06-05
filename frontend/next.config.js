

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   basePath: "/lams",
//   env: {
//     // backend: "http://localhost:8000",
//     backend: "https://jharkhandegovernance.com/auth",
//     // backend: "https://aadrikainfomedia.com/auth",
//     // backend: "https://egov.rsccl.in/auth" 

//         // backend: "http://172.30.48.1:2000",
//   },

// };

// module.exports = nextConfig;




/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/lams",
  env: {
// backend: "http://localhost:8000",
    backend: "https://jharkhandegovernance.com/auth",
//     // backend: "https://aadrikainfomedia.com/auth",
//     // backend: "https://egov.rsccl.in/auth" 

//         // backend: "http://172.30.48.1:2000",
  },

  async headers() {
    return [
      {
        source: "/(.*)", // Applies to all routes
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              // "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'none'; base-uri 'self';",
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
