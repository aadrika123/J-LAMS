/* eslint-disable @typescript-eslint/no-explicit-any */
// /***
//  * Author: Jaideep
//  * Status: Open
//  * Uses:  Details for Assets Management Approval Application View
//  */

"use client"

import React, { useEffect, useState } from 'react'
import { InnerHeading, SubHeading } from '@/components/Helpers/Heading'
import Image from 'next/image'
import Home from "@/assets/icons/home-address.png";
import Home2 from "@/assets/icons/home-address 1 (1).png";
import Home3 from "@/assets/icons/home-address 3.png";
import axios from "@/lib/axiosConfig";
import { ASSETS } from '@/utils/api/urls';
import { useQuery } from '@tanstack/react-query';
import PrimaryButton from '@/components/Helpers/Button';
import goBack from '@/utils/helper';
import InputBox from '@/components/Helpers/InputBox';
import SelectForNoApi from '@/components/global/atoms/SelectForNoApi';
import { Formik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
// import { useLocation } from 'react-router-dom';
import { useSearchParams } from 'next/navigation'


const View = ({ id }: { id: number }) => {
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams);
    const status = params.get('status');


    const [isOpen, setIsOpen] = useState(false);
    const [ulbId, setUlbId] = useState<string>("");
    const [ulbName, setUlbName] = useState<string>("");
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);


    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const fetchData = async () => {
        try {
            const res = await axios({
                url: `${ASSETS.LIST.getById}?id=${id}`,
                method: "GET",
            });
            return res.data?.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    };

    const dataUpdate = async (values: any) => {
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
                url: `${ASSETS.LIST.update}?id=${id}`,
                method: "POST",
                data: {
                    id,
                    ...values
                }
            });

            if (res?.data?.status === 201) {
                toast.success("Assets successfully updated");
                setIsOpen(false);
                window.location.reload()
                return res.data?.data;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    };



    useEffect(() => {
        if (typeof window !== "undefined") {
            const user_det = sessionStorage.getItem("user_details");
            if (user_det) {
                const ulb_id = JSON.parse(user_det as string)?.ulb_id;
                setUlbId(ulb_id);
            }
        }
    }, [ulbId]);

    useEffect(() => {
        const fetchData = async (ulbId: any) => {
            try {
                const res = await axios({
                    url: `${ASSETS.LIST.getAll}?id=${ulbId}`,
                    method: 'GET',
                });
                const ulbName = res.data?.data?.data[0]?.ulb_name || 'not found';
                setUlbName(ulbName);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (ulbId) {
            fetchData(ulbId);
        }
    }, [ulbId]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const updatedData = await dataUpdate(id);
                if (updatedData) {
                    toast.success("Assets successfully updated");
                    setIsOpen(false);
                }
            } catch (error) {
                console.error("Error updating data:", error);
            }
        };

        if (data?.status === 201) {
            fetchData();
        }
    }, []);


    const { isLoading, error, data } = useQuery({
        queryKey: ['assets'],
        queryFn: fetchData,
        staleTime: 1000,
    });

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 flex justify-center items-center min-h-screen">
                <div className="relative">
                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-ping"></div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (error) return <div>Error: {error.message}</div>

    const initialValues = {
        type_of_assets: data?.data?.type_of_assets,
        asset_sub_category_name: data?.data?.asset_sub_category_name,
        assets_category_type: data?.data?.assets_category_type,
        khata_no: data?.data?.khata_no,
        plot_no: data?.data?.plot_no,
        blue_print: data?.data?.blue_print,
        ownership_doc: data?.data?.ownership_doc,
        ward_no: data?.data?.ward_no,
        address: data?.data?.address,
        depreciation_method: "Straight Line Method",
        apreciation_method: "Percentage Based Approach",
        type_of_land: data?.data?.type_of_land,
        area: data?.data?.area,
        order_date: data?.data?.order_date,
        order_no: data?.data?.order_no,
    }

    const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile1(e.target.files?.[0] ?? null);
    };

    const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile2(e.target.files?.[0] ?? null);
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

    return (
        <div>
            <Toaster />
            <div className="flex items-center justify-between border-b-2 pb-7 mb-10">
                <div className="flex items-center">
                    <PrimaryButton
                        buttonType="button"
                        variant={"cancel"}
                        onClick={goBack}
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


            </div>

            <div>
                <div className="flex justify-end animate-pulse">

                    {status && status == 'clicked' && (
                        <PrimaryButton buttonType="submit" variant="primary" onClick={togglePopup}>Update</PrimaryButton>
                    )}

                </div>
                {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-50 pt-10">
                        <div className="bg-white p-16 rounded-lg h-auto bg-opacity-100 relative z-50">
                            <button
                                className="mt-12 px-4 py-2 flex mb-5 bg-red-500 text-white rounded-md ml-auto"
                                onClick={togglePopup}
                            >
                                Close
                            </button>

                            <Formik
                                initialValues={initialValues}
                                onSubmit={(values) => dataUpdate(values)}
                            >
                                {({
                                    values,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                }) => (
                                    <form onSubmit={handleSubmit} className="relative">

                                        <div className="grid grid-cols-2 2xl:grid-cols-3 gap-x-6 gap-4 ">

                                            {/* ------------------------------------------------------- */}

                                            <SelectForNoApi
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.type_of_assets}
                                                label="Asset Category Name"
                                                name="type_of_assets"
                                                placeholder={"Choose Asset Category Name"}
                                                options={[
                                                    {
                                                        id: 1,
                                                        name: "Bin",
                                                    },
                                                    {
                                                        id: 2,
                                                        name: "Building",
                                                    },
                                                    {
                                                        id: 3,
                                                        name: "Drainage",
                                                    },
                                                    {
                                                        id: 4,
                                                        name: "Gym",
                                                    },
                                                    {
                                                        id: 5,
                                                        name: "Hall",
                                                    },
                                                    {
                                                        id: 6,
                                                        name: "Others",
                                                    }
                                                ]}
                                            />

                                            <SelectForNoApi
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.asset_sub_category_name}
                                                label="Asset Sub-Category Name"
                                                name="asset_sub_category_name"
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

                                            <SelectForNoApi
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.assets_category_type}
                                                label="Asset Category Type"
                                                name="assets_category_type"
                                                placeholder={"Choose Asset Category Name"}
                                                options={[
                                                    {
                                                        id: 1,
                                                        name: "Immovable",
                                                    },
                                                    // {
                                                    //     id: 2,
                                                    //     name: "Movable",
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
                                                label="Khata No."
                                                name="khata_no"
                                                type="text"
                                                placeholder={"Enter Khata No."}
                                                maxLength={10}

                                            />

                                            <InputBox
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.plot_no}
                                                label="Plot No."
                                                placeholder={"Enter Plot No."}
                                                name="plot_no"
                                                type="text"
                                                maxLength={10}
                                                onKeyPress={(e: any) => {
                                                    if (!(e.key >= "0" && e.key <= "9")) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />

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
                                            {/* Type of Land */}
                                            <SelectForNoApi
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.type_of_land}
                                                label="Type of Land"
                                                name="type_of_land"
                                                placeholder={"Choose Type of Land"}
                                                options={[
                                                    {
                                                        id: 1,
                                                        name: "Commercial Land",
                                                    },
                                                    {
                                                        id: 2,
                                                        name: "esidential Land",
                                                    }
                                                ]}
                                            />

                                            <InputBox
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.area}
                                                label="Area"
                                                name="area"
                                                type="text"
                                                placeholder={"in sqft."}
                                            />

                                            <InputBox
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.order_no}
                                                label="Order No."
                                                name="order_no"
                                                type="text"
                                            />

                                            <InputBox
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.order_date}
                                                label="Order Date"
                                                name="order_date"
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

                                            <div>
                                                <label>Blue Print</label>
                                                <input
                                                    type='file'
                                                    name='blue_print'
                                                    className="mb-4 p-1 border border-slate-400 w-full rounded"
                                                    onChange={handleFile2Change}

                                                />
                                                {data?.data?.blue_print === null ? <p className='text-[#4338CA] font-bold'> No image found</p>
                                    : <img src={data?.data?.blue_print} alt="img" width="100" height="30" />
                                }
                                                {/* <img src={data?.data?.blue_print} alt="img" width="20" height="20" /> */}
                                            </div>

                                            <div>
                                                <label>OwnerShip Doc</label>
                                                <input
                                                    type='file'
                                                    name='ownership_doc'
                                                    className="mb-4 p-1 border border-slate-400 w-full rounded"
                                                    onChange={handleFile1Change}

                                                />
                                                
                                                    {data?.data?.ownership_doc === null ? <p className='text-[#4338CA] font-bold'> No image found</p>
                                    : <img src={data?.data?.ownership_doc} alt="img" width="100" height="30" />
                                }
                                                {/* <img src={data?.data?.ownership_doc} alt="img" width="20" height="20" /> */}
                                            </div>

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

                                            {values.assets_category_type === 'Land' ? (
                                                <>
                                                    <InputBox
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.apreciation_method}
                                                        label="Apreciation Method"
                                                        placeholder={"Enter Apreciation Method"}
                                                        name="apreciation_method"
                                                        type="text"
                                                    /></>
                                            ) : (
                                                <InputBox
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.depreciation_method}
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

                                            <PrimaryButton buttonType="submit" variant="primary">
                                                Save
                                            </PrimaryButton>

                                        </div>
                                    </form>
                                )}
                            </Formik>

                        </div>
                    </div>
                )}
            </div>


            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-b-2 pb-4 p-10 h-auto mb-4 shadow-md">
                <div className="flex justify-between mb-10">
                    <SubHeading>
                        <Image src={Home} alt="employee" width={40} height={20} />
                        <span className="ml-3 w-[30rem]">Asset & Land Address Details</span>
                    </SubHeading>
                </div>
                <div></div>
                <div></div>

                <div>
                    <InnerHeading>ULB Name</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{ulbName}</p>
                </div>

                <div>
                    <InnerHeading>Ward No.</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.ward_no === null ? <>No data found </> : <>{data?.data?.ward_no}</>}</p>
                </div>

                <div>
                    <InnerHeading>Asset Type</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.type_of_assets === null ? <>No data found</> : <>{data?.data?.type_of_assets}</>}</p>
                </div>

                <div className=''>
                    <InnerHeading>Address</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.address === null ? <>No data found </> : <>{data?.data?.address}</>}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-b-2 pb-4 p-10 h-auto mb-3 shadow-md">
                <SubHeading>
                    <Image src={Home2} alt="employee" width={40} height={20} />
                    <span className="ml-3">Asset order Detail</span>
                </SubHeading>

                <div></div>
                <div></div>

                <div>
                    <InnerHeading>Order Number</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.order_no === null ? <>No data found </> : <>{data?.data?.order_no}</>}</p>
                </div>

                <div>
                    <InnerHeading>Order Date</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.order_date === null ? <>No data found </> : <>{data?.data?.order_date}</>}</p>
                </div>

            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-b-2 pb-4 p-10 h-auto  shadow-md">
                <SubHeading>
                    <Image src={Home3} alt="employee" width={40} height={20} />
                    <span className="ml-3">Asset Detail</span>
                </SubHeading>

                <div></div>
                <div></div>

                <div>
                    <InnerHeading>Asset Category Name</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.type_of_assets === null ? <>No data found </> : <>{data?.data?.type_of_assets}</>}</p>
                </div>

                <div>
                    <InnerHeading>Asset Sub-Category Name</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.asset_sub_category_name === null ? <>No data found </> : <>{data?.data?.asset_sub_category_name}</>}</p>
                </div>

                <div>
                    <InnerHeading>Asset Category Type</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.assets_category_type === null ? <>No data found </> : <>{data?.data?.assets_category_type}</>}</p>
                </div>

                <div>
                    <InnerHeading>Area</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.area === null ? <>No data found </> : <>{data?.data?.area}</>}</p>
                </div>

                <div>
                    <InnerHeading>Khata No.</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.khata_no === null ? <>No data found </> : <>{data?.data?.khata_no}</>}</p>
                </div>

                <div>
                    <InnerHeading>Plot No.</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.plot_no === null ? <>No data found </> : <>{data?.data?.plot_no}</>}</p>
                </div>

                <div>
                    <InnerHeading>Ward No.</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.ward_no === null ? <>No data found </> : <>{data?.data?.ward_no}</>}</p>
                </div>

                <div>
                    <InnerHeading>Type of Land</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.type_of_land === null ? <>No data found </> : <>{data?.data?.type_of_land}</>}</p>
                </div>

                <div>
                    <InnerHeading>Method of Depreciation</InnerHeading>
                    <p className='text-[#4338CA] mt-4 font-bold'>{data?.data?.depreciation_method === null ? <>No data found </> : <>{data?.data?.depreciation_method}</>}</p>
                </div>

                <div></div>

                <div>
                    <InnerHeading>OwnerShip Document</InnerHeading>
                    <div className='flex'>
                        {data?.data?.ownership_doc?.endsWith('.pdf') ? (
                            <>
                                {data?.data?.ownership_doc === null ? <p className='text-[#4338CA] mt-4 font-bold'> No image found</p> :
                                    <iframe src={data?.data?.ownership_doc}></iframe>
                                }
                            </>
                        ) : (
                            <>
                                {data?.data?.ownership_doc === null ? <p className='text-[#4338CA] mt-4 font-bold'> No image found</p>
                                    : <img src={data?.data?.ownership_doc} alt="img" width="100" height="30" />
                                }
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <InnerHeading>BluePrint</InnerHeading>
                    {data?.data?.blue_print?.endsWith('.pdf') ? (
                        <>
                            {data?.data?.blue_print === null ? <p className='text-[#4338CA] mt-4 font-bold'> No image found</p> :
                                <iframe src={data?.data?.blue_print}></iframe>
                            }

                        </>
                    ) : (
                        <>
                            {data?.data?.blue_print === null ? <p className='text-[#4338CA] mt-4 font-bold'> No image found</p> :
                                <img src={data?.data?.blue_print} alt="img" width="100" height="30" />
                            }
                        </>
                    )}
                </div>
            </div>
            <div>
            </div>
        </div>
    )
}

export default View

