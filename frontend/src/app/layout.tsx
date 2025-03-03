"use client"; // Mark this file as a client component

import axios from "axios";
import { useEffect } from "react";
import { usePathname } from "next/navigation"; // Get the current route

const useModulePermission = () => {
  const pathname = usePathname(); // Get the current pathname
  const accessToken = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  const fetchMenuList = async () => {
    if (!accessToken) return; // Avoid fetching if token is not available

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
