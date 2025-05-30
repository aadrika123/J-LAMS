/***
 * Author: Jaideep
 * Status: Closed
 * Description: Designed to manage login form design.
 */


"use client";

import Button from "@/components/global/atoms/Button";
import Input from "@/components/global/atoms/Input";
import { Formik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import axios from "@/lib/axiosConfig";
import { useDispatch } from "react-redux";
import { login } from "@/redux/reducers/auth.reducer";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
// import { HRMS_URL } from "@/utils/api/urls";
import { useWorkingAnimation } from "@/components/Helpers/Widgets/useWorkingAnimation";

interface LoginInitialData {
  user_id: string;
  password: string;
}



// 🔐 Encrypt password function using AES-256-CBC
function encryptPassword(plainPassword: string): string {
  const secretKeyHex =
    "c2ec6f788fb85720bf48c8cc7c2db572596c585a15df18583e1234f147b1c2897aad12e7bebbc4c03c765d0e878427ba6370439d38f39340d7eb06609019115866bc8919ff3ef5503ac49e2442ab2a6b806083c0616e10d2d3d00f530e1ac3363e6e7ad420df3f864aa9cd6b05376dfa360147476efd67f3a56ee467670eb519a6139d4250d8f6dffb030923a25160011c23b296a6ceb291c52f49985cddba1949fa8666d64d199b408c8965761285655ee70a3291d0928a16b3f024281deb11969aa4fa499e313a658790013e0ebe7870b316abdd4aba8c8942ceaa1f365d925d05d77055db5bcb4bb219d93bdb4cf087133f50a8f0b0de5e21f5da89c0438b";

  const secretKeyWA = CryptoJS.enc.Hex.parse(secretKeyHex);
  const key = CryptoJS.SHA256(secretKeyWA);
  const ivHex = CryptoJS.SHA256(secretKeyWA).toString().substring(0, 32);
  const iv = CryptoJS.enc.Hex.parse(ivHex);

  const encrypted = CryptoJS.AES.encrypt(plainPassword, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}




const Login = () => {
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [workingAnimation, activateWorkingAnimation, hideWorkingAnimation] = useWorkingAnimation();
  const [errrrr, setErrrrr] = useState<boolean>();

  const LoginSchema = Yup.object().shape({
    user_id: Yup.string().required("User Id is required"),
    password: Yup.string().required("Password is required"),
  });

 const handleLogin = async (values: LoginInitialData) => {
    try {
      activateWorkingAnimation();

      const payload = {
        email: values.user_id,
        password: encryptPassword(values.password), // 🔐 Encrypted using AES-256-CBC
      };

      const res = await axios({
        url: `${process.env.backend}/api/login`,
        method: "POST",
        data: payload,
      });

      const data = res.data.data;

      if (data) {
        localStorage.setItem("user_details", JSON.stringify(data?.userDetails));
        Cookies.set("emp_id", data?.userDetails?.emp_id);
        Cookies.set("accesstoken", data?.token);
        localStorage.setItem("accesstoken", data?.token);

        if (typeof window !== "undefined") {
          const storedData = localStorage.getItem("user_details");
          const userData = storedData && JSON.parse(storedData);

          if (userData?.user_type === "Municipal" || userData?.user_type === "Admin") {
            setErrrrr(false);
            dispatch(login(userData));
            window.location.replace("/lams/apply/approve-application");
          } else {
            hideWorkingAnimation();
            setErrrrr(true);
          }
        }
      } else {
        hideWorkingAnimation();
        setErrorMsg("You have entered wrong credentials !!");
      }
    } catch (error) {
      hideWorkingAnimation();
      setErrorMsg("Something Went Wrong!!");
      console.error(error);
    }
  };

  return (
    <>
      {workingAnimation}
      {errrrr && (
  <p className="bg-red-600 text-white pt-2 p-2 rounded mb-4 fixed top-14 left-0 right-0 z-50 text-center flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="mr-2">
      <polygon points="12,2 22,22 2,22" fill="yellow" stroke="black" strokeWidth="2" />
      <text x="12" y="17" fontSize="12" textAnchor="middle" fill="black" fontFamily="Arial">!</text>
    </svg>
    <span>
      Permission Denied. You are not authorized to access this page. Please contact your administrator for more information.
    </span>
  </p>
)}

      <div className="max-w-full w-full px-2 sm:px-12 lg:pr-20 mb-12 lg:mb-0">
        <div className="relative">
          <div className="p-6 sm:py-8 sm:px-12 rounded-lg bg-white darks:bg-gray-800 shadow-xl">
            <Formik
              initialValues={{
                user_id: "",
                password: "",
              }}
              validationSchema={LoginSchema}
              onSubmit={(values: LoginInitialData) => {
                handleLogin(values);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <>
              
                <form onSubmit={handleSubmit}>
                  <div className="text-center">
                   
                    <h1 className="text-2xl leading-normal mb-3 font-bold text-gray-800 darks:text-gray-300 text-center">
                      Welcome Back
                    </h1>
                  </div>
                  <div className="flex flex-col mt-4 text-center">
                    <span className="text-center text-red-400">{errorMsg}</span>
                  </div>
                  <hr className="block w-12 h-0.5 mx-auto my-5 bg-gray-700 border-gray-700" />
                  <div className="mb-6">
                    <div className="mt-1 mb-6">
                      <Input
                        label="Username"
                        placeholder="Username"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.user_id}
                        error={errors.user_id}
                        touched={touched.user_id}
                        name="user_id"
                        className="border-0 focus:outline-none"
                      />
                    </div>
                    <Input
                      label="Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      error={errors.password}
                      touched={touched.password}
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="mt-1 border-0 focus:border-0 visible:border-0 focus:outline-none"

                    />
                  </div>

                  <div className="grid mt-6">
                    <Button
                      className="w-[100%] flex justify-center mt-6"
                      variant="primary"
                      buttontype="submit"
                    >
                      <svg
                        xmlnsXlink="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="inline-block w-4 h-4 ltr:mr-2 rtl:ml-2 bi bi-box-arrow-in-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
                        />
                        <path
                          fillRule="evenodd"
                          d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                        />
                      </svg>
                      Log in
                    </Button>
                  </div>
                </form> 
                </>
              )}
            </Formik>
            {/* <div className="my-2">
              <div className="flex flex-col items-center justify-center flex-wrap gapx-x-2 gap-y-2 w-full poppins">
                <span
                  className="text-gray-700 text-sm font-semibold cursor-pointer w-full text-center"
                  onClick={() => {
                    // setmobileCardStatus(true)
                  }}
                >
                  Forgot Password
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
