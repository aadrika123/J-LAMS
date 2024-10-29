import React from "react";
import Image from "next/image";
import { SidebarLinksProps } from "@/utils/types/types";
import HomeIcon from "@/assets/icons/sidebar/hrms.svg";
import EmployeeManagementIcon from "@/assets/icons/sidebar/employee.svg";
import DashboardIcon from "@/assets/icons/sidebar/ion_home.svg";

// import OnBoardIcon from "@/assets/icons/sidebar/mdi_user-add.svg";
// import Apply from "@/assets/icons/sidebar/employee.svg";

const url = "";



export const sidebarLinks: SidebarLinksProps = {
    modules: [
        {
            moduleName: "LAMS",
            path: "/",
            icon: <Image src={HomeIcon} alt="finance" width={100} height={100} />,
            dropdown: true,
            subModules: [
                {
                    moduleName: "LAMS",
                    icon: (
                        <Image
                            src={DashboardIcon}
                            alt="assets"
                            width={100}
                            height={100}
                        />
                    ),
                    path: `${url}/apply/form`,
                    dropdown: true,
                    subModules: [
                         {
                            moduleName: "Homes",
                            path: `${url}/apply/approve-application`,
                            icon: (
                                <Image
                                    src={EmployeeManagementIcon}
                                    alt="masters"
                                    width={100}
                                    height={100}
                                />
                            ),
                        },
                        
                    ],
                },
            ],
        },
    ],
};
