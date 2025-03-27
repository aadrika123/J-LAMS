/* eslint-disable react/react-in-jsx-scope */
'use client'; // Marking the component as client-side

import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import StoreProvider from "./storeProvider";
import { usePathname } from "next/navigation"; // Correct import for useRouter
// import ServiceRestrictionLayout from "@/components/JuidcoAssets/servicerestriction";
import axios from "axios";
import { useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("rendering every time");

  const pathname = usePathname(); // Use Next.js's usePathname for routing
  // const router = useRouter(); // Use Next.js's useRouter for navigation

  console.log("pathname", pathname);

  const dataa = async () => {
    try {
      // Ensure this code runs only on the client side
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("accesstoken");

        if (!accessToken) {
          throw new Error("Access token not found in localStorage");
        }

        const requestBody = {
          path: pathname,
          moduleId: 21,
        };

        const res = await axios.post(

          // `https://aadrikainfomedia.com/auth/api/menu/by-module`,
          // `https://jharkhandegovernance.com/auth/api/menu/by-module`,
          `https://egov.rsccl.in/auth/api/menu/by-module`,


          requestBody, // Send the request body directly
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("API Response:", res.data?.status);

        // if (res.data?.status) {
        //   router.push('/servicerestriction'); // Navigate to '/servicerestriction'
        // }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    dataa(); // Call the function inside useEffect
  }, [pathname]); // Add pathname as a dependency

  // Example: Conditional rendering based on the route
  // if (pathname === "/loginsssss") {
  //   return (
  //     <html lang="en">
  //       <body className={inter.className}>
  //         <ServiceRestrictionLayout />
  //       </body>
  //     </html>
  //   );
  // }

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <StoreProvider>
      <ReactQueryClientProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </ReactQueryClientProvider>
    </StoreProvider>
  );
}