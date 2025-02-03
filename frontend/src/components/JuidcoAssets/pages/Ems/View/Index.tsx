/* eslint-disable @typescript-eslint/no-explicit-any */
// /***
//  * Author: Jaideep
//  * Status: Open
//  * Uses:  Details for Assets Management Approval Application View
//  */

"use client"

import React, { useEffect, useState, useRef } from 'react'
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
import { Field, FieldArray, Formik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation'
import { useReactToPrint } from "react-to-print";


const View = ({ id }: { id: number }) => {
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams.toString());
    const status = params.get('status');
    const [isOpen, setIsOpen] = useState(false);
    const [ulbId, setUlbId] = useState<string>("");
    const [ulbName, setUlbName] = useState<string>("");
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [role, setRole] = useState('');
    const [datas, setData] = useState<any>()
    const [datass, setDatas] = useState<any>()

    const componentRef = useRef<HTMLDivElement | null>(null); // Ref for content to capture as PDF



    const [isModalVisibleData, setIsModalVisibleData] = useState(false)
      const [savedFloors, setSavedFloors] = useState<any[]>([]);
        const [editedFloorIndex, setEditedFloorIndex] = useState<any>(null); // To store the index of the floor being edited
    //   const [selectedFloor, setSelectedFloor] = useState<any>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: `
          @media print {
            @page {
              size: A4;
              margin: 10mm; /* Adjust margin as needed for better fit */
            }
            
            /* Custom table styling */
            table {
              width: 150%; /* Ensure the table uses the full width */
              margin: 0;
              padding: 0;
              border-collapse: collapse; /* Removes space between cells */
            }
            
            /* Reducing padding inside table cells */
            th, td {
              padding: 5px; /* Adjust padding for better data fit */
              margin: 0;
            }
            
            /* Font size adjustments for better fit */
            th, td {
              font-size: 10px; /* Adjust font size for visibility */
            }
    
            /* Optional: Style to avoid page breaks inside table rows */
            tr {
              page-break-inside: avoid;
            }
    
            /* Optional: Smaller header for a compact look */
            h1, h2, h3, h4, h5, h6 {
              font-size: 14px; /* Adjust heading size as needed */
            }
          }
        `,
    });


    const togglePopup = () => {
        setEditedFloorIndex(null)
        setIsOpen(!isOpen);
    };

    const fetchData = async () => {
        try {
            const res = await axios({
                url: `${ASSETS.LIST.getById}?id=${id}`,
                method: "GET",
            });
            setSavedFloors(res.data?.data?.data?.floorData
            )
            return res.data?.data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchFieldOfficerData = async () => {
        try {
            const res = await axios({
                url: `${ASSETS.LIST.getAllData}&id=${id}`,
                method: "GET",
            });
           
            setData(res.data?.data)
            return res.data?.data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchFieldOfficerData()
    }, []);


    console.log("savedFloorssavedFloors",savedFloors)

    const fetchAdminData = async () => {
        try {
            const res = await axios({
                url: `${ASSETS.LIST.updateMany}&id=${id}`,
                method: "GET",
            });
            setDatas(res.data?.data)
            return res.data?.data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchAdminData()
    }, [])

    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = localStorage.getItem("user_details");
            const user_details = JSON.parse(data as string);
            setRole(user_details?.user_type)
        }
    }, []);

    const handleUploadOwnershipDoc = async () => {
        if (file1) {
            const data = new FormData();
            data.append('file', file1);
            try {
                const response = await axios.post(`${ASSETS.LIST.validate}`, data);
                if (response.status === 200) {
                    return {
                        ownership_doc: response?.data?.data
                    };
                } else {
                    toast.error("Failed to upload files");
                }
            } catch (error) {
                toast.error("Error uploading files");
            }
        }
    };

    const handleUploadBlueprint = async () => {
        if (file2) {
            const data = new FormData();
            data.append('file', file2);
            try {
                const response = await axios.post(`${ASSETS.LIST.validate}`, data);
                if (response.status === 200) {
                    return {
                        blue_print: response?.data?.data
                    };
                } else {
                    toast.error("Failed to upload files");
                }
            } catch (error) {
                toast.error("Error uploading files");
            }
        }
    };

    const dataUpdate = async (values: any) => {
        try {
            const fileUploadData = await handleUploadOwnershipDoc();
            if (fileUploadData) {
                values.ownership_doc = fileUploadData.ownership_doc;
            }

            const fileUploadData2 = await handleUploadBlueprint();
            if (fileUploadData2) {
                values.blue_print = fileUploadData2.blue_print;
            }
            values.status = 0


            const res = await axios({
                url: `${ASSETS.LIST.update}?id=${id}`,
                method: "POST",
                data: {
                    id,
                    ...values
                }
            });

            if (res?.data?.status === 201) {
                toast.success("Assets successfully send for approval.");
                setIsOpen(false);
                window.location.reload()
            } else if (res?.data?.['meta-data']?.type === "DUPLICATE") {
                toast.error("Duplicate asset data found. Please check and try again.");
            } else if (res?.data?.status === 400) {
                toast.success("There is already a pending update request for this asset");
            }
        } catch (error) {
            console.error("Error updating data:", error);
            return [];
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const user_det = localStorage.getItem("user_details");
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
        type_of_land: data?.data?.type_of_land,
        area: data?.data?.area,
        order_date: data?.data?.order_date,
        order_no: data?.data?.order_no,
        acquisition: data?.data?.acquisition,
        mode_of_acquisition: data?.data?.mode_of_acquisition,
        from_whom_acquired: data?.data?.from_whom_acquired,
        building_approval_plan: data?.data?.building_approval_plan,
        floorData: data?.data?.floorData.map((floor: any) => ({
            id: floor.id,
            floor: floor.floor,
            plotCount: floor.plotCount,
            type: floor.type,
            assetsListId: floor.assetsListId,
            details: floor.details.map((detail: any) => ({
                id: detail.id,
                index: detail.index,
                length: detail.length,
                breadth: detail.breadth,
                height: detail.height,
                name: detail.name,
                type: detail.type,
                type_of_plot: detail.type_of_plot
            }))
        })),
    }

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

    return (
        <div>
            <Toaster />
            <div className="flex items-center justify-between border-b-2 pb-7 mb-10">
                <div className="flex items-center">
                    <PrimaryButton
                        buttonType="button"
                        variant={"cancel"}
                        onClick={goBack}
                        className="  border-0 bg-transparent hover:bg-transparent hover:text-[#3592FF] flex items-center"
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
                <button onClick={handlePrint} className="text-blue-800 border-0 bg-transparent hover:bg-transparent hover:text-[#3592FF] flex items-center">
                    Download as PDF
                </button>

            </div>
            <div>
                <div className='mb-5'>
                    {status && status == 'clicked' && (
                        <div>
                            {role === 'Field Officer' ? null :
                                <>
                                    Update Status - {data?.data?.status === 2 ? <div className='text-green-500'>Approved by Admin</div> : data?.data?.status === 0 ? <div className='text-orange-500'> Pending or Not Updated</div> : data?.data?.status === -1 ? <div className='text-red-500'>Rejected</div> : data?.data?.status === 1 ? <div className='text-green-500'>Approved by Field Officer</div> : data?.data?.status === 3 ? <div className='text-orange-500'>Sent back by Field Officer</div> : <>null</>}
                                </>
                            }
                        </div>
                    )}
                </div>

                <div className="flex justify-end animate-pulse">
                    {status && status == 'clicked' && (
                        <PrimaryButton buttonType="submit" variant="primary" onClick={togglePopup}>Update</PrimaryButton>
                    )}
                </div>
                {isOpen && (

                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-50 pt-10 overflow-x-auto">
                        <div className="bg-white p-10 rounded-lg bg-opacity-100 relative z-50 overflow-y-auto h-[50rem]">
                            <button
                                className="mt-12 px-4 py-2 flex mb-5 bg-red-700 text-white rounded-md ml-auto"
                                onClick={togglePopup}
                            >
                                X
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
                                                        name: "Building",
                                                    },
                                                    {
                                                        id: 2,
                                                        name: "Hall",
                                                    },
                                                    {
                                                        id: 3,
                                                        name: "Vacant Land",
                                                    },
                                                    {
                                                        id: 4,
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
                                                    },
                                                    {
                                                        id: 4,
                                                        name: "Enclosed/Non-Enclosed"
                                                    },
                                                    {
                                                        id: 5,
                                                        name: "Vacant Land"
                                                    },
                                                    {
                                                        id: 6,
                                                        name: "Gym"
                                                    },
                                                    {
                                                        id: 7,
                                                        name: "Market"
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
                                            <div><label htmlFor="ward_no" className="block text-sm font-medium text-gray-700">
                                                Ward No.
                                            </label>
                                                <select
                                                    id="ward_no"
                                                    name="ward_no"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.ward_no}
                                                    className="block p-2.5 mt-1 rounded-md w-full border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
                                                >
                                                    <option value="" disabled>
                                                        Select Your Ward No.
                                                    </option>
                                                    {Array.from({ length: 55 }, (_, index) => (
                                                        <option key={index + 1} value={index + 1}>
                                                            {index + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                                <p className="text-gray-500 text-xs mt-2">
                                                    Please select the appropriate ward number.
                                                </p></div>


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
                                                        name: "Residential Land",
                                                    },
                                                    {
                                                        id: 3,
                                                        name: "Agriculture Land",
                                                    },
                                                    {
                                                        id: 4,
                                                        name: "Mixed Land",
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
                                                <label>OwnerShip Doc</label>
                                                <input
                                                    type='file'
                                                    name='ownership_doc'
                                                    className="mb-4 p-1 border border-slate-400 w-full rounded"
                                                    onChange={handleFile1Change}

                                                />
                                                {data?.data?.ownership_doc?.endsWith('.pdf') ? (
                                                    <>
                                                        {data?.data?.ownership_doc === null ? <p className='text-[#4338CA] mt-4 font-bold'> No image found</p> :
                                                            <iframe src={data?.data?.ownership_doc}></iframe>
                                                        }
                                                    </>
                                                ) : (
                                                    <>
                                                        {data?.data?.ownership_doc === null ? <p className='text-[#4338CA] mt-4 font-bold'> No image found</p> :
                                                            <img src={data?.data?.ownership_doc} alt="img" width="100" height="30" />
                                                        }
                                                    </>
                                                )}
                                            </div>

                                            <div>
                                                <label>Blue Print</label>
                                                <input
                                                    type='file'
                                                    name='blue_print'
                                                    className="mb-4 p-1 border border-slate-400 w-full rounded"
                                                    onChange={handleFile2Change}

                                                />
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
                                                        name: "Donation",
                                                    },
                                                    {
                                                        id: 3,
                                                        name: "Purchase",
                                                    },
                                                    {
                                                        id: 4,
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
                                                maxLength={50}
                                            />

                                            <InputBox
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.building_approval_plan}
                                                label="Building Approval Plan No. / Gift Deed No."
                                                placeholder={"Building Approval Plan No. / Gift Deed No."}
                                                name="building_approval_plan"
                                                type="text"
                                                maxLength={20}
                                            />
                                        </div>

                                        <div className="container mx-auto p-4">
      {values.type_of_assets === "Building" && (
        <FieldArray name="floorData">
          {({ push }) => (
            <>
              <div className="flex flex-wrap gap-6">
                                                            
                                                                {values.floorData.map((floor: any, floorIndex: any) => (
                                                                    <div key={floorIndex} className="m-2   gap-3">
                                                                          Floor  {floor?.floor}
                                                                        {floor?.details?.map((detail: any, detailIndex: any) => (
                                                                            <div key={detailIndex} className="bg-white shadow-md rounded-lg p-8 border border-gray-200">

                                                                                <div className="mb-4">
                                                                                    <label className="block text-sm font-medium text-gray-700  p-2 m-2">
                                                                                        Plot:
                                                                                        <Field
                                                                                            name={`floorData[${floorIndex}].details[${detailIndex}].index`}
                                                                                            type="number"
                                                                                            placeholder="Plot Number"
                                                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                                                        />
                                                                                    </label>
                                                                                </div>

                                                                                <div className="mb-4">
                                                                                    <label className="block text-sm font-medium text-gray-700  p-2 m-2">
                                                                                        Length:
                                                                                        <Field
                                                                                            name={`floorData[${floorIndex}].details[${detailIndex}].length`}
                                                                                            type="text"
                                                                                            placeholder="Length"
                                                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                                                        />
                                                                                    </label>
                                                                                </div>
                                                                                <div className="mb-4">
                                                                                    <label className="block text-sm font-medium text-gray-700  p-2 m-2">
                                                                                        Breadth:
                                                                                        <Field
                                                                                            name={`floorData[${floorIndex}].details[${detailIndex}].breadth`}
                                                                                            type="text"
                                                                                            placeholder="Breadth"
                                                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                                                        />
                                                                                    </label>
                                                                                </div>
                                                                                <div className="mb-4">
                                                                                    <label className="block text-sm font-medium text-gray-700  p-2 m-2">
                                                                                        Height:
                                                                                        <Field
                                                                                            name={`floorData[${floorIndex}].details[${detailIndex}].height`}
                                                                                            type="text"
                                                                                            placeholder="Height"
                                                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                                                        />
                                                                                    </label>
                                                                                </div>
                                                                                <div className="mb-4">
                                                                                    <label className="block text-sm font-medium text-gray-700  p-2 m-2">
                                                                                        Name:
                                                                                        <Field
                                                                                            name={`floorData[${floorIndex}].details[${detailIndex}].name`}
                                                                                            type="text"
                                                                                            placeholder="Name"
                                                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                                                        />
                                                                                    </label>
                                                                                </div>

                                                                                <div className="mb-4">
                                                                                    <label className="block text-sm font-medium text-gray-700  p-2 m-2">
                                                                                        Property Name:
                                                                                        <Field
                                                                                            name={`floorData[${floorIndex}].details[${detailIndex}].property_name`}
                                                                                            type="text"
                                                                                            placeholder="Name"
                                                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                                                        />
                                                                                    </label>
                                                                                </div>

                                                                                <div className="mb-4">
                                                                                    <label className="block text-sm font-medium text-gray-700 p-2 m-2 focus:outline-none">
                                                                                        Type of Plot:
                                                                                        <Field
                                                                                            as="select"
                                                                                            name={`floorData[${floorIndex}].details[${detailIndex}].type_of_plot`}
                                                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                                                        >
                                                                                            <option>Choose the below options</option>
                                                                                            <option value="Enclosed">Enclosed</option>
                                                                                            <option value="Non-Enclosed">Non-Enclosed</option>
                                                                                        </Field>
                                                                                    </label>
                                                                                </div>

                                                                                <div className="mb-4">
                                                                                    <label className="block text-sm font-medium text-gray-700 p-2 m-2 focus:outline-none">
                                                                                        Type:
                                                                                        <Field
                                                                                            as="select"
                                                                                            name={`floorData[${floorIndex}].details[${detailIndex}].type`}
                                                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                                                        >
                                                                                            <option>Choose the below options</option>
                                                                                            <option value="Commercial">Commercial</option>
                                                                                            <option value="Residential">Residential</option>
                                                                                        </Field>

                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ))}
                                                                <div>
                                                              

                                                                </div>
                                                               
                                                            </div>
                                                            <button
                                                                    type="button"
                                                                    onClick={() => push({
                                                                        // floor: '',
                                                                        details: [{ index: '', length: '', breadth: '', height: '', name: '', property_name: '' }]
                                                                    })}
                                                                    className="bg-blue-500 text-white p-2 rounded-md mt-4 mx-2"
                                                                >
                                                                    Add Floor +
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {setIsModalVisibleData(true)}}
                                                                    className="bg-blue-500 text-white p-2 rounded-md mt-4 mx-2"
                                                                >
                                                                   View
                                                                </button>

                                                        </>
                                                    )}
                                                </FieldArray>
                                            )}
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

            {/* ----------------------------------- */}

            <div ref={componentRef}>

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
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{ulbName}</p>
                    </div>

                    <div>
                        <InnerHeading>Ward No.</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.ward_no === null ? <>No data found </> : <>{data?.data?.ward_no}</>}</p>
                    </div>

                    <div>
                        <InnerHeading>Asset Type</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.type_of_assets === null ? <>No data found</> : <>{data?.data?.type_of_assets}</>}</p>
                    </div>

                    <div className=''>
                        <InnerHeading>Address</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.address === null ? <>No data found </> : <>{data?.data?.address}</>}</p>
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
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.order_no === null ? <>No data found </> : <>{data?.data?.order_no}</>}</p>
                    </div>

                    <div>
                        <InnerHeading>Order Date</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.order_date === null ? <>No data found </> : <>{data?.data?.order_date}</>}</p>
                    </div>

                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-b-2 pb-4 p-10 h-auto shadow-md">
                    <SubHeading>
                        <Image src={Home3} alt="employee" width={40} height={20} />
                        <span className="ml-3">Asset Detail</span>
                    </SubHeading>

                    <div></div>
                    <div></div>

                    <div>
                        <InnerHeading>Asset Category Name</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.type_of_assets === null ? <>No data found</> : <>{data?.data?.type_of_assets}</>}</p>
                    </div>

                    <div>
                        <InnerHeading>Asset Sub-Category Name</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.asset_sub_category_name === null ? <>No data found</> : <>{data?.data?.asset_sub_category_name}</>}</p>
                    </div>

                    <div>
                        <InnerHeading>Asset Category Type</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.assets_category_type === null ? <>No data found</> : <>{data?.data?.assets_category_type}</>}</p>
                    </div>

                    <div>
                        <InnerHeading>Area</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.area === null ? <>No data found</> : <>{data?.data?.area}</>}</p>
                    </div>

                    <div>
                        <InnerHeading>Khata No.</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.khata_no === null ? <>No data found</> : <>{data?.data?.khata_no}</>}</p>
                    </div>

                    <div>
                        <InnerHeading>Plot No.</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.plot_no === null ? <>No data found</> : <>{data?.data?.plot_no}</>}</p>
                    </div>

                    <div>
                        <InnerHeading>Ward No.</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.ward_no === null ? <>No data found</> : <>{data?.data?.ward_no}</>}</p>
                    </div>

                    <div>
                        <InnerHeading>Type of Land</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.type_of_land === null ? <>No data found</> : <>{data?.data?.type_of_land}</>}</p>
                    </div>
                    <div></div>

                    <div>
                        <InnerHeading>Plot Count</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.floorData[0]?.plotCount === null ? <>No data found</> : <>{data?.data?.type_of_assets === "Building" ? data?.data?.floorData[0]?.plotCount : <>No floor found</>}</>}</p>
                    </div>
                    <div>
                        <InnerHeading>Plot Type</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.floorData[0]?.type === null ? <>No data found</> : <>{data?.data?.type_of_assets === "Building" ? data?.data?.floorData[0]?.type : <>No floor found</>}</>}</p>
                    </div>

                    <div>
                        <InnerHeading>Date of Acquisition</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>
                            {data?.data?.acquisition ?? "No data found"}
                        </p>
                    </div>
                    <div>
                        <InnerHeading>Mode of Acquisition</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>
                            {data?.data?.mode_of_acquisition ?? "No data found"}
                        </p>
                    </div>
                    <div>
                        <InnerHeading>From Whom Acquired</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>
                            {data?.data?.from_whom_acquired ?? "No data found"}
                        </p>
                    </div>
                    <div>
                        <InnerHeading>Location</InnerHeading>
                        <p className='text-[#4338CA] mt-4 font-bold text-xl'>
                            {data?.data?.location ?? "No data found"}
                        </p>
                    </div>



                    <div></div>

                    <div>
                        <InnerHeading>OwnerShip Document</InnerHeading>
                        <div className='flex'>
                            {data?.data?.ownership_doc?.endsWith('.pdf') ? (
                                <>
                                    {data?.data?.ownership_doc === null ? <p className='text-[#4338CA] mt-4 font-bold'> No image found</p> :
                                        <iframe className='w-50 h-40 mt-4 overflow-x-hidden' src={data?.data?.ownership_doc}></iframe>
                                    }
                                </>
                            ) : (
                                <>
                                    {data?.data?.ownership_doc === null ? <p className='text-[#4338CA] mt-4 font-bold'> No image found</p>
                                        : <img className='w-20 h-20 mt-4' src={data?.data?.ownership_doc} alt="img" width="100" height="30" />
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
                                    <iframe className='w-50 h-40 mt-4 overflow-hidden' src={data?.data?.blue_print}></iframe>
                                }
                            </>
                        ) : (
                            <>
                                {data?.data?.blue_print === null ? <p className='text-[#4338CA] mt-4 font-bold'> No image found</p> :
                                    <img className='w-20 h-20 mt-4' src={data?.data?.blue_print} alt="img" width="100" height="30" />
                                }
                            </>
                        )}
                    </div>

                    {/* <div></div> */}




                </div>

                <div className="border-b-2 pb-4 p-10 h-auto mb-4 shadow-md">
                    {data?.data?.type_of_assets === "Building" ? (
                        <div>
                            <SubHeading>
                                <Image src={Home3} alt="employee" width={40} height={20} />
                                <span className="ml-3">Floor Details</span>
                            </SubHeading>
                            {/* <InnerHeading></InnerHeading> */}
                            <div className="mt-5 w-full">
                                <div className="grid grid-cols-5 gap-5 w-full">
                                    {data?.data?.floorData?.map((floor: any) =>
                                        floor.details?.map((detail: any) => (
                                            <div key={detail.id} className="bg-gradient-to-r from-[#D1E8E2] to-[#E4D1E8] shadow-lg rounded-lg p-6">
                                                <p className="text-lg font-bold mb-3 pb-2 border-b-2 border-[#4338CA]"><span className='text-[#4338CA]'>Floor :</span> {floor.floor}</p>
                                                <p className="text-lg font-semibold mb-3 pb-2 border-b-2 border-[#4338CA]"><span className='text-[#4338CA]'>Type :</span> {detail?.type}</p>
                                                <p className="text-lg font-semibold mb-3 pb-2 border-b-2 border-[#4338CA]"><span className='text-[#4338CA]'>Type of Plot :</span> {detail?.type_of_plot}</p>
                                                <p className="text-lg font-semibold mb-3 pb-2 border-b-2 border-[#4338CA]"><span className='text-[#4338CA]'>Plot :</span> {detail.index}</p>
                                                <p className="text-lg font-semibold mb-3 pb-2 border-b-2 border-[#4338CA]"><span className='text-[#4338CA]'>Length :</span> {detail.length}</p>
                                                <p className="text-lg font-semibold mb-3 pb-2 border-b-2 border-[#4338CA]"><span className='text-[#4338CA]'>Breadth :</span> {detail.breadth}</p>
                                                <p className="text-lg font-semibold mb-3 pb-2 border-b-2 border-[#4338CA]"><span className='text-[#4338CA]'>Height :</span> {detail.height}</p>
                                                <p className="text-lg font-semibold"><span className='text-[#4338CA]'>Name :</span> {detail.name}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : <></>}
                </div>

                <br></br>

                {role === 'Municipal' ? (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-b-2 pb-4 p-10 h-auto  shadow-md">
                            <SubHeading>
                                <Image src={Home3} alt="employee" width={40} height={20} />
                                <span className="ml-3 text-[#4338CA] text-2xl font-bold">Field Officer Review</span>
                            </SubHeading>

                            <div></div>
                            <div></div>

                            <div>
                                <InnerHeading>Latitude</InnerHeading>
                                <p className='text-[#4338CA] mt-4 font-bold text-xl'>{datas?.data[0]?.lat === null ? <>Pending for Verification</> : <> {datas?.data[0]?.lat} </>}</p>
                            </div>

                            <div>
                                <InnerHeading>Longitude</InnerHeading>
                                <p className='text-[#4338CA] mt-4 font-bold text-xl'>{datas?.data[0]?.long === null ? <>Pending for Verification</> : <>{datas?.data[0]?.long}</>}</p>
                            </div>

                            <div>
                                <InnerHeading>Remarks</InnerHeading>
                                <p className='text-[#4338CA] mt-4 font-bold text-xl'>{datas?.data[0]?.remarks === null ? <>Pending for Verification</> : <>{datas?.data[0]?.remarks}</>}</p>
                            </div>

                            <div>
                                <InnerHeading>File Uploaded</InnerHeading>

                                <div className="grid grid-cols-5 gap-4 mt-4 w-[50rem]">

                                    <div className='row'>
                                        <span className='ml-2'>Image 1</span>
                                        {datas?.data[0]?.image_one?.endsWith('.pdf') ? (
                                            <>
                                                {datas?.data[0]?.image_one === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p> :
                                                    <iframe className='w-50 h-40 mt-2 overflow-x-hidden' src={datas?.data[0]?.image_one}></iframe>
                                                }
                                            </>
                                        ) : (
                                            <>
                                                {datas?.data[0]?.image_one === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p>
                                                    : <img className='w-20 h-20 mt-2' src={datas?.data[0]?.image_one} alt="img1" width="100" height="30" />
                                                }
                                            </>
                                        )}
                                    </div>

                                    <div className='row '>
                                        <span className='ml-2'>Image 2</span>
                                        {datas?.data[0]?.image_two?.endsWith('.pdf') ? (
                                            <>
                                                {datas?.data[0]?.image_two === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p> :
                                                    <iframe className='w-50 h-40 mt-2 overflow-x-hidden' src={datas?.data[0]?.image_two}></iframe>
                                                }
                                            </>
                                        ) : (
                                            <>
                                                {datas?.data[0]?.image_two === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p>
                                                    : <img className='w-20 h-20 mt-2' src={datas?.data[0]?.image_two} alt="img2" width="100" height="30" />
                                                }
                                            </>
                                        )}
                                    </div>

                                    <div className='row '>
                                        <span className='ml-2'>Image 3</span>
                                        {datas?.data[0]?.image_three?.endsWith('.pdf') ? (
                                            <>
                                                {datas?.data[0]?.image_three === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p> :
                                                    <iframe className='w-50 h-40 mt-2 overflow-x-hidden' src={datas?.data[0]?.image_three}></iframe>
                                                }
                                            </>
                                        ) : (
                                            <>
                                                {datas?.data[0]?.image_three === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p>
                                                    : <img className='w-20 h-20 mt-2' src={datas?.data[0]?.image_three} alt="img3" width="100" height="30" />
                                                }
                                            </>
                                        )}
                                    </div>

                                    <div className='row '>
                                        <span className='ml-2'>Image 4</span>
                                        {datas?.data[0]?.image_four?.endsWith('.pdf') ? (
                                            <>
                                                {datas?.data[0]?.image_four === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p> :
                                                    <iframe className='w-50 h-40 mt-2 overflow-x-hidden' src={datas?.data[0]?.image_four}></iframe>
                                                }
                                            </>
                                        ) : (
                                            <>
                                                {datas?.data[0]?.image_four === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p>
                                                    : <img className='w-20 h-20 mt-2' src={datas?.data[0]?.image_four} alt="img4" width="100" height="30" />
                                                }
                                            </>
                                        )}
                                    </div>

                                    <div className='row '>
                                        <span className='ml-2'>Image 5</span>
                                        {datas?.data[0]?.image_five?.endsWith('.pdf') ? (
                                            <>
                                                {datas?.data[0]?.image_five === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p> :
                                                    <iframe className='w-50 h-40 mt-2 overflow-x-hidden' src={datas?.data[0]?.image_five}></iframe>
                                                }
                                            </>
                                        ) : (
                                            <>
                                                {datas?.data[0]?.image_five === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p>
                                                    : <img className='w-20 h-20 mt-2' src={datas?.data[0]?.image_five} alt="img5" width="100" height="30" />
                                                }
                                            </>
                                        )}
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-b-2 pb-4 p-10 h-auto  shadow-md">
                            <SubHeading>
                                <Image src={Home3} alt="employee" width={40} height={20} />
                                <span className="ml-3 text-[#4338CA] text-2xl font-bold">Admin Review</span>
                            </SubHeading>
                            <div></div>
                            <div></div>
                            <div>
                                <InnerHeading>Remarks</InnerHeading>
                                <p className='text-[#4338CA] mt-4 font-bold text-xl'>{datass?.data[0]?.checker_remarks === null ? <>Pending for Verification</> : <>{datass?.data[0]?.checker_remarks}</>}</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <> </>
                )}

                {role === 'Field Officer' ? (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-b-2 pb-4 p-10 h-auto  shadow-md">
                            <SubHeading>
                                <Image src={Home3} alt="employee" width={40} height={20} />
                                <span className="ml-3 text-[#4338CA] text-2xl font-bold">Field Officer Review</span>
                            </SubHeading>

                            <div></div>
                            <div></div>

                            <div>
                                <InnerHeading>Latitute</InnerHeading>
                                <p className='text-[#4338CA] mt-4 font-bold text-xl'>{datas?.data[0]?.lat === null ? <>Pending for Verification</> : <> {datas?.data[0]?.lat} </>}</p>
                            </div>

                            <div>
                                <InnerHeading>Longitute</InnerHeading>
                                <p className='text-[#4338CA] mt-4 font-bold text-xl'>{datas?.data[0]?.long === null ? <>Pending for Verification</> : <>{datas?.data[0]?.long}</>}</p>
                            </div>

                            <div>
                                <InnerHeading>Remarks</InnerHeading>
                                <p className='text-[#4338CA] mt-4 font-bold text-xl'>{datas?.data[0]?.remarks === null ? <>Pending for Verification</> : <>{datas?.data[0]?.remarks}</>}</p>
                            </div>

                            <div>
                                <InnerHeading>File Uploaded</InnerHeading>
                                <div className="grid grid-cols-5 gap-4 mt-4 w-[50rem]">

                                    <div className='row'>
                                        <span className='ml-2'>Image 1</span>
                                        {datas?.data[0]?.image_one?.endsWith('.pdf') ? (
                                            <>
                                                {datas?.data[0]?.image_one === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p> :
                                                    <iframe className='w-50 h-40 mt-2 overflow-x-hidden' src={datas?.data[0]?.image_one}></iframe>
                                                }
                                            </>
                                        ) : (
                                            <>
                                                {datas?.data[0]?.image_one === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p>
                                                    : <img className='w-20 h-20 mt-2' src={datas?.data[0]?.image_one} alt="img1" width="100" height="30" />
                                                }
                                            </>
                                        )}
                                    </div>

                                    <div className='row '>
                                        <span className='ml-2'>Image 2</span>
                                        {datas?.data[0]?.image_two?.endsWith('.pdf') ? (
                                            <>
                                                {datas?.data[0]?.image_two === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p> :
                                                    <iframe className='w-50 h-40 mt-2 overflow-x-hidden' src={datas?.data[0]?.image_two}></iframe>
                                                }
                                            </>
                                        ) : (
                                            <>
                                                {datas?.data[0]?.image_two === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p>
                                                    : <img className='w-20 h-20 mt-2' src={datas?.data[0]?.image_two} alt="img2" width="100" height="30" />
                                                }
                                            </>
                                        )}
                                    </div>

                                    <div className='row '>
                                        <span className='ml-2'>Image 3</span>
                                        {datas?.data[0]?.image_three?.endsWith('.pdf') ? (
                                            <>
                                                {datas?.data[0]?.image_three === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p> :
                                                    <iframe className='w-50 h-40 mt-2 overflow-x-hidden' src={datas?.data[0]?.image_three}></iframe>
                                                }
                                            </>
                                        ) : (
                                            <>
                                                {datas?.data[0]?.image_three === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p>
                                                    : <img className='w-20 h-20 mt-2' src={datas?.data[0]?.image_three} alt="img3" width="100" height="30" />
                                                }
                                            </>
                                        )}
                                    </div>

                                    <div className='row '>
                                        <span className='ml-2'>Image 4</span>
                                        {datas?.data[0]?.image_four?.endsWith('.pdf') ? (
                                            <>
                                                {datas?.data[0]?.image_four === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p> :
                                                    <iframe className='w-50 h-40 mt-2 overflow-x-hidden' src={datas?.data[0]?.image_four}></iframe>
                                                }
                                            </>
                                        ) : (
                                            <>
                                                {datas?.data[0]?.image_four === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p>
                                                    : <img className='w-20 h-20 mt-2' src={datas?.data[0]?.image_four} alt="img4" width="100" height="30" />
                                                }
                                            </>
                                        )}
                                    </div>

                                    <div className='row '>
                                        <span className='ml-2'>Image 5</span>
                                        {datas?.data[0]?.image_five?.endsWith('.pdf') ? (
                                            <>
                                                {datas?.data[0]?.image_five === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p> :
                                                    <iframe className='w-50 h-40 mt-2 overflow-x-hidden' src={datas?.data[0]?.image_five}></iframe>
                                                }
                                            </>
                                        ) : (
                                            <>
                                                {datas?.data[0]?.image_five === null ? <p className='text-[#4338CA] mt-4 font-bold'> Pending for Verification</p>
                                                    : <img className='w-20 h-20 mt-2' src={datas?.data[0]?.image_five} alt="img5" width="100" height="30" />
                                                }
                                            </>
                                        )}
                                    </div>

                                </div>
                            </div>

                        </div>
                    </>
                ) : (
                    <>
                    </>
                )
                }
                <div>
                </div>
            </div>



            {isModalVisibleData && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-4xl w-full shadow-xl transform transition-all ease-in-out duration-300">
                          <div className="flex justify-between items-center border-b pb-4 mb-6">
                            <h3 className="text-2xl font-semibold text-[#4338CA]">
                              {/* {selectedFloor === 0 ? "Basement" : `Floor Details`} */}
                              Floor Details
                            </h3>
                            <button
                            //   onClick={handleCloseDataModal}
                              className="text-gray-500 hover:text-gray-800 transition ease-in-out duration-150"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Group Floors and Separate Cards */}
                          <div className="max-h-[80vh] overflow-y-auto">
                            {Object.values(savedFloors?.reduce((acc, floor) => {
                              const floorNumber = floor.floor;
                              if (!acc[floorNumber]) {
                                acc[floorNumber] = [];
                              }
                              acc[floorNumber].push(floor);
                              return acc;
                            }, {})).map((floorGroup: any, idx) => (
                              <div key={idx} className="mb-6">
                                <h3 className="text-2xl font-semibold text-[#4338CA] mb-4">
                                  {floorGroup[0]?.floor === 0 ? "Basement" : `Floor ${floorGroup[0]?.floor}`}
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                  {floorGroup.map((floor: any, index: any) => {
                                    const isOccupied = floor.plotCount > 0;
                                    const floorColorClass = isOccupied ? 'bg-green-100' : 'bg-yellow-100'; // Light Green for occupied, Light Yellow for vacant

                                    const isEditMode = editedFloorIndex === index; // Check if the current floor is in edit mode

                                    return (
                                      <div
                                        key={index}
                                        className={`rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out ${floorColorClass}`}
                                      >
                                        <h4 className="text-xl font-semibold text-[#4338CA]">{`Floor ${floor.floor}`}</h4>
                                        <p className="mt-2"><strong>Plot Count:</strong> {floor.plotCount}</p>

                                        <h5 className="font-semibold mt-4 text-lg">Floor Details:</h5>
                                        <ul className="list-disc pl-6 space-y-3">
                                          {floor.details.map((detail: any, idx: any) => (
                                            <li key={idx}>
                                              <div className="space-y-2">
                                                {isEditMode ? (
                                                  <div className="space-y-2">
                                                    <label className="block text-sm">Type:</label>
                                                    <input
                                                      type="text"
                                                    //   value={editedDetails[idx]?.type}
                                                    //   onChange={(e) => handleInputChange(e, idx, "type")}
                                                      className="border p-2 rounded w-full"
                                                    />

                                                    <label className="block text-sm">Length:</label>
                                                    <input
                                                      type="number"
                                                    //   value={editedDetails[idx]?.length}
                                                    //   onChange={(e) => handleInputChange(e, idx, "length")}
                                                      className="border p-2 rounded w-full"
                                                    />

                                                    <label className="block text-sm">Breadth:</label>
                                                    <input
                                                      type="number"
                                                    //   value={editedDetails[idx]?.breadth}
                                                    //   onChange={(e) => handleInputChange(e, idx, "breadth")}
                                                      className="border p-2 rounded w-full"
                                                    />

                                                    <label className="block text-sm">Height:</label>
                                                    <input
                                                      type="number"
                                                    //   value={editedDetails[idx]?.height}
                                                    //   onChange={(e) => handleInputChange(e, idx, "height")}
                                                      className="border p-2 rounded w-full"
                                                    />

                                                    <label className="block text-sm">Name:</label>
                                                    <input
                                                      type="text"
                                                    //   value={editedDetails[idx]?.name}
                                                    //   onChange={(e) => handleInputChange(e, idx, "name")}
                                                      className="border p-2 rounded w-full"
                                                    />

                                                    <label className="block text-sm">Property Name:</label>
                                                    <input
                                                      type="text"
                                                    //   value={editedDetails[idx]?.property_name}
                                                    //   onChange={(e) => handleInputChange(e, idx, "property_name")}
                                                      className="border p-2 rounded w-full"
                                                    />
                                                  </div>
                                                ) : (
                                                  <div className="space-y-2">
                                                    <p><strong>Type:</strong> {detail.type}</p>
                                                    <p><strong>Length:</strong> {detail.length} meters</p>
                                                    <p><strong>Breadth:</strong> {detail.breadth} meters</p>
                                                    <p><strong>Height:</strong> {detail.height} meters</p>
                                                    <p><strong>Name:</strong> {detail.name}</p>
                                                    <p><strong>Property Name:</strong> {detail.property_name}</p>
                                                  </div>
                                                )}
                                              </div>
                                            </li>
                                          ))}
                                        </ul>

                                        {/* Edit Button */}
                                        {isEditMode ? (
  <div className="mt-4 flex justify-end">
    <button
    //   onClick={() => handleSaves()}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
    >
      Save
    </button>
  </div>
) : (
  <div className="mt-4 flex justify-end">
    <button
    //   onClick={() => handleEditFloor(floor, index)} // Pass the index along with the floor data
      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-200"
    >
      Edit
    </button>
  </div>
)}

                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}








        </div>
    )
}

export default View