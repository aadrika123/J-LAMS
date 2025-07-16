"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { sidebarLinks } from "@/json/sidebar.json";
// import { usePathname } from "next/navigation";
import { InnerHeading } from "@/components/Helpers/Heading";
import ProfileIcon from "@/assets/icons/profile_new.png";
// import HomeIcon from "@/assets/icons/sidebar/hrms.svg";
import DashboardIcon from "@/assets/icons/sidebar/ion_home.svg";
import MunicipalHoldIcon from "@/assets/icons/sidebar/MunicipalHoldIcon.svg";
import FieldOfficerHoldIcon from "@/assets/icons/sidebar/FieldOfficerHoldIcon.svg";

interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
  className: string;
}

const Sidebar: React.FC<SideBarProps> = (props) => {
  // const pathName = usePathname();
  const [data, setData] = useState<string | null>();
  const [, setSidebarLink] = useState<any>();
  const [userDetails, setUserDetails] = useState<any>();
  // const [isTeamManagementOpen, setIsTeamManagementOpen] = useState<boolean>(false);

  useEffect(() => {
    setData(localStorage.getItem("openPage"));
  }, []);
  // const handleClick = (moduleName: string) => {
  //   localStorage.setItem("openPage", moduleName);
  // };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user_details");
      const user_details = JSON.parse(data as string);
      if (user_details?.user_type !== "Employee") {
        setSidebarLink(sidebarLinks);
      } else {
        if (user_details.id !== 72) {
          let updatedSubModules: any
          sidebarLinks.modules[0].subModules = updatedSubModules
          setSidebarLink(sidebarLinks);
        } else {
          setSidebarLink(sidebarLinks);
        }

        // }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user_details");
      const user_details = JSON.parse(data as string);
      console.log(user_details, "user");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user_details");
      const user_details = JSON.parse(data as string);
      setUserDetails(user_details);
    }
  }, []);

  return (
    <div className={`${props.className} ${data === "UD&HD" ? "hidden" : ""}`}>
      <div {...props}>
        <section>
          <div className="flex flex-col items-center justify-center p-5">
            <Image src={ProfileIcon} width={100} height={100} alt="logo" />
            <br />
            <InnerHeading className="font-bold">
              {userDetails?.user_type}
            </InnerHeading>
            <InnerHeading>{userDetails?.name}</InnerHeading>

            {/* {isTeamManagementOpen && (
              <p onClick={() => setIsTeamManagementOpen(false)} className="border-2 text-zinc-800 rounded-sm p-1 cursor-pointer"> {'<-'} Back to main menu</p>
            )} */}

          </div>

          <Link href="/apply/approve-application" className="text-xl text-white">

            <div className="flex gap-3 m-3 bg-[#4338CA] hover:bg-[#4338CA] p-3 rounded-lg">
              <Image src={DashboardIcon} alt="finance" width={30} height={30} className="text-white" />
              <InnerHeading className="text-xl text-white">Home</InnerHeading>
            </div>
          </Link>


          <Link href="/hold/fieldofficer" className="text-xl text-white">

            <div className="flex gap-3 m-3 bg-[#4338CA] hover:bg-[#4338CA] p-3 rounded-lg">
              <Image src={FieldOfficerHoldIcon} alt="finance" width={30} height={30} className="text-white" />
              <InnerHeading className="text-xl text-white">Hold by Field Officer</InnerHeading>
            </div>


          </Link>






          <Link href="/assets/assets-approved" className="text-xl text-white">

            <div className="flex gap-3 m-3 bg-[#4338CA] hover:bg-[#4338CA] p-3 rounded-lg">
              <Image src={MunicipalHoldIcon} alt="finance" width={30} height={30} className="text-white" />
              <InnerHeading className="text-xl text-white">Admin Approved Assets</InnerHeading>
            </div>
          </Link>






          <Link href="/hold/admin" className="text-xl text-white">

            <div className="flex gap-3 m-3 bg-[#4338CA] hover:bg-[#4338CA] p-3 rounded-lg">
              <Image src={MunicipalHoldIcon} alt="finance" width={30} height={30} className="text-white" />
              <InnerHeading className="text-xl text-white">Hold by Admin </InnerHeading>
            </div>
          </Link>


          <Link href="/hold/marketmaster" className="text-xl text-white">

            <div className="flex gap-3 m-3 bg-[#4338CA] hover:bg-[#4338CA] p-3 rounded-lg">
              <Image src={MunicipalHoldIcon} alt="finance" width={30} height={30} className="text-white" />
              <InnerHeading className="text-xl text-white">Market Master </InnerHeading>
            </div>
          </Link>
          <Link href="/assets/restructured-assets" className="text-xl text-white">

            <div className="flex gap-3 m-3 bg-[#4338CA] hover:bg-[#4338CA] p-3 rounded-lg">
              <Image src={MunicipalHoldIcon} alt="finance" width={30} height={30} className="text-white" />
              <InnerHeading className="text-xl text-white">Restructured Assets </InnerHeading>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Sidebar;
