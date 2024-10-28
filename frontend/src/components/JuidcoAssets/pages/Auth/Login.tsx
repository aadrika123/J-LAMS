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
// import { HRMS_URL } from "@/utils/api/urls";
import { useWorkingAnimation } from "@/components/Helpers/Widgets/useWorkingAnimation";

interface LoginInitialData {
  user_id: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [workingAnimation, activateWorkingAnimation, hideWorkingAnimation] = useWorkingAnimation();

  const LoginSchema = Yup.object().shape({
    user_id: Yup.string().required("User Id is required"),
    password: Yup.string().required("Password is required"),
  });

  ///////////////// Handling Login Logics /////////////

  const handleLogin = async (values: LoginInitialData) => {
    try {
      activateWorkingAnimation();
      const res = await axios({
        url: `${process.env.backend}/api/login`,
        method: "POST",
        data: {
          email: values.user_id,
          password: values.password,
        },
      });

      const data = res.data.data;
      localStorage.setItem("user_details", JSON.stringify(data?.userDetails));
      Cookies.set("emp_id", data?.userDetails?.emp_id);

      if (data) {
        Cookies.set("accesstoken", data?.token);

        if (typeof window !== "undefined") {
          const storedData = localStorage.getItem("user_details");
          const data = storedData && JSON.parse(storedData);
          if (data?.user_type === "Municipal") {
            dispatch(login(data)), "a";
            if (typeof window !== "undefined")
              window.location.replace("/lams/apply/approve-application");
          }
          else if (data?.user_type === "Admin") {
            dispatch(login(data)), "a";
            if (typeof window !== "undefined")
              window.location.replace("/lams/apply/approve-application");
          }
          else {
            dispatch(login(data));
            if (typeof window !== "undefined")
              window.location.replace("/hrms/ems/dashboard");
          }
        }
      } else {
        hideWorkingAnimation();
        setErrorMsg("You have entered wrong credentials !!");
      }
    } catch (error) {
      hideWorkingAnimation();
      setErrorMsg("Something Went Wrong!!");
      console.log(error);
    }
  };

  return (
    <>
      {workingAnimation}
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
