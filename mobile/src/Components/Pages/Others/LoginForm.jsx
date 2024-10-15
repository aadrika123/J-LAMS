import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');

  // Creating schema
  const schema = Yup.object().shape({
    email: Yup.string()
      .required("Email is a required field")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is a required field")
      .min(4, "Password must be at least 4 characters"),
  });

  const handleLogin = async (values) => {
    console.log("val", values)
    try {
      const res = await axios({
        url: `https://aadrikainfomedia.com/auth/api/login`,
        method: "POST",
        data: {
          email: values.email,
          password: values.password,
        },
      });

      const data = res.data.data;
      sessionStorage.setItem("user_details", JSON.stringify(data?.userDetails));

      if (data) {
        if (typeof window !== "undefined") {
          const storedData = sessionStorage.getItem("user_details");
          const userDetails = storedData && JSON.parse(storedData);
          setUserType(userDetails?.user_type);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
      navigate("/field-officer");
  }, [userType, navigate]);

  return (
    <div>
      <div className="max-w-full w-full px-2 sm:px-12 lg:pr-20 mb-12 lg:mb-0">
        <div className="relative">
          <div className="p-6 sm:py-8 sm:px-12 rounded-lg bg-white darks:bg-gray-800 shadow-xl">
            <div className="App">
              <center>
                <h1 className='text-black font-bold text-2xl my-5'>Welcome Back</h1>
                <Formik
                  validationSchema={schema}
                  initialValues={{ email: "", password: "" }}
                  onSubmit={(values) => {
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
                    <div className="login">
                      <div className="form">
                        <form noValidate onSubmit={handleSubmit}>
                          <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            placeholder="Enter email id"
                            className="form-control inp_text border p-2 w-full"
                            id="email"
                          />
                          <p className="error text-red-600">
                            {errors.email && touched.email && errors.email}
                          </p>

                          <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            placeholder="Enter password"
                            className="form-control border p-2 mt-4 w-full"
                          />
                          <p className="error text-red-600">
                            {errors.password && touched.password && errors.password}
                          </p>
                          <button type="submit" className='bg-[#4338CA] rounded-xl w-full text-white p-3 mt-5'>Login</button>
                        </form>
                      </div>
                    </div>
                  )}
                </Formik>
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
