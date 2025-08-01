/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { sidebarLinks } from "@/json/sidebar.json";
// // import { usePathname } from "next/navigation";
// import { InnerHeading } from "@/components/Helpers/Heading";
// import ProfileIcon from "@/assets/icons/profile_new.png";
// // import HomeIcon from "@/assets/icons/sidebar/hrms.svg";
// import DashboardIcon from "@/assets/icons/sidebar/ion_home.svg";
// import MunicipalHoldIcon from "@/assets/icons/sidebar/MunicipalHoldIcon.svg";
// import FieldOfficerHoldIcon from "@/assets/icons/sidebar/FieldOfficerHoldIcon.svg";

// interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
//   className: string;
// }

// const Sidebar: React.FC<SideBarProps> = (props) => {
//   // const pathName = usePathname();
//   const [data, setData] = useState<string | null>();
//   const [, setSidebarLink] = useState<any>();
//   const [userDetails, setUserDetails] = useState<any>();
//   // const [isTeamManagementOpen, setIsTeamManagementOpen] = useState<boolean>(false);

//   useEffect(() => {
//     setData(localStorage.getItem("openPage"));
//   }, []);
//   // const handleClick = (moduleName: string) => {
//   //   localStorage.setItem("openPage", moduleName);
//   // };

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const data = localStorage.getItem("user_details");
//       const user_details = JSON.parse(data as string);
//       if (user_details?.user_type !== "Employee") {
//         setSidebarLink(sidebarLinks);
//       } else {
//         if (user_details.id !== 72) {
//           let updatedSubModules: any
//           sidebarLinks.modules[0].subModules = updatedSubModules
//           setSidebarLink(sidebarLinks);
//         } else {
//           setSidebarLink(sidebarLinks);
//         }

//         // }
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const data = localStorage.getItem("user_details");
//       const user_details = JSON.parse(data as string);
//       console.log(user_details, "user");
//     }
//   }, []);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const data = localStorage.getItem("user_details");
//       const user_details = JSON.parse(data as string);
//       setUserDetails(user_details);
//     }
//   }, []);

//   return (
//     <div className={`${props.className} ${data === "UD&HD" ? "hidden" : ""}`}>
//       <div {...props}>
//         <section>
//           <div className="flex flex-col items-center justify-center p-5">
//             <Image src={ProfileIcon} width={100} height={100} alt="logo" />
//             <br />
//             <InnerHeading className="font-bold">
//               {userDetails?.user_type}
//             </InnerHeading>
//             <InnerHeading>{userDetails?.name}</InnerHeading>

//             {/* {isTeamManagementOpen && (
//               <p onClick={() => setIsTeamManagementOpen(false)} className="border-2 text-zinc-800 rounded-sm p-1 cursor-pointer"> {'<-'} Back to main menu</p>
//             )} */}

//           </div>

//           <Link href="/apply/approve-application" className="text-xl text-white">

//             <div className="flex gap-3 m-3 bg-[#4338CA] hover:bg-[#4338CA] p-3 rounded-lg">
//               <Image src={DashboardIcon} alt="finance" width={30} height={30} className="text-white" />
//               <InnerHeading className="text-xl text-white">Home</InnerHeading>
//             </div>
//           </Link>


//           <Link href="/hold/fieldofficer" className="text-xl text-white">

//             <div className="flex gap-3 m-3 bg-[#4338CA] hover:bg-[#4338CA] p-3 rounded-lg">
//               <Image src={FieldOfficerHoldIcon} alt="finance" width={30} height={30} className="text-white" />
//               <InnerHeading className="text-xl text-white">Hold by Field Officer</InnerHeading>
//             </div>


//           </Link>






//           <Link href="/assets/assets-approved" className="text-xl text-white">

