

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

};

module.exports = nextConfig;
