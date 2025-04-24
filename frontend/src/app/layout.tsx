"use client"; // Mark this file as a client component

<<<<<<< HEAD
=======
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import StoreProvider from "./storeProvider";
import { usePathname } from "next/navigation"; // Correct import for useRouter
// import ServiceRestrictionLayout from "@/components/JuidcoAssets/servicerestriction";
>>>>>>> 820c62c53a384a6162701fd6d6c04ec4f4f12ff1
import axios from "axios";
import { useEffect } from "react";
import { usePathname } from "next/navigation"; // Get the current route

const useModulePermission = () => {
  const pathname = usePathname(); // Get the current pathname
  const accessToken = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  const fetchMenuList = async () => {
    if (!accessToken) return; // Avoid fetching if token is not available

<<<<<<< HEAD
=======
  const pathname = usePathname(); // Use Next.js's usePathname for routing
  // const router = useRouter(); // Use Next.js's useRouter for navigation

  console.log("pathname", pathname);

  const dataa = async () => {
>>>>>>> 820c62c53a384a6162701fd6d6c04ec4f4f12ff1
    try {
      const requestBody = {
        path: pathname,
        moduleId: 21,
      };

      const res = await axios.post(
        `${process.env.backend}/api/get/services-by-module`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

<<<<<<< HEAD
      if (res?.data?.status) {
        const permissions = res?.data?.data?.permission || [];
        if (permissions.length === 0) {
          console.warn("You are not authorized");
          localStorage.clear();
          window.location.href =
            "/lams?msg=You are not authorized to access this page. Please contact your administrator.";
        }
      } else {
        console.error("Permission check failed: ", res?.data?.message);
=======
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
>>>>>>> 820c62c53a384a6162701fd6d6c04ec4f4f12ff1
      }
    } catch (error) {
      console.error("API request failed:", error);
    }
  };

  useEffect(() => {
    fetchMenuList();
  }, [accessToken]); // Run effect when token changes

  return null;
};

export default useModulePermission;