//             <div className="flex gap-3 m-3 bg-[#4338CA] hover:bg-[#4338CA] p-3 rounded-lg">
//               <Image src={MunicipalHoldIcon} alt="finance" width={30} height={30} className="text-white" />
//               <InnerHeading className="text-xl text-white">Admin Approved Assets</InnerHeading>
//             </div>
//           </Link>






//           <Link href="/hold/admin" className="text-xl text-white">

//             <div className="flex gap-3 m-3 bg-[#4338CA] hover:bg-[#4338CA] p-3 rounded-lg">
//               <Image src={MunicipalHoldIcon} alt="finance" width={30} height={30} className="text-white" />
//               <InnerHeading className="text-xl text-white">Hold by Admin </InnerHeading>
//             </div>
//           </Link>


//           <Link href="/hold/marketmaster" className="text-xl text-white">

//             <div className="flex gap-3 m-3 bg-[#4338CA] hover:bg-[#4338CA] p-3 rounded-lg">
//               <Image src={MunicipalHoldIcon} alt="finance" width={30} height={30} className="text-white" />
//               <InnerHeading className="text-xl text-white">Market Master </InnerHeading>
//             </div>
//           </Link>
//           <Link href="/assets/restructured-assets" className="text-xl text-white">

//             <div className="flex gap-3 m-3 bg-[#4338CA] hover:bg-[#4338CA] p-3 rounded-lg">
//               <Image src={MunicipalHoldIcon} alt="finance" width={30} height={30} className="text-white" />
//               <InnerHeading className="text-xl text-white">Restructured Assets </InnerHeading>
//             </div>
//           </Link>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;







///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : Almaash Alam
// 👉 Component   : SideBar
// 👉 Status      : Close
// 👉 Description : This screen is designed to handle sidebar.
// 👉 Functions   :
//                  1. dropFun -> To handle drop down.
///////////////////////////////////////////////////////////////////////////////////////////////////////////
"use client";
// 👉 Importing Packages 👈
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./SideBar.css";
import { ChevronDown } from "lucide-react";
import axios from "@/lib/axiosConfig";
import Image from "next/image";

import icon from "../../../assets/icons/profile_new.png";


import { BsGrid1X2 } from "react-icons/bs";
import { BsGrid1X2Fill } from "react-icons/bs";
// 👉 Type Definitions 👈
interface ChildItem {
  name: string;
  path: string;
}

interface MenuItem {
  name: string;
  path: string | null;
  children: ChildItem[];
}

interface SideBarProps {
  // menu: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  className?: String;
}

