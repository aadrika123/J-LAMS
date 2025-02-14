'use client'; // Mark this file as a client component

import axios from "axios";
import { useEffect } from "react";
// import { ASSETS } from "../../utils/api/urls"; // Correct import of ASSETS

const useModulePermission = () => {
  // Get the URL for api_getFreeMenuList from the ASSETS object
  // const api_getFreeMenuList = ASSETS.LIST.get;

  const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  const fetchMenuList = () => {
    if (!token) return; // Avoid fetching if token is not available

    let requestBody = {
      moduleId: 18,
    };

    axios
      .post(
        `${process.env.backend}/api/menu/by-module`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      )
      .then(function (response) {
        if (response.data.status === true) {
          if (response?.data?.data?.permission?.length === 0) {
            console.log("You are not authorized");
            window.localStorage.clear();
            window.location.href =
              "/lams?msg=You are not authorized to access this page. Please contact your administrator for more information.";
          }
        } else {
          console.log("Permission check failed...");
        }
      })
      .catch(function (error) {
        console.log("Login error:", error);
      });
  };

  useEffect(() => {
    if (token) {
      fetchMenuList();
    }
  }, [token]);

  return null;
};

export default useModulePermission;
