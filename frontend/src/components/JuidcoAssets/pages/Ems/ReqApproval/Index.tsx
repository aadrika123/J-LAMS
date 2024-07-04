/* eslint-disable @typescript-eslint/no-explicit-any */
// /***
//  * Author: Jaideep
//  * Status: Open
//  * Uses:  Details for Assets Management Update Application as by Checker
//  */

"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Customer from "@/assets/icons/cv 1.png";
import { InnerHeading, SubHeading } from '@/components/Helpers/Heading'
import { ASSETS } from '@/utils/api/urls';
import axios from "@/lib/axiosConfig";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Jhar from "@/assets/icons/jhar.png"
import docs from '@/assets/icons/doc.svg'
import pdf from '@/assets/icons/pdf.svg'
import notfound from '@/assets/icons/not-found.png'
import toast, { Toaster } from 'react-hot-toast';

const ReqApproval = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [filter, setFilter] = useState('');
    const [, setRole] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const queryClient = useQueryClient();

    const COLUMN = [
        { name: "#" },
        { name: "ASSET NAME" },
        { name: "ASSET TYPE" },
        { name: "LAND TYPE" },
        { name: "KHATA NO." },
        { name: "AREA (sqFt.)" },
        { name: "DOCUMENTS" },
        { name: "VIEW" },
        { name: "ACTIONS" },
    ]

    const fetchData = async (page: number, searchQuery: string, filter: string) => {
        try {
            const res = await axios({
                url: `${ASSETS.LIST.count}&page=${page}&search=${searchQuery}&filter=${filter}`,
                method: "GET",
            });

            return res?.data?.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    };

    const { isLoading, error, data } = useQuery({
        queryKey: ['assets', currentPage, debouncedSearch, filter],
        queryFn: () => fetchData(currentPage, debouncedSearch, filter),
        staleTime: 1000,
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = sessionStorage.getItem("user_details");
            const user_details = JSON.parse(data as string);
            console.log(user_details?.user_type, "user");
            setRole(user_details?.user_type)
        }
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen  bg-opacity-50 ">
                <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#007335]"></div>
                <Image src={Jhar} alt="jhar" className="rounded-full h-28 w-28" />
            </div>
        );
    }

    if (error) {
        return <div>Error</div>;
    }

    const totalPages = data?.totalPages;

    /////////////////////////////// search data /////////////////////////////

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleSearchClick = () => {
        setDebouncedSearch(search);
        queryClient.invalidateQueries({ queryKey: ['assets', currentPage] });
    };

    /////////////////////////////// search data /////////////////////////////

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
    };

    /////////////////////////////// handleApprove & handleReject of request of assets /////////////////////////////


    const handleApprove = async (assetId: any) => {
        const area = data?.data[0]?.area
        const type_of_assets = data?.data[0]?.type_of_assets
        const assets_category_type = data?.data[0]?.assets_category_type
        const type_of_land = data?.data[0]?.type_of_land
        const khata_no = data?.data[0]?.khata_no
        const blue_print = data?.data[0]?.blue_print
        const ownership_doc = data?.data[0]?.ownership_doc
        const asset_sub_category_name = data?.data[0]?.asset_sub_category_name
        const plot_no = data?.data[0]?.plot_no
        const ward_no = data?.data[0]?.ward_no
        const address = data?.data[0]?.address
        const depreciation_method = "Straight Line Method"
        const apreciation_method = "Percentage Based Approach"
        const order_date = data?.data[0]?.order_date
        const order_no = data?.data[0]?.order_no

        const res = await axios({
            url: `${ASSETS.LIST.update}?id=${assetId}`,
            method: "POST",
            data: {
                status: 1,
                area,
                type_of_assets,
                assets_category_type,
                type_of_land,
                khata_no,
                blue_print,
                ownership_doc,
                asset_sub_category_name,
                plot_no,
                ward_no,
                address,
                depreciation_method,
                apreciation_method,
                order_date,
                order_no
            }

        });
        if (res?.data?.status === 201) {
            toast.success("Assets successfully updated");
            window.location.reload()
        } else {
            toast.error("Please check and try again.");
        }
    }

    const handleReject = async (assetId: any) => {
        const res = await axios({
            url: `${ASSETS.LIST.update}?id=${assetId}`,
            method: "POST",
            data: {
                status: -1,
            }
        });
        if (res?.data?.status === 201) {
            toast.success("Assets update Rejected");
            window.location.reload()
        } else {
            toast.error("Please check and try again.");
        }
    }

    const handleView = (item: any) => {
        setSelectedItem(item);
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setSelectedItem(null);
    };

    /////////////////////////////// handleApprove & handleReject of request of assets /////////////////////////////


    return (
        <div>
            <Toaster />

            <div className="flex items-center justify-between border-b-2 pb-7 mb-10">
                <div className="flex items-center">

                </div>
                <div>
                    <InnerHeading className="mx-5 my-5 mb-0 text-2xl">
                        Update Application Request
                    </InnerHeading>
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
                <div className="flex gap-5 justify-between overflow-x-auto sm:rounded-lg p-5">

                    <div className="max-w-md">
                        <div className='flex gap-3 mb-9'>
                            <Image src={Customer} alt="employee" width={40} height={20} />
                            <SubHeading>Search Filter</SubHeading>
                        </div>

                        <select onChange={handleFilterChange}
                            value={filter} className="block p-2.5 mt-3 rounded-md w-[13rem] z-20 h-10 text-sm text-gray-900 bg-gray-50 rounded-e-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500">
                            <option disabled selected> by Asset Type</option>
                            <option value="">All</option>
                            <option value="Immovable">Immovable</option>
                            <option value="Land">Land</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end mb-5">
                    <div className="relative">
                    </div>
                    <div className='flex gap-2'>
                        <div className="relative w-full">
                            <input
                                type="search"
                                onChange={handleSearchChange}
                                value={search}
                                id="search-dropdown"
                                className="block p-2.5 rounded-md w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                placeholder="Search ..."
                                required
                            />
                            <button
                                type="button"
                                onClick={handleSearchClick}
                                className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-[#4338CA] rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                                <span className="sr-only">Search</span>
                            </button>
                        </div>
                    </div>
                </div>

                {data?.data?.length ? (
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" id="data-table">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {COLUMN.map((item, index) => (
                                    <th key={index} scope="col" className="px-6 py-3">{item.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data?.map((item: any, index: any) => (
                                <tr key={item.id} className="bg-white border-b  dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4">{item?.type_of_assets}</td>
                                    <td className="px-6 py-4">{item?.assets_category_type}</td>
                                    <td className="px-6 py-4">{item?.type_of_land}</td>
                                    <td className="px-6 py-4">{item?.khata_no}</td>
                                    <td className="px-6 py-4">{item?.area}</td>
                                    <td className="px-6 py-4">{item?.blue_print?.length && item?.ownership_doc?.length ? <div className='flex gap-3'><Image src={docs} alt="docs" /> <Image src={pdf} alt={pdf} /></div> : <div className='ml-3'><Image src={notfound} alt="error" width={30} height={30} /></div>}</td>
                                    <td className="px-6 py-4">
                                        <div onClick={() => handleView(item)} className='p-2 cursor-pointer'>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="21"
                                                height="20"
                                                viewBox="0 0 21 20"
                                                fill="none"
                                            >
                                                <rect
                                                    x="0.578644"
                                                    y="0.578644"
                                                    width="19.8427"
                                                    height="18.8427"
                                                    rx="4.42136"
                                                    stroke="#726E6E"
                                                    strokeWidth="1.15729"
                                                />
                                                <path
                                                    d="M10 9.1C10.3617 9.1 10.7085 9.2475 10.9642 9.51005C11.22 9.7726 11.3636 10.1287 11.3636 10.5C11.3636 10.8713 11.22 11.2274 10.9642 11.4899C10.7085 11.7525 10.3617 11.9 10 11.9C9.63834 11.9 9.29149 11.7525 9.03576 11.4899C8.78003 11.2274 8.63636 10.8713 8.63636 10.5C8.63636 10.1287 8.78003 9.7726 9.03576 9.51005C9.29149 9.2475 9.63834 9.1 10 9.1ZM10 7C12.2727 7 14.2136 8.45133 15 10.5C14.2136 12.5487 12.2727 14 10 14C7.72727 14 5.78636 12.5487 5 10.5C5.78636 8.45133 7.72727 7 10 7ZM5.99091 10.5C6.3583 11.2701 6.92878 11.919 7.63749 12.3729C8.34621 12.8267 9.16473 13.0673 10 13.0673C10.8353 13.0673 11.6538 12.8267 12.3625 12.3729C13.0712 11.919 13.6417 11.2701 14.0091 10.5C13.6417 9.72986 13.0712 9.08098 12.3625 8.62715C11.6538 8.17331 10.8353 7.93272 10 7.93272C9.16473 7.93272 8.34621 8.17331 7.63749 8.62715C6.92878 9.08098 6.3583 9.72986 5.99091 10.5Z"
                                                    fill="black"
                                                    fillOpacity="0.41"
                                                />
                                            </svg>
                                        </div>
                                    </td>

                                    {item.status === 1 ? (
                                        <div className='text-green-500 text-xs mt-6 ml-6 '>Approved</div>
                                    ) : item.status === -1 ? (
                                        <div className='text-red-500 text-xs mt-6 ml-6'>Rejected</div>
                                    ) : (
                                        <td className="px-6 py-4">
                                            <div className='flex justify-start gap-2'>
                                                <button onClick={() => { handleApprove(item?.assetId) }} className='bg-[#4338CA] text-white text-xs p-2 rounded-3xl'>Approve</button>
                                                <button onClick={() => { handleReject(item?.assetId) }} className='bg-red-500 text-white text-xs p-2 rounded-3xl'>Reject</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>

                        {isPopupVisible && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl h-auto space-y-8 transform transition-transform duration-300 ease-out scale-95">
                                    <div className='flex justify-between'>
                                        <h2 className="text-2xl font-extrabold text-center text-gray-800">Asset Update Details Request</h2>
                                        <button onClick={handleClosePopup} className="bg-gradient-to-l from-red-500 to-indigo-500 text-white py-2 px-6 rounded-full hover:from-blue-600 hover:to-indigo-600 transition duration-300 ease-in-out transform hover:scale-105">Close</button>
                                    </div>

                                    <div className="space-y-6">
                                        <p className="flex justify-between items-center">
                                            <strong className="text-gray-700">Type of Assets:</strong>
                                            <span className="text-gray-600">{selectedItem?.type_of_assets}</span>
                                        </p>
                                        <p className="flex justify-between items-center">
                                            <strong className="text-gray-700">Asset Sub-Category Name:</strong>
                                            <span className="text-gray-600">{selectedItem?.asset_sub_category_name}</span>
                                        </p>
                                        <p className="flex justify-between items-center">
                                            <strong className="text-gray-700">Assets Category Type:</strong>
                                            <span className="text-gray-600">{selectedItem?.assets_category_type}</span>
                                        </p>
                                        <p className="flex justify-between items-center">
                                            <strong className="text-gray-700">Type of Land:</strong>
                                            <span className="text-gray-600">{selectedItem?.type_of_land}</span>
                                        </p>
                                        <p className="flex justify-between items-center">
                                            <strong className="text-gray-700">Khata No:</strong>
                                            <span className="text-gray-600">{selectedItem?.khata_no}</span>
                                        </p>
                                        <p className="flex justify-between items-center">
                                            <strong className="text-gray-700">Area:</strong>
                                            <span className="text-gray-600">{selectedItem?.area}</span>
                                        </p>
                                        <p className="flex justify-between items-center">
                                            <strong className="text-gray-700">Plot No:</strong>
                                            <span className="text-gray-600">{selectedItem?.plot_no}</span>
                                        </p>
                                        <p className="flex justify-between items-center">
                                            <strong className="text-gray-700">Ward No:</strong>
                                            <span className="text-gray-600">{selectedItem?.ward_no}</span>
                                        </p>
                                        <p className="flex justify-between items-center">
                                            <strong className="text-gray-700">Order No:</strong>
                                            <span className="text-gray-600">{selectedItem?.order_no}</span>
                                        </p>
                                        <p className="flex justify-between items-center">
                                            <strong className="text-gray-700">Order Date:</strong>
                                            <span className="text-gray-600">{selectedItem?.order_date}</span>
                                        </p>
                                        <p className="flex justify-between items-center">
                                            <strong className="text-gray-700">Address:</strong>
                                            <span className="text-gray-600">{selectedItem?.address}</span>
                                        </p>
                                        <p className="flex justify-between items-center">
                                            <strong className="text-gray-700">Ownership Doc:</strong>
                                            <img src={selectedItem?.ownership_doc} alt="img" width="30" height="30" />
                                        </p>
                                        <p className="flex justify-between items-center">
                                            <strong className="text-gray-700">Blue Print:</strong>
                                            <img src={selectedItem?.blue_print} alt="img" width="30" height="30" />
                                        </p>
                                    </div>

                                </div>
                            </div>
                        )}
                    </table>
                ) : (
                    <div className="flex justify-center items-center">No data found</div>
                )}

                {/* pagination */}

                <nav className='mt-4'>
                    <div>Page {data?.page} of {data?.totalPages}</div>
                    <ul className="flex items-center -space-x-px h-8 text-sm justify-end">
                        <li>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                <span className="sr-only">Previous</span>
                                <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" d="M5 1 1 5l4 4" />
                                </svg>
                            </button>
                        </li>

                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-red border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === index + 1 ? 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100' : ''
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                <span className="sr-only">Next</span>
                                <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" d="m1 9 4-4-4-4" />
                                </svg>
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* pagination */}

            </div>
        </div>
    )
}

export default ReqApproval