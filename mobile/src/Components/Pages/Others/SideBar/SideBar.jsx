///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : SideBar
// 👉 Status      : Close
// 👉 Description : This screen is designed to handle sidebar.
// 👉 Functions   :
//                  1. dropFun -> To handle drop down.
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./SideBar.css";
import "animate.css";
import { MdOutlineDashboard, MdOutlineSpaceDashboard } from "react-icons/md";
import { contextVar } from "@/Components/context/contextVar";
import { BsBuildings, BsCaretRight } from "react-icons/bs";
import { FcBusinessman } from "react-icons/fc";
import ApprovedIcon from "../../../../assets/Images/approvedIcon.svg";
import HomeIcon from "../../../../assets/Images/home.svg";

const SideBar = (props) => {
  // 👉 Context constants 👈
  const { toggleBar, settoggleBar, userDetails } = useContext(contextVar);

  // 👉 State constants 👈
  const [dropDown, setdropDown] = useState(false);
  const [dropName, setdropName] = useState("");
  const [userDetail, setUserDetails] = useState("");

  let bg = "slate"; // background color
  let mcolor = "blue"; // menu color
  let tcolor = "gray"; // text color

  // 👉 CSS constants 👈
  const dropMenuBtn = `block w-full pl-7 py-3 px-6 clear-both whitespace-nowrap text-sm hover:bg-${mcolor}-700 hover:text-${tcolor}-100 rounded-md text-sm animate__animated animate__fadeIn animate__faster `;

  const mobileMenuBtn = `block py-3 px-4 hover:bg-${mcolor}-700 hover:text-${tcolor}-100 rounded-md animate__animated animate__fadeIn animate__faster `;
  const open1 = `animate__animated animate__slideInLeft animate__faster bg-${bg}-100 w-[16.5rem] `;
  const open3 = `animate__animated animate__fadeInLeft animate__faster `;
  const close1 = `w-0 sm:w-3 bg-${bg}-100 animate__animated `;
  const close3 = `animate__animated animate__fadeOutLeft animate__faster `;

  // 👉 Function 1 👈
  // const dropFun = (val) => {
  //   setdropDown(!dropDown);
  //   setdropName(val);
  // };

  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/approval-view"); // Change this path to the desired route
  };
  const handleNavigation1 = () => {
    navigate("/admin-approve-view"); // Change this path to the desired route
  };
  const handleNavigation2 = () => {
    navigate("/on-hold-view"); // Change this path to the desired route
  };
  const handleNavigation3 = () => {
    navigate("/restructured-assets-view"); // Change this path to the desired route
  };
  const handleHomeNavigation = () => {
    navigate("/field-officer"); // Change this path to the desired route
    // window.location.reload();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user_details");
      if (data) {
        try {
          const user_details = JSON.parse(data);
          setUserDetails(user_details);
        } catch (e) {
          console.error("Error parsing user_details from sessionStorage:", e);
        }
      }
    }
  }, []);

  console.log("userDetail", userDetail.user_name);

  return (
    <>
      {/* 👉 ======Main Section========== 👈 */}
      <header
        className={
          (toggleBar ? open1 : close1) +
          ` relative select-none transition-all duration-200 h-full text-${tcolor}-800 pt-2 border-r border-${bg}-200 shadow-xl`
        }
      >
        {
          <div
            className={
              (toggleBar ? open3 : close3) + ` bg-${bg}-100 w-full inset-0 `
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
                        <FcBusinessman />
                      </span>
                    </span>
                    <span className="flex justify-center font-semibold w-full">
                      {userDetail?.user_name}
                    </span>

                    <span className="flex justify-center w-full">
                      {userDetail?.user_type}
                    </span>

                    <span className="flex justify-center text-sm text-blue-700 w-full">
                      {userDetail?.ulbName}
                    </span>

                    {/* <span className='flex justify-center w-full uppercase text-sm font-semibold'>
                      {userDetails?.roles?.map((elem) => elem)}
                    </span> */}
                  </div>
                  <hr className={`my-4 bg-${bg}-700 h-[0.1rem]`} />
                </div>

                {/* 👉 =====menus======  👈*/}
                <div className=" text-sm px-4 overflow-y-auto scrollbar-width-10 scrollbar-track-blue-100 scrollbar-thumb-blue-700 scrollbar-thumb-rounded-full scrollbar-thumb-hover-blue-500 transition-all duration-200">
                  <nav className="relative flex flex-wrap items-center justify-between overflow-x-hidden">
                    <ul
                      id="side-menu"
                      className="w-full float-none flex flex-col"
                    >
                      <div className="flex flex-col rounded-xl">
                        <li
                          className="bg-[#4338ca] text-white p-3 rounded hover:bg-[#5a50c8] hover:scale-95 transition duration-300 ease-in-out cursor-pointer flex items-center mt-2"
                          onClick={handleHomeNavigation}
                        >
                          <img
                            src={HomeIcon}
                            alt="Home Icon"
                            className="mr-2"
                          />
                          Home
                        </li>

                        {/* ........................ */}
                        <li
                          className="bg-[#4338ca] text-white px-4 py-2 rounded hover:bg-[#5a50c8] hover:scale-95 transition duration-300 ease-in-out  cursor-pointer flex items-center mt-2"
                          onClick={handleNavigation}
                        >
                          <img
                            src={ApprovedIcon}
                            alt="Approved Icon"
                            className="mr-2"
                          />
                          Approved Application
                        </li>

                        {/* ........................ */}
                        <li
                          className="bg-[#4338ca] text-white px-4 py-2 rounded hover:bg-[#5a50c8] hover:scale-95 transition duration-300 ease-in-out  cursor-pointer flex items-center mt-2 "
                          onClick={handleNavigation1}
                        >
                          <img
                            src={ApprovedIcon}
                            alt="Approved Icon"
                            className="mr-2"
                          />
                          Admin Approved Assets
                        </li>
                        {/* ........................ */}
                        <li
                          className="bg-[#4338ca] text-white px-4 py-2 rounded hover:bg-[#5a50c8] hover:scale-95 transition duration-300 ease-in-out cursor-pointer flex items-center mt-2"
                          onClick={handleNavigation2}
                        >
                          <img
                            src={ApprovedIcon}
                            alt="Approved Icon"
                            className="mr-2"
                          />
                          On Hold
                        </li>
                        <li
                          className="bg-[#4338ca] text-white px-4 py-2 rounded hover:bg-[#5a50c8] hover:scale-95 transition duration-300 ease-in-out cursor-pointer flex items-center mt-2"
                          onClick={handleNavigation3}
                        >
                          <img
                            src={ApprovedIcon}
                            alt="Approved Icon"
                            className="mr-2"
                          />
                          Restructured Assets
                        </li>
                      </div>

                      {/* {props?.menu?.map((item) => (
                        <>
                          <li
                            className='relative cursor-pointer mb-4'
                            onClick={() => {
                              window.innerWidth <= 763 &&
                                item?.children?.length == 0 &&
                                settoggleBar(!toggleBar);
                            }}
                          >
                            <NavLink
                              to={item?.path == "" ? null : item?.path}
                              className={({ isActive }) =>
                                (isActive && item?.children?.length == 0
                                  ? ` bg-${mcolor}-600 text-${tcolor}-100 `
                                  : ` `) +
                                `${mobileMenuBtn} ` +
                                "flex gap-4 items-center"
                              }
                              onClick={() => {
                                dropFun(item?.name);
                                dropName == item?.name && setdropName("");
                              }}
                            >
                              {" "}
                              <span>
                                <MdOutlineDashboard />
                              </span>{" "}
                              <div
                                className={`flex justify-between items-center flex-1 `}
                              >
                                <span>{item?.name}</span>
                                {item?.path == null && (
                                  <span
                                    className={
                                      dropName == item?.name
                                        ? "transition-all duration-200 ease-in-out rotate-90 "
                                        : "transition-all duration-200 ease-in-out rotate-0"
                                    }
                                  >
                                    <BsCaretRight />
                                  </span>
                                )}
                              </div>{" "}
                            </NavLink>

                            {item?.children?.length > 0 &&
                              dropName == item?.name && (
                                <ul className='block rounded top-full py-0.5 ltr:text-left rtl:text-right bg-[#190BC4] text-white'>
                                  {item?.children?.map((elem) => (
                                    <>
                                      <li
                                        className={`relative cursor-pointer mb-1 `}
                                        onClick={() => {
                                          window.innerWidth <= 763 &&
                                            settoggleBar(!toggleBar);
                                        }}
                                      >
                                        <NavLink
                                          to={elem?.path}
                                          className={({ isActive }) =>
                                            (isActive
                                              ? `bg-blue-700 text-white `
                                              : ``) +
                                            `${dropMenuBtn} ` +
                                            "flex gap-3 items-center "
                                          }
                                        >
                                          <span>
                                            <MdOutlineSpaceDashboard />
                                          </span>{" "}
                                          <span className=''>{elem?.name}</span>
                                        </NavLink>
                                      </li>
                                    </>
                                  ))}
                                </ul>
                              )}
                          </li>
                        </>
                      ))} */}
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
