/* eslint-disable @typescript-eslint/no-explicit-any */
// /***
//  * Author: Jaideep
//  * Status: Open
//  * Uses: Form details for Assets Management 
//  */

"use client"

import { InnerHeading, SubHeading } from '@/components/Helpers/Heading'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Customer from "@/assets/icons/cv 1.png";
import PrimaryButton from '@/components/Helpers/Button';
// import goBack from '@/utils/helper';
import InputBox from '@/components/Helpers/InputBox';
import toast, { Toaster } from 'react-hot-toast';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from "yup";
import SelectForNoApi from '@/components/global/atoms/SelectForNoApi';
import { ASSETS } from '@/utils/api/urls';
import axios from "@/lib/axiosConfig";
import Jhar from "@/assets/icons/jhar.png"


export const DashboardMain = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);

  // const randomNumber = Math.floor(Math.random() * 90) + 10;
  // const application_no = `ASSID${randomNumber}`;

  // const date = new Date().toLocaleDateString()

  const initialValues = {
    type_of_assets: "",
    asset_sub_category_name: "",
    assets_category_type: "",
    khata_no: "",
    plot_no: "",
    blue_print: "",
    ownership_doc: "",
    ward_no: "",
    address: "",
    depreciation_method: "Straight Line Method",
    apreciation_method: " Percentage Based Approach",
    type_of_land: "",
    area: "",
    order_no: "",
    order_date: "",
    acquisition: "",
    from_whom_acquired: "",
    mode_of_acquisition:""
  }

  const employeeValidationSchema = Yup.object().shape({
    khata_no: Yup.string().required("Khata No. is Required"),
    plot_no: Yup.string().required("Plot No. is Required"),
    type_of_assets: Yup.mixed().required("Choose Asset Category Name"),
    asset_sub_category_name: Yup.mixed().required("Choose Asset Sub Category Name"),
    assets_category_type: Yup.mixed().required("Choose Asset Category Type"),
    area: Yup.string().required("Area. is Required"),
    type_of_land: Yup.string().required("Type of Land"),
    order_no: Yup.string().required("Enter order number"),
    order_date: Yup.string().required("Enter order date"),
  });

  const handleSubmitFormik = async (values: any, { resetForm }: FormikHelpers<any>) => {
    console.log("values", values)
    try {
      const fileUploadData = await handleUpload();
      if (fileUploadData) {
        values.blue_print = fileUploadData.blue_print;
      }

      const fileUploadData2 = await handleUpload2();
      if (fileUploadData2) {
        values.ownership_doc = fileUploadData2.ownership_doc;
      }

      const res = await axios({
        url: `${ASSETS.LIST.create}`,
        method: "POST",
        data: values,
      });
      if (res?.data?.status === true) {
        toast.success("Assets successfully added");
        resetForm();
        window.location.replace("/lams/apply/approve-application");
      } else if (res?.data?.type === "DUPLICATE") {
        toast.error("Duplicate asset data found. Please check and try again.");
        }
      else {
        toast.error("Failed to add assets");
      }
    } catch (error) {
      toast.error("Failed to add Assets");
      console.error('Error submitting data:', error);
    }
  };


  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timeout);

  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#007335]"></div>
        <Image src={Jhar} alt="jhar" className="rounded-full h-28 w-28" />
      </div>
    );
  }

  // const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFile1(e.target.files?.[0] ?? null);
  // };

  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0] ?? null;

    if (!file) {
        setFile1(null);
        return;
    }

    const fileType = file.type;
    const fileSize = file.size;

    const acceptedFileTypes = ["image/png", "image/jpeg", "application/pdf"];

    if (!acceptedFileTypes.includes(fileType)) {
        alert("Please upload a PNG, JPEG, or PDF file.");
        setFile1(null);
        fileInput.value = ""; 
        return;
    }

    if (fileSize / 1024 >= 2048) {
        alert("Cannot upload more than 2MB data!");
        setFile1(null);
        fileInput.value = ""; 
        return;
    }

    setFile1(file);
};


  // const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFile2(e.target.files?.[0] ?? null);
  // };

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0] ?? null;

    if (!file) {
        setFile2(null);
        return;
    }

    const fileType = file.type;
    const fileSize = file.size;

    const acceptedFileTypes = ["image/png", "image/jpeg", "application/pdf"];

    if (!acceptedFileTypes.includes(fileType)) {
        alert("Please upload a PNG, JPEG, or PDF file.");
        setFile2(null);
        fileInput.value = ""; 
        return;
    }

    if (fileSize / 1024 >= 2048) {
        alert("Cannot upload more than 2MB data!");
        setFile2(null);
        fileInput.value = "";
        return;
    }

    setFile2(file);
};


  const handleUpload = async () => {
    if (file1) {
      const data = new FormData();
      data.append('file', file1);
      try {
        const response = await axios.post(`${ASSETS.LIST.validate}`, data);
        console.log("Response:", response);

        if (response.status === 200) {
          return {
            blue_print: response?.data?.data,
          };
        } else {
          toast.error("Failed to upload files");
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error("Error uploading files");
      }
    } else {
      console.log("not uploaded")
    }
  };


  const handleUpload2 = async () => {
    if (file2) {
      const data = new FormData();
      data.append('file', file2);
      try {
        const response = await axios.post(`${ASSETS.LIST.validate}`, data);
        console.log("Response:", response);

        if (response.status === 200) {
          return {
            ownership_doc: response?.data?.data
          };
        } else {
          toast.error("Failed to upload files");
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error("Error uploading files");
      }
    } else {
       console.log("not uploaded")
    }
  };

 const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    const lastYearDate = new Date();
    lastYearDate.setFullYear(currentDate.getFullYear() - 1);

    currentDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    lastYearDate.setHours(0, 0, 0, 0);

    if (selectedDate < lastYearDate) {
        toast.error("Please select a date within the last year or a future date!");
        return false;
    }
    return true;
 };
  
  const handleBack = () => {
   window.location.replace("/lams/apply/approve-application");
  }


  return (
    <div>
      <div className="flex items-center justify-between border-b-2 pb-7 mb-10">
        <div className="flex items-center">
          <PrimaryButton
            buttonType="button"
            variant={"cancel"}
            onClick={handleBack}
            className="border-0 bg-transparent hover:bg-transparent hover:text-[#3592FF] flex items-center"
          >
            <i>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="20"
                viewBox="0 0 25 25"
                fill="none"
              >
                <g clipPath="url(#clip0_949_7008)">
                  <path
                    d="M10.6736 7.20536L4 13.9137L10.6736 20.622C10.7339 20.7012 10.8105 20.7665 10.8981 20.8134C10.9858 20.8604 11.0826 20.888 11.1819 20.8943C11.2812 20.9007 11.3806 20.8856 11.4736 20.8501C11.5666 20.8147 11.6508 20.7597 11.7206 20.6888C11.7905 20.618 11.8443 20.533 11.8784 20.4395C11.9125 20.3461 11.9262 20.2464 11.9184 20.1472C11.9107 20.048 11.8817 19.9517 11.8335 19.8646C11.7853 19.7776 11.7189 19.702 11.6389 19.6429L6.64583 14.6081H19.9306C20.1147 14.6081 20.2914 14.535 20.4216 14.4047C20.5518 14.2745 20.625 14.0979 20.625 13.9137C20.625 13.7295 20.5518 13.5529 20.4216 13.4227C20.2914 13.2924 20.1147 13.2193 19.9306 13.2193H6.64583L11.6389 8.18453C11.7687 8.05376 11.8413 7.87677 11.8407 7.69249C11.84 7.50821 11.7662 7.33174 11.6354 7.20189C11.5047 7.07205 11.3277 6.99946 11.1434 7.00012C10.9591 7.00077 10.7826 7.0746 10.6528 7.20536H10.6736Z"
                    fill="#665DD9"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_949_7008">
                    <rect
                      width="25"
                      height="25"
                      fill="white"
                      transform="matrix(0 -1 1 0 0 25)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </i>
            Back
          </PrimaryButton>
        </div>
        <div>
          <InnerHeading className="mx-5 my-5 mb-0 text-2xl">
            Asset Registration
          </InnerHeading>
        </div>
      </div>

      <div className="border rounded-lg bg-white border-[#D9E4FB] p-10 px-10 pb-30 pt-20 shadow-md">
        <div className="flex justify-between mb-10">
          <SubHeading>
            <Image src={Customer} alt="employee" width={40} height={20} />
            <span className="ml-2">Asset Registration</span>
          </SubHeading>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={employeeValidationSchema}
          onSubmit={handleSubmitFormik}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
          }) => (
            <form onSubmit={handleSubmit} className="relative">
              <Toaster />
              <div className="grid grid-cols-2 2xl:grid-cols-3 gap-x-6 gap-4 ">

                {/* ------------------------------------------------------- */}

                <SelectForNoApi
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.type_of_assets}
                  error={errors.type_of_assets}
                  touched={touched.type_of_assets}
                  label="Asset Category Name"
                  name="type_of_assets"
                  required={true}
                  placeholder={"Choose Asset Category Name"}
                  options={[
                    
                    {
                      id: 1,
                      name: "Building",
                    },
                    {
                      id: 2,
                      name: "Drainage",
                    },
                    {
                      id: 3,
                      name: "Gym",
                    },
                    {
                      id: 4,
                      name: "Hall",
                    },
                    {
                      id: 5,
                      name: "Others",
                    }
                  ]}
                />
                {values?.type_of_assets === 'Drainage' &&  (
                  <>
                  <SelectForNoApi
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.asset_sub_category_name}
                  error={errors.asset_sub_category_name}
                  touched={touched.asset_sub_category_name}
                  label="Asset Sub-Category Name"
                  name="asset_sub_category_name"
                  required={true}
                  placeholder={"Choose Asset Sub Category Name"}
                  options={[
                    
                    {
                      id: 1,
                      name: "Core Asset Drainage",
                    },
                   
                  ]}
                />
                  </>
                )}

                {values?.type_of_assets !== 'Drainage' && (
                  <SelectForNoApi
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.asset_sub_category_name}
                  error={errors.asset_sub_category_name}
                  touched={touched.asset_sub_category_name}
                  label="Asset Sub-Category Name"
                  name="asset_sub_category_name"
                  required={true}
                  placeholder={"Choose Asset Sub Category Name"}
                  options={[
                    {
                      id: 1,
                      name: "Hospitals",
                    },
                    {
                      id: 2,
                      name: "Library",
                    },
                    {
                      id: 3,
                      name: "Parking",
                    }
                  ]}
                />
                )}

                <SelectForNoApi
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.assets_category_type}
                  error={errors.assets_category_type}
                  touched={touched.assets_category_type}
                  label="Asset Category Type"
                  name="assets_category_type"
                  required={true}
                  placeholder={"Choose Asset Category Name"}
                  options={[
                    {
                      id: 1,
                      name: "Immovable",
                    },
                    // {
                    //   id: 2,
                    //   name: "Movable",
                    // },
                    {
                      id: 2,
                      name: "Land",
                    }
                  ]}
                />

                <InputBox
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.khata_no}
                  error={errors.khata_no}
                  touched={touched.khata_no}
                  label="Khata No."
                  name="khata_no"
                  type="text"
                  required={true}
                  placeholder={"Enter Khata No."}
                  maxLength={10}
                />

                <InputBox
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.plot_no}
                  error={errors.plot_no}
                  touched={touched.plot_no}
                  label="Plot No."
                  placeholder={"Enter Plot No."}
                  name="plot_no"
                  type="text"
                  required={true}
                  maxLength={10}
                  onKeyPress={(e: any) => {
                    if (!(e.key >= "0" && e.key <= "9")) {
                      e.preventDefault();
                    }
                  }}
                />

                <div>
                  <label>Blue print</label>
                  <input
                    type='file'
                    name='blue_print'
                    className="mb-4 p-1 border border-slate-400 w-full rounded"
                    onChange={handleFile1Change}
                    
                  />
                  {/* <ErrorMessage name="blue_print" component="div" className="text-red-500 text-md mt-[-8px]" /> */}

                </div>
                <div>
                  <label>Ownership Documents </label>

                  <input
                    type='file'
                    name='ownership_doc'
                    className="mb-4 p-1 border border-slate-400 w-full rounded"
                    onChange={handleFile2Change}
                  />
                  {/* <ErrorMessage name="ownership_doc" component="div" className="text-red-500 text-md mt-[-8px]" /> */}

                </div>

                <InputBox
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.ward_no}
                  label="Ward No."
                  placeholder={"Enter Your Ward No."}
                  name="ward_no"
                  type="text"
                  maxLength={15}
                  onKeyPress={(e: any) => {
                    if (
                      !(
                        (e.key >= "a" || e.key >= "z") ||
                        (e.key <= "A" || e.key <= "Z") ||
                        (e.key <= "0" || e.key <= "9") ||
                        e.key === " "
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                />

                <SelectForNoApi
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.type_of_land}
                  error={errors.type_of_land}
                  touched={touched.type_of_land}
                  label="Type of Land"
                  name="type_of_land"
                  required={true}
                  placeholder={"Choose Type of Land"}
                  options={[
                    {
                      id: 1,
                      name: "Commercial Land",
                    },
                    {
                      id: 2,
                      name: "Residential Land",
                    }
                  ]}
                />

                <InputBox
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.area}
                  error={errors.area}
                  touched={touched.area}
                  label="Area"
                  name="area"
                  type="text"
                  placeholder={"in sqft."}
                  required={true}
                  maxLength={10}
                  onKeyPress={(e: any) => {
                    if (
                      !(
                        (e.key <= "0" || e.key <= "9")
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                />

                <InputBox
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.order_no}
                  error={errors.order_no}
                  touched={touched.order_no}
                  label="Order No."
                  name="order_no"
                  type="text"
                  placeholder={"Enter order no."}
                  required={true}
                   maxLength={10}
                  onKeyPress={(e: any) => {
                    if (
                      !(
                        (e.key <= "0" || e.key <= "9")
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
                
                <InputBox
                  // onChange={handleChange}
                  onChange={(e) => {
                     if (handleDateChange(e as any)) {
                        handleChange(e);
                     }
                   }}
                  onBlur={handleBlur}
                  error={errors.order_date}
                  touched={touched.order_date}
                  value={values.order_date}
                  label="Order Date"
                  name="order_date"
                  type="date"
                  placeholder={"Enter order date"}
                  required={true}
                  onKeyPress={(e: any) => {
                    if (
                      (
                        (e.key >= "a" || e.key >= "z") ||
                        (e.key <= "A" || e.key <= "Z") ||
                        (e.key <= "0" || e.key <= "9") ||
                        e.key === " "
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                />

                <InputBox
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.address}
                  label="Address"
                  placeholder={"Enter Your Address"}
                  name="address"
                  type="text"
                  maxLength={100}
                  onKeyPress={(e: any) => {
                    if (
                      !(
                        (e.key >= "a" || e.key >= "z") ||
                        (e.key <= "A" || e.key <= "Z") ||
                        (e.key <= "0" || e.key <= "9") ||
                        e.key === " "
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                />

                <InputBox
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.acquisition}
                  label="Date of Acquisition"
                  placeholder={"Enter Your Acquisition"}
                  name="acquisition"
                  type="date"
                   onKeyPress={(e: any) => {
                    if (
                      (
                        (e.key >= "a" || e.key >= "z") ||
                        (e.key <= "A" || e.key <= "Z") ||
                        (e.key <= "0" || e.key <= "9") ||
                        e.key === " "
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                />

                  <SelectForNoApi
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.mode_of_acquisition}
                  label="Mode of Acquisition"
                  name="mode_of_acquisition"
                  placeholder={"Choose mode of Acquisition"}
                  options={[
                    {
                      id: 1,
                      name: "Acquired",
                    },
                    {
                      id: 2,
                      name: "Construction",
                    },
                    {
                      id: 3,
                      name: "Donation",
                    },
                    {
                      id: 4,
                      name: "Purchase",
                    },
                    {
                      id: 5,
                      name: "Tender",
                    },
                    {
                      id: 6,
                      name: "Others",
                    }
                  ]}
                />

                <InputBox
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.from_whom_acquired}
                  label="From whom Acquired"
                  placeholder={"From whom Acquired"}
                  name="from_whom_acquired"
                  type="text"
                />

                {values?.assets_category_type === 'Land' ? (
                  <>
                    <InputBox
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.apreciation_method}
                      // error={errors.apreciation_method}
                      // touched={touched.apreciation_method}
                      label="Apreciation Method"
                      placeholder={"Enter Apreciation Method"}
                      name="apreciation_method"
                      type="text"
                      isReadOnly={true}
                      maxLength={30}
                      onKeyPress={(e: any) => {
                        if (
                          !(
                            (e.key >= "a" || e.key >= "z") ||
                            (e.key <= "A" || e.key <= "Z") ||
                            e.key === " "
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    /></>
                ) : (
                  <InputBox
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.depreciation_method}
                    // error={errors.depreciation_method}
                    // touched={touched.depreciation_method}
                    label="Depreciation Method"
                    placeholder={"Enter Depreciation Method"}
                    name="depreciation_method"
                    type="text"
                    isReadOnly={true}
                  />
                )
                }
              </div>

              <div className="flex items-center justify-end mt-5 gap-5">
               <PrimaryButton
                  onClick={handleReset}
                  buttonType="button"
                  variant={"cancel"}
                >
                  Reset
                </PrimaryButton>
                      
                <PrimaryButton buttonType="submit" variant="primary">
                  Save
                </PrimaryButton>

              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}