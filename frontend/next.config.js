

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
    // backend: "https://aadrikainfomedia.com/auth",
    // backend: "https://egov.rsccl.in/auth"
    // backend: "http://172.30.48.1:2000",
  },

  // ❌ REMOVE static CSP headers
  // ✅ CSP should now be handled in middleware.ts using dynamic nonce
  async headers() {
    return [
      {
        source: "/(.*)", // Applies to all routes
        headers: [
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
