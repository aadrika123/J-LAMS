import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import "./login.css";
import { RotatingLines } from "react-loader-spinner";
import ProjectApiList from "@/Components/api/ProjectApiList";
import axios from "axios";
import {Login1} from "@/Components/temp.js"
import {
  getLocalStorageItem,
  setLocalStorageItem,

} from "@/Components/Common/localstorage";
import Lottie from "react-lottie";



const { api_login } = ProjectApiList();

const validationSchema = Yup.object({
  username: Yup.string().required("Enter Username"),
  password: Yup.string().required("Enter Password"),
});

function Login() {

  const [loaderStatus, setLoaderStatus] = useState(false);

  const [userDetails, setUserDetails] = useState();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: () => {
      authUser();
    },
    validationSchema,
  });

  const navigate = useNavigate();

  useEffect(() => {
    getLocalStorageItem("token") != "null" &&
      getLocalStorageItem("token") != null &&
      navigate("/field-officer");
  }, [navigate]);

  const header = {
    headers: {
      Accept: "application/json",
    },
  };

  const authUser = async () => {
    setLoaderStatus(true);
    let requestBody = {
      email: formik.values.username,
      password: formik.values.password,
      type:"mobile"
    };

    await axios.post(api_login, requestBody, header)

      .then(function (response) {
        console.log("message check login ", response.data);

        const data = response.data.data;
        localStorage.setItem("user_details", JSON.stringify(data?.userDetails));

        // if (response?.data?.status === true && response?.data?.data?.userDetails?.user_type === "Field Officer") {
          if (response?.data?.status === true && response?.data?.data?.userDetails?.user_type === "TC") {
          setLocalStorageItem("token", response?.data?.data?.token);
          navigate("/field-officer");
          toast.success("Login Successful");

        } else {
          console.log("Login failed or user is not a Field Officer...");
          setLoaderStatus(false);
          toast.error("error occured");
        }

      })
      .catch(function (error) {
        setLoaderStatus(false);
        console.log("--2--login error...", error);
        toast.error("Server Error");
      });
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user_details");
      if (data) {
        try {
          const userDetails = JSON.parse(data);
          setUserDetails(userDetails);
        } catch (e) {
          console.error("Error parsing user_details from sessionStorage:", e);
        }
      } else {
        console.warn("No user_details found in sessionStorage.");
      }
    }
  }, []);

  const loginAnimation = {
    loop: true,
    autoplay: true,
    animationData: Login1,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>


      <header className="py-5 border-b border-gray-200 h-auto  bg-white  dark:bg-gray-800 dark:border-gray-800">
        <div className="container mx-auto xl:max-w-6xl px-4">
          {/* Navbar */}
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <a className="text-xl">
              <span className="font-bold text-xl uppercase">
                Land and Asset Management Systems
              </span>
            </a>
          </nav>
        </div>
      </header>



      <main className='h-[90vh] bg-gray-100 flex justify-center items-center'>
        <div className=' bg-gray-100 darks:bg-gray-900 darks:bg-opacity-40'>
          <div className='container mx-auto px-4 xl:max-w-6xl '>
            <div className='flex flex-wrap -mx-4 flex-row '>
              <div className='flex-shrink max-w-full px-4 w-full lg:w-1/2  mt-[2rem]'>
                {/* login form */}
                <div className='max-w-full w-full px-2 sm:px-12 lg:pr-20 mb-12 lg:mb-0  '>
                  <div className='relative'>
                    <div className='p-6 sm:py-8 sm:px-12 rounded-lg bg-white darks:bg-gray-800 shadow-xl'>
                      <form onSubmit={formik.handleSubmit}>
                        <div className='text-center'>
                          <h1 className='text-2xl leading-normal mb-3 font-bold text-gray-800 darks:text-gray-300 text-center'>
                            Welcome Back
                          </h1>
                        </div>
                        <hr className='block w-12 h-0.5 mx-auto my-5 bg-gray-700 border-gray-700' />
                        <div className='mb-6'>
                          <label
                            htmlFor='inputemail'
                            className='inline-block mb-2'
                          >
                            Username
                          </label>
                          <input
                            {...formik.getFieldProps("username")}
                            className='w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 darks:text-gray-300 darks:bg-gray-700 darks:border-gray-700 darks:focus:border-gray-600'
                            defaultValue
                            aria-label='email'
                            type='email'
                            required
                          />
                          <span className='text-red-600 text-xs'>
                            {formik.touched.username && formik.errors.username
                              ? formik.errors.username
                              : null}
                          </span>
                        </div>
                        <div className='mb-6'>
                          <div className='flex flex-wrap flex-row'>
                            <div className='flex-shrink max-w-full w-1/2'>
                              <label
                                htmlFor='inputpass'
                                className='inline-block mb-2'
                              >
                                Password
                              </label>
                            </div>
                          </div>
                          <input
                            {...formik.getFieldProps("password")}
                            className='w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 darks:text-gray-300 darks:bg-gray-700 darks:border-gray-700 darks:focus:border-gray-600'
                            aria-label='password'
                            type='password'
                            defaultValue
                            required
                          />
                          <span className='text-red-600 text-xs'>
                            {formik.touched.password && formik.errors.password
                              ? formik.errors.password
                              : null}
                          </span>
                        </div>

                        <div className='grid'>
                          {loaderStatus ? (
                            <div className='flex justify-center'>
                              <RotatingLines
                                strokeColor='grey'
                                strokeWidth='5'
                                animationDuration='0.75'
                                width='25'
                                visible={true}
                              />
                            </div>
                          ) : (
                            <button
                              type='submit'
                              className='py-2 px-4 inline-block text-center rounded leading-normal text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0'
                            >
                              <svg
                                xmlnsXlink='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                className='inline-block w-4 h-4 ltr:mr-2 rtl:ml-2 bi bi-box-arrow-in-right'
                                viewBox='0 0 16 16'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z'
                                />
                                <path
                                  fillRule='evenodd'
                                  d='M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z'
                                />
                              </svg>
                              Login
                            </button>
                          )}
                        </div>
                      </form>
                      {/* =========buttons for change and reset password========= */}
                      <div className='my-4'>
                        <div className='flex flex-col items-center justify-center flex-wrap gapx-x-2 gap-y-2 w-full poppins'>

                          {/* <span className='text-gray-700 text-sm font-semibold cursor-pointer w-full text-center' onClick={() => setchange(true)}>Change Password</span> */}
                        </div>
                        {/* <p className="text-center mb-2">Don't have an account? <a className="hover:text-indigo-500" href="#">Register</a></p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex-shrink max-w-full px-4 w-full lg:w-1/2'>
                <div className='text-center mt-6 lg:mt-0'>
                  {/* <img src={img} alt="welcome" className="max-w-full h-auto mx-auto" /> */}
                  {/* <img src="https://res.cloudinary.com/djkewhhqs/image/upload/v1708499439/JUIDCO_IMAGE/Juidco%20svg%20file/Trade_Blue_4_qy3kj6.svg" alt="welcome" className="w-full h-72" /> */}

                  {/* <Lottie options={loginAnimation} height={400} width={500} /> */}
                  <Lottie
                    options={loginAnimation}
                    height={window.innerWidth < 768 ? 200 : 400} // Adjust height based on screen width
                    width={window.innerWidth < 768 ? 300 : 500}  // Adjust width based on screen width
                  />

             
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className=' h-[10vh] bg-white py-6 border-t border-gray-200 darks:bg-gray-800 darks:border-gray-800'>
        <div className='container mx-auto px-4 xl:max-w-6xl '>
          <div className='mx-auto px-4'>
            <div className='flex flex-wrap flex-row -mx-4'>
              <div className='flex-shrink max-w-full px-4 w-full md:w-1/2 text-center md:ltr:text-left md:rtl:text-right'>
                <ul className='ltr:pl-0 rtl:pr-0 space-x-4'>
                  <li className='inline-block ltr:mr-3 rtl:ml-3'>
                    <a className='hover:text-indigo-500' href='#'>
                      Support |
                    </a>
                  </li>
                  <li className='inline-block ltr:mr-3 rtl:ml-3'>
                    <a className='hover:text-indigo-500' href='#'>
                      Help Center |
                    </a>
                  </li>
                  <li className='inline-block ltr:mr-3 rtl:ml-3'>
                    <a className='hover:text-indigo-500' href='#'>
                      Privacy |
                    </a>
                  </li>
                  <li className='inline-block ltr:mr-3 rtl:ml-3'>
                    <a className='hover:text-indigo-500' href='#'>
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
              <div className='flex-shrink max-w-full px-4 w-full md:w-1/2 text-center md:ltr:text-right md:rtl:text-left'>
                <p className='mb-0 mt-3 md:mt-0'>
                  <a href='#' className='hover:text-indigo-500'>
                    {/* {`${ulb_data().ulb_name}`} */}
                    UD&HD
                  </a>{" "}
                  | All right reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Login;


// import React from 'react';
// import LoginForm from './LoginForm';

// const Login = () => {
//   return (
//     <div>

//       <div className="h-screen border-2 border-red-200 flex flex-col justify-between bg-gray-100 darks:bg-gray-900 border-b darks:bg-opacity-40">
//         <header className="border-b border-gray-200  bg-white darks:bg-white-600 darks:border-gray-800 text-black">
//           <div className="container mx-auto xl:max-w-6xl py-2">
//             {/* Navbar */}
//             <nav
//               className="flex flex-row flex-nowrap items-center justify-between mt-0 py-2 px-6"
//               id="desktop-menu"
//             >
//               {/* logo */}
//               <a className="flex items-center py-2 ltr:mr-4 rtl:ml-4 text-xl">
//                 <div className="flex flex-col">
//                   <div>
//                     <span className="font-bold text-xl uppercase">
//                      Land and Asset Management System
//                     </span>
//                     <span className="text-lg opacity-0">s</span>
//                     <span className="hidden text-gray-700 darks:text-gray-200">
//                       {/* {data?.brand_tag == "AMC" ? "AMC" : "JUIDCO"} */}
//                     </span>
//                   </div>
//                 </div>
//               </a>
//               {/* menu , curantaly: Unavailable */}
//             </nav>
//           </div>
//         </header>

//         <main>
//           <div className=" md:py-12 bg-gray-100 darks:bg-gray-900 darks:bg-opacity-40">
//             <div className="container mx-auto px-4 xl:max-w-6xl">
//               <div className="flex flex-wrap -mx-4 flex-row ">
//                 <div className="flex-shrink max-w-full px-4 w-full lg:w-1/2">
//                   <LoginForm />
//                 </div>
//                 <div className="flex-shrink max-w-full px-4 w-full lg:w-1/2">
//                   <div className="text-center  lg:mt-0">
//                     <div className="relative">
//                       {/* <Lottie
//                           animationData={img}
//                           loop={true}
//                           className="m-0 w-full"
//                         /> */}
//                       <div className="absolute top-2/4 ">
//                         {/* <Lottie
//                           animationData={img}
//                           loop={true}
//                           className="m-0 w-full"
//                         /> */}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>

//         <footer className="bg-white border-t p-6 border-gray-200 darks:bg-gray-800 darks:border-gray-800 text-black">
//           <div className="container mx-auto px-4 xl:max-w-6xl ">
//             <div className="mx-auto px-4">
//               <div className="flex flex-wrap flex-row -mx-4">
//                 <div className="flex-shrink  max-w-full px-4 w-full md:w-1/2 text-center md:ltr:text-left md:rtl:text-right">
//                   <ul className="ltr:pl-0 rtl:pr-0 space-x-4">
//                     <li className="inline-block ltr:mr-3 rtl:ml-3">
//                       <a className="hover:text-indigo-500" href="#">
//                         Support |
//                       </a>
//                     </li>
//                     <li className="inline-block ltr:mr-3 rtl:ml-3">
//                       <a className="hover:text-indigo-500" href="#">
//                         Help Center |
//                       </a>
//                     </li>
//                     <li className="inline-block ltr:mr-3 rtl:ml-3">
//                       <a className="hover:text-indigo-500" href="#">
//                         Privacy |
//                       </a>
//                     </li>
//                     <li className="inline-block ltr:mr-3 rtl:ml-3">
//                       <a className="hover:text-indigo-500" href="#">
//                         Terms of Service
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//                 <div className="flex-shrink max-w-full px-4 w-full md:w-1/2 text-center md:ltr:text-right md:rtl:text-left">
//                   <p className="mb-0 mt-3 md:mt-0">
//                     <a href="#" className="hover:text-indigo-500">
//                       UD&HD
//                     </a>{" "}
//                     | All right reserved
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   )
// }

// export default Login