const SideBar: React.FC<SideBarProps> = () => {

  // 👉 State constants 👈
  const [dropDown, setdropDown] = useState<boolean>(false);
  const [toggleBar, settoggleBar] = useState<boolean>(false);
  const [dropName, setdropName] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userdetails, setUserDetails] = useState<any>();
  const [userPermission, setuserPermission] = useState<unknown>();

  const bg = "slate"; // background color
  const mcolor = "blue"; // menu color
  const tcolor = "gray"; // text color

  // 👉 CSS constants 👈
  const dropMenuBtn = `block w-full pl-7 py-3 px-6 clear-both whitespace-nowrap text-sm hover:bg-${mcolor}-700 hover:text-${tcolor}-100 rounded-md text-sm animate__animated animate__fadeIn animate__faster `;

  const mobileMenuBtn = `block py-3 px-4 hover:bg-${mcolor}-700 hover:text-${tcolor}-100 rounded-md animate__animated animate__fadeIn animate__faster `;
  const open1 = `animate__animated animate__slideInLeft animate__faster bg-${bg}-100 w-[16.5rem] `;
  const open3 = `animate__animated animate__fadeInLeft animate__faster `;
  const close1 = `w-0 sm:w-3 bg-${bg}-100 animate__animated `;
  const close3 = `animate__animated animate__fadeOutLeft animate__faster `;

  // 👉 Function 1 👈
  const dropFun = (val: string) => {
    setdropDown(!dropDown);
    setdropName(val);
  };

  const fetchMenuList = async () => {
    const requestBody = {
      moduleId: 21,
    };

    try {
      // Make API request
      const res = await axios.post(
        // `https://aadrikainfomedia.com/auth/api/menu/by-module`,
        `https://jharkhandegovernance.com/auth/api/menu/by-module`,
        // `https://egov.rsccl.in/auth/api/menu/by-module`,
        //  `${process.env.backend}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          },
        }
      );

      const data = res?.data;

      if (data?.data?.userDetails && data?.data?.permission) {
        const newdata = JSON.stringify(data?.data?.userDetails);
        if (newdata != undefined) {
          localStorage.setItem("userDetail", newdata);
        }

        setuserPermission(data?.data?.permission);
        setUserDetails(data?.data?.userDetails);
      } else {
        console.error("Missing required data in the API response.");
      }
    } catch (error) {
      console.error("Error fetching menu list", error);
    }
  };

  useEffect(() => {
    fetchMenuList();
  }, []);

  return (
    <>
      {/* 👉 ======Main Section========== 👈 */}
      <header>
        {
          <div
            className={
              (toggleBar ? open3 : close3) + ` bg-${bg}-100 w-full inset-0  `
            }
            id="mobile-menu"
          >
            <nav
              id="mobile-nav"
              className="flex flex-col ltr:right-0 rtl:left-0 w-full top-0 py-4 "
            >
              <div
                className={`mb-auto text-sm 2xl:text-base text-${tcolor}-800`}
              >
                {/* 👉 ========logo========== 👈 */}
                <div className="text-center mb-4">
                  <div
                    className={`text-xl text-${tcolor}-800 flex flex-col items-start justify-center relative`}
                  >
                    <span className="flex justify-center w-full">
                      {" "}
                      <span
                        className={`text-[50px] flex justify-center py-2 text-${tcolor}-800`}
                      >
                       
                        <Image src={icon} width={100} height={100} alt="logo" />
                      </span>
                    </span>
                    <span className="flex justify-center font-semibold w-full">
                      {userdetails?.userName}
                    </span>
                    <span className='flex justify-center w-full uppercase text-sm font-semibold'>
                      {userdetails?.roles[0]}
                    </span>
                  </div>
                  <hr className={`my-4 bg-${bg}-700 h-[0.1rem]`} />
                </div>

                {/* 👉 =====menus======  👈*/}
                <div className=" text-sm px-4 overflow-y-auto scrollbar-width-10 scrollbar-track-blue-100 scrollbar-thumb-blue-700 scrollbar-thumb-rounded-full scrollbar-thumb-hover-blue-500 transition-all duration-200">
                  <nav className="relative flex flex-wrap items-center justify-between overflow-x-hidden">
                    <ul
                      id="side-menu"
                      className="w-full float-none flex flex-col "
                    >
                      <SidebarChild items={userPermission} />
                    </ul>
                  </nav>
                </div>
              </div>
            </nav>
          </div>
        }
      </header>
    </>
  );
};
export default SideBar;

function SidebarChild({ items }: any) {
  return (
    <div className="w-64 min-h-screen ">
      <nav className="space-y-4 ">
        {items?.map((item: any) => <SidebarItem key={item.id} item={item} />)}
      </nav>
    </div>
  );
}

function SidebarItem({ item }: any) {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-[#190BC4] hover:text-white  rounded-md transition-colors"
        >
          <div className="flex items-center gap-2 ">
            <BsGrid1X2Fill />

            <span>{item.name}</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="pl-6 mt-3 space-y-1 bg-[#190BC4] rounded-md text-white">
            {item.children.map((child: any) => (
              <SidebarItem key={child.id} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.path || "#"}
      className="flex items-center mt-2  gap-2 px-4 py-2 text-sm hover:bg-[#190BC4] hover:text-white rounded-md transition-colors"
    >
      <BsGrid1X2 />
      <span>{item.name}</span>
    </Link>
  );
}


