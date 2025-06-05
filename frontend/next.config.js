

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
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'nonce-abc123';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data:;
              connect-src *;
              font-src 'self';
              object-src 'none';
              base-uri 'self';
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
