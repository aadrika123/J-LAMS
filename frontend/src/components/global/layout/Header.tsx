"use client";
import React, { useEffect, useState } from "react";
import { SubHeading } from "@/components/Helpers/Heading";
import Cookies from "js-cookie";
import { ASSETS } from "@/utils/api/urls";
import NotificationSidebar from '../../NotificationSidebar'

import axios from "@/lib/axiosConfig";
// import { calcLength } from "framer-motion";

interface UserDetails {
  user_type: string;
  // Add other properties here if necessary
}

interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
  className: string;
}

const Header: React.FC<SideBarProps> = (props) => {


  const [ulbId, setUlbId] = useState<string>("");
  const [ulbName, setUlbName] = useState<string>("");
  const [userStorage, setUserStorage] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user_det = localStorage.getItem("user_details");
      if (user_det) {
        const ulb_id = JSON.parse(user_det as string)?.ulb_id;
        setUlbId(ulb_id);
      }
    }
  }, [ulbId]);
  // console.log("to prevent lintin error", userStorage);

  useEffect(() => {
    const fetchData = async (ulbId: any) => {
      try {
        const res = await axios({
          url: `${ASSETS.LIST.getAll}?id=${ulbId}`,
          method: 'GET',
        });
        const ulbName = res.data?.data?.data[0]?.ulb_name || 'not found';
        setUlbName(ulbName);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (ulbId) {
      fetchData(ulbId);
    }
  }, [ulbId]);

  function logout() {
    const confirm = window.confirm("Are you sure want to logout?");

    if (confirm) {
      (async () => {
        try {
          Cookies.remove("accesstoken");
          Cookies.remove("user_details");
          Cookies.remove("emp_id");
          Cookies.remove("loginData");
          // window.location.reload();
          window.location.replace("/lams/auth/login");

        } catch (error) {
          console.log(error);
          // window.location.reload();
          window.location.replace("/lams/auth/login");

        }
      })();
    }
  }

  useEffect(() => {
    const userdata = localStorage.getItem('user_details');

    if (userdata) {
      const parsedData: UserDetails = JSON.parse(userdata); // Parse the data into the UserDetails type
      setUserStorage(parsedData.user_type);
    } else {
      console.log('No user data found');
    }
  }, []);


  return (
    <div {...props}>
      {/* Header Section */}
      <div className="flex items-center justify-center gap-3 mx-20">
        <div className="text-center">
          <h1 className="text-[2rem] text-primary font-bold">UD&HD</h1>
          <h4 className="text-[1rem] text-blue-600 font-bold">{ulbName}</h4>
        </div>
      </div>
  
      {/* Main Content Section */}
      <div className="flex items-center justify-center gap-2">
        {/* Subheading */}
        <SubHeading className="mr-5">
          Land and Asset Management System
        </SubHeading>
  
        {/* Logout Button */}
        <span className="w-9 mt-2">
          <button onClick={logout}>
            <svg
              width="35"
              height="34"
              viewBox="0 0 35 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <rect
                  x="2"
                  y="0.375"
                  width="31"
                  height="30"
                  rx="9"
                  fill="#4338CA"
                  shapeRendering="crispEdges"
                />
                <path
                  d="M11.59 19.5274H12.7571C12.8367 19.5274 12.9114 19.5622 12.9613 19.6237C13.0775 19.7648 13.202 19.9009 13.3331 20.0304C13.8695 20.5673 14.5049 20.9952 15.2041 21.2905C15.9285 21.5964 16.7071 21.7534 17.4935 21.752C18.2887 21.752 19.059 21.5959 19.7828 21.2905C20.482 20.9952 21.1174 20.5673 21.6538 20.0304C22.1912 19.4953 22.6197 18.861 22.9155 18.1627C23.2227 17.4389 23.3771 16.6702 23.3771 15.875C23.3771 15.0798 23.221 14.3112 22.9155 13.5873C22.62 12.8884 22.195 12.2592 21.6538 11.7197C21.1126 11.1801 20.4834 10.7551 19.7828 10.4596C19.059 10.1541 18.2887 9.99807 17.4935 9.99807C16.6983 9.99807 15.928 10.1525 15.2041 10.4596C14.5035 10.7551 13.8743 11.1801 13.3331 11.7197C13.202 11.8508 13.0791 11.9869 12.9613 12.1264C12.9114 12.1878 12.8351 12.2227 12.7571 12.2227H11.59C11.4854 12.2227 11.4206 12.1065 11.4787 12.0185C12.7521 10.0396 14.98 8.72971 17.5117 8.73635C21.4895 8.74631 24.6786 11.9753 24.6388 15.9481C24.5989 19.8577 21.4148 23.0137 17.4935 23.0137C14.9684 23.0137 12.7504 21.7055 11.4787 19.7316C11.4223 19.6436 11.4854 19.5274 11.59 19.5274ZM10.1141 15.7704L12.4698 13.9111C12.5578 13.8413 12.6857 13.9044 12.6857 14.0157V15.2774H17.8986C17.9716 15.2774 18.0314 15.3371 18.0314 15.4102V16.3399C18.0314 16.4129 17.9716 16.4727 17.8986 16.4727H12.6857V17.7344C12.6857 17.8456 12.5562 17.9087 12.4698 17.839L10.1141 15.9796C10.0982 15.9672 10.0854 15.9513 10.0765 15.9332C10.0677 15.9151 10.0631 15.8952 10.0631 15.875C10.0631 15.8549 10.0677 15.835 10.0765 15.8169C10.0854 15.7987 10.0982 15.7829 10.1141 15.7704Z"
                  fill="white"
                />
              </g>
            </svg>
          </button>
        </span>
  
        {/* Notification Sidebar */}
        <NotificationSidebar />
      </div>
    </div>
  );
};

export default Header;
