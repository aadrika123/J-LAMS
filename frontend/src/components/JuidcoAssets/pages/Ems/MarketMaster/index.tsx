/* eslint-disable @typescript-eslint/no-explicit-any */
// /***
//  * Author: Jaideep
//  * Status: Open
//  * Uses:  Details for Assets Management Approval Application
//  */

"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { InnerHeading } from '@/components/Helpers/Heading'
import Link from 'next/link';
import { ASSETS } from '@/utils/api/urls';
import axios from "@/lib/axiosConfig";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Jhar from "@/assets/icons/jhar.png"
import toast, { Toaster } from 'react-hot-toast';
import AddMarketModal from '@/components/Modal/AddMarketModal/AddMarketModal';

// interface ModalContent {
//     type: "image" | "pdf";
//     src: string;
// }

interface BuildingModalProps {
    onClose: () => void;
    data: any; // You can adjust the type based on the structure of your data
}

const Marketmaster = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    // const [filter, setFilter] = useState('');
    const [role, setRole] = useState('');
    const [showModal, setShowModal] = useState(false);
    // const [deleteId, setDeleteId] = useState<number | null>(null);
    const [count, setCount] = useState<any>([])
    const [box, setBox] = useState<any>(false)
    const [remarks, setRemarks] = useState<any>('')
    const [currentAssetId, setCurrentAssetId] = useState(null);
    const [currentAssetIdValue, setCurrentAssetIdValue] = useState(null);
    const [actionType, setActionType] = useState<any>(null);
    // const [audit, setAudit] = useState<any>();
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const queryClient = useQueryClient();
    const [ulbID, setUlbID] = useState<number | null>();
    // const [isLoadingCSV, setIsLoadingCSV] = useState(false);
    // const [modalClose, setModalClose] = useState(false);
    const [modalMarketClose, setModalMarketClose] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [editData, setEditData] = useState<any>(null);
    // const [locations, setLocations] = useState<any[]>([]);

    const handleIconClick = async (id: any) => {
        try {
            const response = await axios({
                url: `${ASSETS.LIST.buildingName}?location_id=${id}`,
                method: "GET"
            });
            const data = await response.data;
            setModalData(data); // Store the data to display in the modal
            setIsModalOpen(true); // Open the modal
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData(null);
    };
    console.log(showModal, "for build solution")
    const BuildingModal: React.FC<BuildingModalProps> = ({ onClose, data }) => (
        <div
            className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center"
            onClick={onClose}
            aria-label="Close modal"
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="modalTitle"
                aria-modal="true"
            >

                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 w-6 h-6 items-center bg-red-500 hover:bg-red-300 text-sm rounded-full  overflow-auto"
                    aria-label="Close"
                >
                    <span className=' text-white'>X</span>

                </button>
                <h2 id="modalTitle" className="text-xl text-black font-bold mb-4">
                    Building Information
                </h2>
                {data && data.data ? (
                    <ul className="list-disc list-inside text-gray-800">
                        {data.data.data.map((item: any, index: number) => (
                            <li key={index}>Building Name: {item.building_name || '---'}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No data available or loading...</p>
                )}
            </div>
        </div>
    );

    const handleDelete = async (id: any) => {
        try {
            const response = await axios({
                url: `${ASSETS.LIST.locationDelete}?id=${id}`, // API URL to delete the location
                method: 'POST', // HTTP method to delete
            });

            // Handle the response from the API
            if (response.data.status === true) {

                toast.success("Location deleted successfully.");

            } else {
                toast.error(response.data.message || "Failed to delete location.");
            }
            window.location.reload()
        } catch (error) {
            console.error('Error deleting location:', error);
            toast.error("Error occurred while deleting the location.");
        }
    };

    useEffect(() => {
        const storedUserDetails = localStorage.getItem("user_details");
        if (storedUserDetails) {
            try {
                const userDetails = JSON.parse(storedUserDetails);

                if (userDetails?.ulb_id !== undefined) {
                    setUlbID(userDetails.ulb_id || null);
                }

            } catch (error) {
                console.error('Error parsing user details:', error);
            }
        }
    }, [ulbID]);

    const COLUMN = [
        { name: "#" },
        { name: "Location" },
        { name: "Building Name" },
        { name: "Address" },
        { name: "ACTIONS" },

    ]

    const fetchData = async (page: number, searchQuery: string, itemsPerPage: number, ulbID: number) => {
        try {

            const res = await axios({
                url: `${ASSETS.LIST.marketcircle}id=${ulbID}&page=${page}&limit=${itemsPerPage}`,
                method: "GET",
            });
            setCount(res?.data)
            return res?.data?.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    };






    const { isLoading, error, data } = useQuery({
        queryKey: ['assets', currentPage, itemsPerPage, ulbID], // REMOVE debouncedSearch from queryKey
        queryFn: () => fetchData(currentPage, '', itemsPerPage, ulbID as number), // empty search param
        enabled: !!ulbID,
        staleTime: 1000,
    });

    const filteredData = data?.data?.filter((item: any) => {
        const searchText = debouncedSearch.toLowerCase();
        const locationMatch = item?.location?.toLowerCase().includes(searchText);
        const addressMatch = item?.address?.toLowerCase().includes(searchText);
        return locationMatch || addressMatch;
    });


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);


    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = localStorage.getItem("user_details");
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


    const handleItemsPerPageChange = (e: any) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleMarketOpenModal = (val: boolean, item: any = null) => {
        console.log("iytemmmm", item)
        setModalMarketClose(val)
        setEditData(item);
    }

    const handleMarketCloseModal = () => {
        queryClient.invalidateQueries({ queryKey: ['assets'] });
        setModalMarketClose(false);
    };





    const handleConfirm = () => {
        if (actionType === 'approve') {
            appApprover(currentAssetId, currentAssetIdValue);
        } else if (actionType === 'reject') {
            appReject(currentAssetId, currentAssetIdValue);
        }
        setShowModal(false);
    };

    const handleApprove = (assetId: any, asset_id: any) => {
        setCurrentAssetId(assetId);
        setCurrentAssetIdValue(asset_id);
        setActionType('approve');
        setBox(true);
    };

    const handleReject = (assetId: any, asset_id: any) => {
        setCurrentAssetId(assetId);
        setCurrentAssetIdValue(asset_id);
        setActionType('reject');
        setBox(true);
    };

    const deleteApprover = () => {
        setBox(false);
    };

    const handleInputChange = (e: any) => {
        setRemarks(e.target.value);
    };

    const appApprover = async (assetId: any, asset_id: any) => {
        const res = await axios({
            url: `${ASSETS.LIST.update}?id=${assetId}&assets_id=${asset_id}`,
            method: "POST",
            data: {
                status: 2,
                checker_remarks: remarks
            }
        });

        if (res?.data?.status === 201) {
            toast.success("Assets successfully updated");
            window.location.reload()
        } else {
            toast.error("Please check and try again.");
        }
    }

    const appReject = async (assetId: any, asset_id: any) => {
        console.log("remarks", remarks)
        const res = await axios({
            url: `${ASSETS.LIST.update}?id=${assetId}&assets_id=${asset_id}`,
            method: "POST",
            data: {
                status: -2,
                checker_remarks: remarks
            }
        });

        if (res?.data?.status === 201) {
            toast.success("Assets successfully updated");
            window.location.reload()
        } else {
            toast.error("Please check and try again.");
        }
    }


    //   const handleCloseModal = () => {
    //     setModalClose(false);
    //   };

    return (
        <div>
            <Toaster />
            <div className="flex items-center justify-between border-b-2 pb-7 mb-10">
                <div className="flex items-center">

                </div>
                <div>
                    <InnerHeading className="mx-5 my-5 mb-0 text-2xl">
                        Market Master
                    </InnerHeading>
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
                <div className="flex gap-5 justify-between overflow-x-auto sm:rounded-lg p-5">

                    {role == 'Admin' ?
                        <div className='flex gap-4'>

                            {/* 1st col */}

                            <div>
                                <span className="relative flex h-4 w-4 float-right mt-[-0.5rem]">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c06767] opacity-75 "></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#c06767] "></span>
                                </span>
                                <div id="toast-message-cta" className="w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:bg-gray-800 dark:text-gray-400" role="alert">
                                    <div className="flex">
                                        <div className="ms-3 text-sm font-normal">
                                            <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Assets Log Data</span> <br></br>
                                            <span className="mb-1 text-sm font-semibold text-[#4338CA] dark:text-white"> Total- <span className='text-slate-700'>({0})</span></span><br></br>
                                            <div className="mb-2 text-sm text-slate-800 font-normal mt-2">Hi, <span className='text-[#4338CA] font-bold'>{role}</span>  , you have recieved <span className='text-sm font-semibold text-[#42ca38] dark:text-white'>({0})</span> for audit changes in assets data. </div>
                                            <Link href={'/apply/request-update'} className="inline-flex px-2.5 py-1.5 text-xs font-medium text-center mt-3 text-white bg-[#4338CA] rounded-lg hover:bg-[#4338CA] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-[#4338CA] dark:hover:bg-[#4338CA]">View All Logs</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2nd col */}

                            <div>
                                <span className="relative flex h-4 w-4 float-right mt-[-0.5rem]">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#67c068] opacity-75 "></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#42ca38] "></span>
                                </span>
                                <div id="toast-message-cta" className="w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:bg-gray-800 dark:text-gray-400" role="alert">
                                    <div className="flex">
                                        <div className="ms-3 text-sm font-normal">
                                            <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Update Request</span> <br></br>
                                            <span className="mb-1 text-sm font-semibold text-[#4338CA] dark:text-white"> Total- <span className='text-slate-700'>({count?.data?.count || 0})</span></span><br></br>
                                            <span className="mb-1 text-sm font-semibold text-[#42ca38] dark:text-white"> Approved- <span className='text-slate-700'>{count?.data?.status1Items || 0} ,</span></span>
                                            <span className="mb-1 text-sm font-semibold text-[#ca3838] dark:text-white"> Rejected- <span className='text-slate-700'>{count?.data?.statusMinus1Items || 0} , </span></span>
                                            <span className="mb-1 text-sm font-semibold text-[#cab938] dark:text-white"> Pending- <span className='text-slate-700'>{count?.data?.statusPendingAssets || 0}</span></span>
                                            <div className="mb-2 text-sm text-slate-800 font-normal mt-2">Hi, <span className='text-[#4338CA] font-bold'>{role}</span>  , you have recieved <span className='text-sm font-semibold text-[#42ca38] dark:text-white'>({count?.data?.statusPendingAssets || 0})</span> requests for some changes in assets data. </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null}
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





                        <button onClick={() => handleMarketOpenModal(true)} type="submit" className="w-[11rem] inline-flex items-center h-10 py-0 px-3 ms-2 text-sm font-medium text-white bg-[#4338CA] rounded-lg border border-blue-700" disabled={count == 0 ? true : false}>
                            Add Location
                        </button>


                    </div>
                </div>

                {filteredData?.length ? (
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" id="data-table">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {COLUMN.map((item, index) => (
                                    <th key={index} scope="col" className="px-6 py-3">{item.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item: any, index: any) => (
                                <tr key={item.id} className="bg-white border-b  dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4">{item?.location || "---"}</td>
                                    {/* <td className="px-6 py-4">{item.building_name || "---"}</td> */}
                                    <td className="px-6 py-4 cursor-pointer">{(<svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="21"
                                        height="20"
                                        viewBox="0 0 21 20"
                                        fill="none"
                                        onClick={() => handleIconClick(item.id)}
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
                                    </svg>)}
                                        {isModalOpen && <BuildingModal onClose={handleCloseModal} data={modalData} />}
                                    </td>
                                    <td className="px-6 py-4">{item?.address || "---"}</td>


                                    <td className="px-6 py-4">
                                        <div className="flex cursor-pointer">
                                            {/* Edit Icon */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="23"
                                                height="20"
                                                viewBox="0 0 23 20"
                                                fill="none"
                                                onClick={() => handleMarketOpenModal(true, item)} // Open modal on click
                                            >
                                                <g clipPath="url(#clip0_1440_7941)">
                                                    <rect
                                                        x="1.63591"
                                                        y="0.63591"
                                                        width="18.7282"
                                                        height="18.7282"
                                                        rx="4.36409"
                                                        stroke="#726E6E"
                                                        strokeWidth="1.27182"
                                                    />
                                                    <path
                                                        d="M15.5263 8.02097C15.3434 8.19095 15.1659 8.35592 15.1605 8.5209C15.1444 8.68088 15.3273 8.84585 15.4994 9.00083C15.7576 9.2508 16.0104 9.47577 15.9997 9.72073C15.9889 9.9657 15.7146 10.2207 15.4402 10.4706L13.2187 12.5403L12.4549 11.8304L14.741 9.71073L14.2246 9.2308L13.4608 9.9357L11.4436 8.06096L13.5092 6.14623C13.7189 5.95126 14.0686 5.95126 14.2676 6.14623L15.5263 7.31607C15.7361 7.50104 15.7361 7.826 15.5263 8.02097ZM6 13.1253L11.1424 8.34092L13.1595 10.2157L8.01715 15H6V13.1253Z"
                                                        fill="black"
                                                        fillOpacity="0.41"
                                                    />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_1440_7941">
                                                        <rect width="22.7692" height="19.7333" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>

                                            {/* Delete Icon */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                onClick={() => handleDelete(item?.id)} // Handle delete on click
                                            >
                                                <rect
                                                    x="0.563881"
                                                    y="0.563881"
                                                    width="18.362"
                                                    height="18.1851"
                                                    rx="5.07493"
                                                    stroke="#726E6E"
                                                    strokeWidth="1.12776"
                                                />
                                                <path
                                                    d="M13 6.5H11.25L10.75 6H8.25L7.75 6.5H6V7.5H13M6.5 14C6.5 14.2652 6.60536 14.5196 6.79289 14.7071C6.98043 14.8946 7.23478 15 7.5 15H11.5C11.7652 15 12.0196 14.8946 12.2071 14.7071C12.3946 14.5196 12.5 14.2652 12.5 14V8H6.5V14Z"
                                                    fill="black"
                                                    fillOpacity="0.41"
                                                />
                                            </svg>
                                        </div>
                                    </td>




                                    {role == 'Admin' ? (
                                        <td>
                                            {item.status === 1 ? (
                                                <td className="px-6 py-4">
                                                    <div className='flex justify-start gap-2'>
                                                        <button onClick={() => { handleApprove(item?.id, item?.asset_id) }} className='bg-[#4338CA] text-white text-xs p-2 rounded-3xl'>Approve</button>
                                                        <button onClick={() => { handleReject(item?.id, item?.asset_id) }} className='bg-red-500 text-white text-xs p-2 rounded-3xl'>Reject</button>
                                                    </div>
                                                </td>

                                            ) : item.status === -1 ? <div className=' text-red-500 font-semibold text-xs ml-4'>Rejected by Field Officer</div> :
                                                item.status === 2 ? <div className=' text-green-500 font-semibold text-xs ml-4'>Approved by Admin</div> :
                                                    item.status === -2 ? <div className='text-red-500 font-semibold text-xs ml-4'>Rejected by Admin</div> :
                                                        null
                                            }

                                            {box && (
                                                <div className="fixed inset-0 flex items-center justify-center">
                                                    <div className="bg-white p-6 rounded shadow-md">
                                                        <p className='text-[#4338CA] font-bold text-lg'>Are you sure you want to <span className='text-red-500 font-semibold text-xl'>{actionType}</span> this asset?</p>
                                                        <div className="mt-4">
                                                            <form className='w-full'>
                                                                <input
                                                                    type="textarea"
                                                                    placeholder='Enter your remarks'
                                                                    className='w-full h-[5rem] mb-4 border border-slate-300 p-4'
                                                                    value={remarks}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </form>
                                                            <br></br>
                                                            <button onClick={handleConfirm} className="px-4 py-2 bg-red-600 text-white rounded mr-2">Yes</button>
                                                            <button onClick={deleteApprover} className="px-4 py-2 bg-gray-300 rounded">No</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    ) : null}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex justify-center items-center">No data found</div>
                )}

                {/* navbar pagination */}

                <nav className='mt-4'>
                    <div>Page {data?.page} of {data?.totalPages}</div>
                    <select
                        onChange={handleItemsPerPageChange}
                        value={itemsPerPage}
                        className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
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

                {/* navbar pagination */}

            </div>


            {modalMarketClose &&

                <AddMarketModal
                    isOpen={modalMarketClose}
                    onClose={handleMarketCloseModal}
                    ulbID={ulbID}
                    editData={editData}



                />
            }
        </div>
    )
}

export default Marketmaster