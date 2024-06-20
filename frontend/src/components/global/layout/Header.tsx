"use client";
import React, { useEffect, useState } from "react";
import { SubHeading } from "@/components/Helpers/Heading";
import Cookies from "js-cookie";
import { ASSETS } from "@/utils/api/urls";

import axios from "@/lib/axiosConfig";

interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
  className: string;
}

const Header: React.FC<SideBarProps> = (props) => {
  
  
  const [ulbId, setUlbId] = useState<string>("");
  const [ulbName, setUlbName] = useState<string>("");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user_det = sessionStorage.getItem("user_details");
      if (user_det) {
        const ulb_id = JSON.parse(user_det as string)?.ulb_id;
        setUlbId(ulb_id);
      }
    }
  }, [ulbId]);

  useEffect(() => {
    const fetchData = async (ulbId:any) => {
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


  return (
    <div {...props}>
      <div className="flex items-center justify-center gap-3 mx-20">
        <div className="text-center">
          <h1 className="text-[2rem] text-primary font-bold ">UD&HD</h1>
          <h4 className="text-[1rem] text-blue-600 font-bold ">
            {ulbName}
          </h4>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SubHeading className="mr-5">
          Land and Asset Management System
        </SubHeading>

        <span>
          <button onClick={logout}>
            <svg
              width="35"
              height="34"
              viewBox="0 0 35 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_992_6899)">
                <rect
                  x="2"
                  y="0.375"
                  width="31"
                  height="30"
                  rx="9"
                  fill="#5457D6"
                  shapeRendering="crispEdges"
                />
                <path
                  d="M11.59 19.5274H12.7571C12.8367 19.5274 12.9114 19.5622 12.9613 19.6237C13.0775 19.7648 13.202 19.9009 13.3331 20.0304C13.8695 20.5673 14.5049 20.9952 15.2041 21.2905C15.9285 21.5964 16.7071 21.7534 17.4935 21.752C18.2887 21.752 19.059 21.5959 19.7828 21.2905C20.482 20.9952 21.1174 20.5673 21.6538 20.0304C22.1912 19.4953 22.6197 18.861 22.9155 18.1627C23.2227 17.4389 23.3771 16.6702 23.3771 15.875C23.3771 15.0798 23.221 14.3112 22.9155 13.5873C22.62 12.8884 22.195 12.2592 21.6538 11.7197C21.1126 11.1801 20.4834 10.7551 19.7828 10.4596C19.059 10.1541 18.2887 9.99807 17.4935 9.99807C16.6983 9.99807 15.928 10.1525 15.2041 10.4596C14.5035 10.7551 13.8743 11.1801 13.3331 11.7197C13.202 11.8508 13.0791 11.9869 12.9613 12.1264C12.9114 12.1878 12.8351 12.2227 12.7571 12.2227H11.59C11.4854 12.2227 11.4206 12.1065 11.4787 12.0185C12.7521 10.0396 14.98 8.72971 17.5117 8.73635C21.4895 8.74631 24.6786 11.9753 24.6388 15.9481C24.5989 19.8577 21.4148 23.0137 17.4935 23.0137C14.9684 23.0137 12.7504 21.7055 11.4787 19.7316C11.4223 19.6436 11.4854 19.5274 11.59 19.5274ZM10.1141 15.7704L12.4698 13.9111C12.5578 13.8413 12.6857 13.9044 12.6857 14.0157V15.2774H17.8986C17.9716 15.2774 18.0314 15.3371 18.0314 15.4102V16.3399C18.0314 16.4129 17.9716 16.4727 17.8986 16.4727H12.6857V17.7344C12.6857 17.8456 12.5562 17.9087 12.4698 17.839L10.1141 15.9796C10.0982 15.9672 10.0854 15.9513 10.0765 15.9332C10.0677 15.9151 10.0631 15.8952 10.0631 15.875C10.0631 15.8549 10.0677 15.835 10.0765 15.8169C10.0854 15.7987 10.0982 15.7829 10.1141 15.7704Z"
                  fill="white"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_992_6899"
                  x="0.4"
                  y="0.275"
                  width="34.2"
                  height="33.2"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="1.5" />
                  <feGaussianBlur stdDeviation="0.8" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.596078 0 0 0 0 0.596078 0 0 0 0 0.607843 0 0 0 0.34 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_992_6899"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_992_6899"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </button>
        </span>
        <span className="w-9 mt-[-7px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
          >
            <g filter="url(#filter0_d_935_6737)">
              <rect
                x="2"
                y="0.375"
                width="30"
                height="30"
                rx="10"
                fill="#5457D6"
                shapeRendering="crispEdges"
              />
              <path
                d="M17 23.8907C17.825 23.8907 18.5 23.1811 18.5 22.3139H15.5C15.5 23.1811 16.1675 23.8907 17 23.8907ZM21.5 19.1604V15.2185C21.5 12.7982 20.27 10.7721 18.125 10.236V9.6999C18.125 9.04555 17.6225 8.51733 17 8.51733C16.3775 8.51733 15.875 9.04555 15.875 9.6999V10.236C13.7225 10.7721 12.5 12.7903 12.5 15.2185V19.1604L11 20.7372V21.5255H23V20.7372L21.5 19.1604Z"
                fill="white"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_935_6737"
                x="0.4"
                y="0.275"
                width="33.2"
                height="33.2"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="1.5" />
                <feGaussianBlur stdDeviation="0.8" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.596078 0 0 0 0 0.596078 0 0 0 0 0.607843 0 0 0 0.34 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_935_6737"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_935_6737"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default Header;
