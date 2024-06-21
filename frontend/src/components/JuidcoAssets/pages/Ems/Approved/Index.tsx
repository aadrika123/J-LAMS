/* eslint-disable @typescript-eslint/no-explicit-any */
// /***
//  * Author: Jaideep
//  * Status: Open
//  * Uses:  Details for Assets Management Approval Application
//  */

"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Customer from "@/assets/icons/cv 1.png";
import { InnerHeading, SubHeading } from '@/components/Helpers/Heading'
import Link from 'next/link';
import { ASSETS } from '@/utils/api/urls';
import axios from "@/lib/axiosConfig";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Jhar from "@/assets/icons/jhar.png"
// import PrimaryButton from '@/components/Helpers/Button';
import docs from '@/assets/icons/doc.svg'
import pdf from '@/assets/icons/pdf.svg'
import notfound from '@/assets/icons/not-found.png'
// import goBack from '@/utils/helper';
import autoTable from 'jspdf-autotable'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';

import { jsPDF } from "jspdf";


const Approved = () => {

    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [filter, setFilter] = useState('');
    const [role, setRole] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const queryClient = useQueryClient();

    const COLUMN = [
        { name: "#" },
        { name: "ASSET NAME" },
        { name: "ASSET TYPE" },
        { name: "LAND TYPE" },
        { name: "KHATA NO." },
        { name: "AREA" },
        { name: "DOCUMENTS" },
        { name: "ACTIONS" },
    ]

    const fetchData = async (page: number, searchQuery: string, filter: string) => {
        try {
            const res = await axios({
                url: `${ASSETS.LIST.get}&page=${page}&search=${searchQuery}&filter=${filter}`,
                method: "GET",
            });
  

            return res?.data?.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    };
    
    const fetchDataforDelete = async (id: number) => {
        try {
            const res = await axios({
                url: `${ASSETS.LIST.delete}?id=${id}`,
                method: "POST",
            });
              
            if (res?.data?.status === true) {
                toast.success("Assets succesfully deleted");
                window.location.reload()
                
                return res?.data?.data;
            } else {
                toast.error("Failed to delete");
            }
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

    /////////////////////////////// delete & update data /////////////////////////////

    // const handleDelete = async (id: number) => {
    //     const data = await fetchDataforDelete(id);
    //     console.log('Deleted data:', data);
    // };

    const handleDelete = async (id: number) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            const data = await fetchDataforDelete(deleteId);
            console.log('Deleted data:', data);
            setShowModal(false);
        }
    };

    const cancelDelete = () => {
        setShowModal(false);
        setDeleteId(null);
    };


    /////////////////////////////// delete & update data /////////////////////////////


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

    /////////////////// download pdf //////////////////

    // const doc = new jsPDF();
    // const handleDownload = () => {
    //     autoTable(doc, { html: '#data-table' })
    //     doc.save('assets.pdf')
    // }

    const handleDownload = () => {
        const doc = new jsPDF();

        const columns = [
            { header: "#" },
            { header: "ASSET header" },
            { header: "ASSET TYPE" },
            { header: "LAND TYPE" },
            { header: "KHATA NO." },
            { header: "AREA" },
        ]

        const data: any = [];
        const table = document.getElementById('data-table');
        const rows = table?.querySelectorAll('tbody tr') || [];
        rows.forEach(row => {
            const rowData: any = [];
            row.querySelectorAll('td').forEach(cell => {
                const cellData = cell?.textContent?.trim() || '';
                rowData.push(cellData);
            });
            data.push(rowData);
        });

        autoTable(doc, {
            head: [columns.map(column => column.header)],
            body: data,
        });

        doc.save('assets.pdf');
    }


    /////////////////// download pdf //////////////////

    const handleClick = () => {
        router.replace('/apply/form')
    }

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
    };


    return (
        <div>
            <Toaster />
            <div className="flex items-center justify-between border-b-2 pb-7 mb-10">
                <div className="flex items-center">
                    {/* <PrimaryButton
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
                    </PrimaryButton> */}
                </div>
                <div>
                    <InnerHeading className="mx-5 my-5 mb-0 text-2xl">
                        Approval Application
                    </InnerHeading>
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
                <div className="flex gap-5 overflow-x-auto sm:rounded-lg p-5">


                    <div className="max-w-md">
                        <div className='flex gap-3 mb-9'>
                            <Image src={Customer} alt="employee" width={40} height={20} />
                            <SubHeading>Search Filter</SubHeading>
                        </div>

                        <select onChange={handleFilterChange}
                            value={filter} className="block p-2.5 mt-3 rounded-md w-[13rem] z-20 h-10 text-sm text-gray-900 bg-gray-50 rounded-e-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500">
                            <option disabled> by Asset Type</option>
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

                        <button onClick={handleDownload} type="submit" className="inline-flex  items-center h-10 py-0 px-3 ms-2 text-sm font-medium text-white bg-[#4338CA] rounded-lg border border-blue-700">
                            Export
                        </button>

                        {role == 'Field Officer' ? null : (
                            <button onClick={handleClick} type="submit" className="inline-flex w-[15rem]  items-center h-10 py-0 px-3 ms-2 text-sm font-medium text-white bg-[#4338CA] rounded-lg border border-blue-700">
                                + Add New Asset
                            </button>
                        )}
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
                                    <td className="px-6 py-4">{item?.blue_print?.length ? <div className='flex gap-3'><Image src={docs} alt="docs" /> <Image src={pdf} alt={pdf} /></div> : <div className='ml-3'><Image src={notfound} alt="error" width={30} height={30} /></div>}</td>

                                    <td className="px-6 py-4">
                                        <div className='flex'>

                                            <Link
                                                href={`/apply/approve-application/${item?.id}?status=clicked`}

                                                className="text-sm p-2 text-blue-600 dark:text-blue-500 hover:underline">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="23"
                                                    height="20"
                                                    viewBox="0 0 23 20"
                                                    fill="none"
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
                                                            <rect
                                                                width="22.7692"
                                                                height="19.7333"
                                                                fill="white"
                                                            />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </Link>

                                            <Link
                                                href={`/apply/approve-application/${item?.id}`}

                                                className="text-sm p-2 text-blue-600 dark:text-blue-500 hover:underline">
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
                                            </Link>

                                            {role == 'Field Officer' ? null : (
                                                <>
                                                    <button onClick={() => handleDelete(item?.id)} className="text-sm p-2 text-blue-600 dark:text-blue-500 hover:underline">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <rect x="0.563881" y="0.563881" width="18.362" height="18.1851" rx="5.07493" stroke="#726E6E" strokeWidth="1.12776" />
                                                            <path d="M13 6.5H11.25L10.75 6H8.25L7.75 6.5H6V7.5H13M6.5 14C6.5 14.2652 6.60536 14.5196 6.79289 14.7071C6.98043 14.8946 7.23478 15 7.5 15H11.5C11.7652 15 12.0196 14.8946 12.2071 14.7071C12.3946 14.5196 12.5 14.2652 12.5 14V8H6.5V14Z" fill="black" fillOpacity="0.41" />
                                                        </svg>
                                                    </button>

                                                    {showModal && (
                                                        <div className="fixed inset-0 flex items-center justify-center">
                                                            <div className="bg-white p-6 rounded shadow-md">
                                                                <p>Are you sure you want to delete this asset?</p>
                                                                <div className="mt-4">
                                                                    <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded mr-2">Yes</button>
                                                                    <button onClick={cancelDelete} className="px-4 py-2 bg-gray-300 rounded">No</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {/* <button onClick={() => handleDelete(item?.id)} className="text-sm  p-2 text-blue-600 dark:text-blue-500 hover:underline">

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
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
                                            </button> */}

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex justify-center items-center">No data found</div>
                )}

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
            </div>

        </div>
    )
}

export default Approved