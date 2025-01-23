/***
 * Author: Jaideep
 * Status: Closed
 * Description: Designed to manage login form design.
 */

"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Logo2 from "@/assets/icons/01 LMS.svg";
import Logo1 from "@/assets/icons/02 LMS.svg";
import Image from "next/image";

const LoginPage = dynamic(() => import("./Login"), {
  ssr: false,
});

const HeroLoginPage = () => {
  const [showImage, setShowImage] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 1000);

    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setMessage(searchParams.get("msg") || "");
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="h-screen border-2 border-red-200 flex flex-col justify-between bg-gray-100 dark:bg-gray-900 border-b dark:bg-opacity-40">
        <header className="border-b border-gray-200 bg-white dark:bg-white-600 dark:border-gray-800 text-black">
          <div className="container mx-auto xl:max-w-6xl py-2">
            <nav className="flex flex-row flex-nowrap items-center justify-between mt-0 py-2 px-6" id="desktop-menu">
              <a className="flex items-center py-2 text-xl">
                <div className="flex flex-col">
                  <div>
                    <span className="font-bold text-xl uppercase">Land and Asset Management System</span>
                  </div>
                </div>
              </a>
            </nav>
          </div>

          {message && (
            <div className="w-full h-8 bg-red-600 flex justify-center items-center text-white text-lg p-3">
              <span className="font-semibold">⚠️ Permission Denied</span> - {message}
            </div>
          )}
        </header>

        <main>
          <div className="md:py-12 bg-gray-100 dark:bg-gray-900 dark:bg-opacity-40">
            <div className="container mx-auto px-4 xl:max-w-6xl">
              <div className="flex flex-wrap -mx-4 flex-row">
                <div className="flex-shrink max-w-full px-4 w-full lg:w-1/2">
                  <LoginPage />
                </div>
                <div className="flex-shrink max-w-full px-4 w-full lg:w-1/2">
                  <div className="text-center lg:mt-0">
                    <div className="relative">
                      {showImage && (
                        <>
                          <Image
                            src={Logo1}
                            alt="Logo"
                            className="w-full mx-auto md:max-w-5xl lg:max-w-6xl xl:max-w-7xl absolute top-[-80px] left-0 "
                          />
                          <Image
                            src={Logo2}
                            alt="Logo"
                            className="w-[20rem] mx-auto max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg absolute left-0 top-[9.35rem] "
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-white border-t p-6 border-gray-200 dark:bg-gray-800 dark:border-gray-800 text-black">
          <div className="container mx-auto px-4 xl:max-w-6xl">
            <div className="mx-auto px-4">
              <div className="flex flex-wrap flex-row -mx-4">
                <div className="flex-shrink max-w-full px-4 w-full md:w-1/2 text-center md:text-left">
                  <ul className="pl-0 space-x-4">
                    {['Support', 'Help Center', 'Privacy', 'Terms of Service'].map((item, index) => (
                      <li key={index} className="inline-block mr-3">
                        <a className="hover:text-indigo-500" href="#">{item} |</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-shrink max-w-full px-4 w-full md:w-1/2 text-center md:text-right">
                  <p className="mb-0 mt-3 md:mt-0">
                    <a href="#" className="hover:text-indigo-500">UD&HD</a> | All rights reserved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HeroLoginPage;
