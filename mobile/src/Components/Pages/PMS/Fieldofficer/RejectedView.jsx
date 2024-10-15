///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : Rahul Kumar Sahu
// 👉 Component   : Field officer view page
// 👉 Status      : Close
// 👉 Description : This screen is designed to handle view .
// 👉 Functions   : Showing the data filled by the municipal login
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Import necessary dependencies from React and other libraries
import { useContext, useEffect, useState } from "react";
import TitleBar from "../../Others/TitleBar"; // Adjust path if necessary
import { contextVar } from "@/Components/context/contextVar"; // Adjust path if necessary
// import { useQuery, useQueryClient } from 'react-query';
import axios from "axios";
import { Link } from "react-router-dom";
import { Image } from "@mui/icons-material";
import docs from "../../../../assets/Images/doc.svg";
import pdf from "../../../../assets/Images/pdf.svg";
import notfound from "../../../../assets/Images/no-photo.png";
import Jhar from "../../../../assets/Images/jhar.png";

// /**
//  * FieldOfficer component: Handles search functionality and displays a title bar.
//  * @returns {JSX.Element} The FieldOfficer component.
//  */

const COLUMN = [
    { name: "#" },
    { name: "ASSET NAME" },
    { name: "ASSET TYPE" },
    { name: "LAND TYPE" },
    { name: "KHATA NO." },
    { name: "AREA (sqFt.)" },
    { name: "DOCUMENTS" },
    { name: "ACTIONS" },
    { name: "FIELD OFFICER STATUS" },
    { name: "APPROVER STATUS" },
];
const RejectedView = () => {
    const [search, setSearch] = useState("");
    const [currentAssetId, setCurrentAssetId] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [role, setRole] = useState("");

    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [filter, setFilter] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [box, setBox] = useState(false);

    const { titleBarVisibility } = useContext(contextVar);

    const handleApprove = (assetId) => {
        setCurrentAssetId(assetId);
        setActionType("approve");
        setBox(true);
    };
    const handleReject = (assetId) => {
        setCurrentAssetId(assetId);
        setActionType("reject");
        setBox(true);
    };
    // Fetch data based on currentPage, search, and filter
    const fetchData = async (page) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await axios({
                url: `https://aadrikainfomedia.com/auth/api/lams/v1/asset/get?limit=7&page=${page}&search=${debouncedSearch}&filter=${filter}&status=-2`,
                method: "GET",
                headers: {
                    Authorization: `Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725`,
                },
            });

            // Filter data to include only items with status -2
            const filteredData =
                res?.data?.data?.data.filter((item) => item.status === -2) || [];
            setFilteredData(filteredData);
            setTotalPages(res?.data?.data?.totalPages || 1);
        } catch (error) {
            setError("Error fetching data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [debouncedSearch, filter, currentPage]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchClick = () => {
        setDebouncedSearch(search);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-opacity-50">
                <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#007335]"></div>
                <Image src={Jhar} alt="jhar" className="rounded-full h-28 w-28" />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // const totalPages = count?.totalPages;

    console.log("count", filteredData?.data);

    return (
        <div className="px-4 overflow-x-hidden">
            {/* Title bar container */}
            <div className="p-4">
                <TitleBar
                    titleBarVisibility={titleBarVisibility}
                    titleText={"Rejected Application View"}
                />
            </div>

            {/* Search input and button container */}
            <div className="flex flex-col md:flex-row gap-2 mb-4">
                <div className="relative w-full">
                    {/* Search input field */}
                    <input
                        type="search"
                        onChange={handleSearchChange}
                        value={search}
                        id="search-dropdown"
                        className="block p-2.5 rounded-md w-full z-20 text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                        placeholder="Search ..."
                        required
                    />
                    {/* Search button */}
                    <button
                        type="button"
                        onClick={handleSearchClick}
                        className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-[#4338CA] rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        {/* Search icon */}
                        <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </div>
            </div>

            {/* Table view container */}
            {filteredData?.length ? (
                <div className="overflow-x-auto">
                    <table
                        className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        id="data-table"
                    >
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {COLUMN.map((item, index) => (
                                    <th key={index + 1} scope="col" className="px-4 py-3">
                                        {item.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData?.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">{item?.type_of_assets}</td>
                                    <td className="px-4 py-3">{item?.assets_category_type}</td>
                                    <td className="px-4 py-3">{item?.type_of_land}</td>
                                    <td className="px-4 py-3">{item?.khata_no}</td>
                                    <td className="px-4 py-3">{item?.area}</td>
                                    <td className="px-4 py-3">
                                        {item?.blue_print?.length && item?.ownership_doc?.length ? (
                                            <div className="flex gap-3">
                                                <Image src={docs} alt="docs" />{" "}
                                                <Image src={pdf} alt={pdf} />
                                            </div>
                                        ) : (
                                            <div className="ml-3">
                                                <Image
                                                    src={notfound}
                                                    alt="error"
                                                    width={30}
                                                    height={30}
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex">
                                            {/* <Link
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
                                            </Link> */}

                                            <Link
                                                to={`/View-application/${item?.id}`}
                                                className="text-sm p-2 text-blue-600 dark:text-blue-500 hover:underline"
                                            >
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
                                        </div>
                                    </td>
                                    <td>
                                        {item.status === 0 ? (
                                            <div className="text-orange-500 font-semibold text-xs ml-4">
                                                Waiting for Approval
                                            </div>
                                        ) : item.status === 1 ? (
                                            <div className="text-green-500 font-semibold text-xs ml-4">
                                                Approved by Field Officer
                                            </div>
                                        ) : item.status === -1 ? (
                                            <div className="text-red-500 font-semibold text-xs ml-4">
                                                Rejected by Field Officer
                                            </div>
                                        ) : (
                                            <div className="text-red-500 font-semibold text-xs ml-4">
                                                Send Back by Field Officer
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        {item.status === 0 ? (
                                            <div className="text-orange-500 font-semibold text-xs ml-4">
                                                Waiting for Approval
                                            </div>
                                        ) : item.status === -1 ? (
                                            <div className="text-green-500 font-semibold text-xs ml-4">
                                                Rejected by Field Officer
                                            </div>
                                        ) : item.status === -2 ? (
                                            <div className="text-red-500 font-semibold text-xs ml-4">
                                                Rejected by Admin
                                            </div>
                                        ) : item.status === 2 ? (
                                            <div className="text-green-500 font-semibold text-xs ml-4">
                                                Approved by Admin
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </td>

                                    {role == "Municipal" ? (
                                        <td>
                                            {item.status === 0 ? (
                                                <div className="text-orange-500 font-semibold text-xs ml-4">
                                                    Waiting for Approval
                                                </div>
                                            ) : item.status === 2 ? (
                                                <div className="text-green-500 font-semibold text-xs ml-4">
                                                    Approved by Admin
                                                </div>
                                            ) : item.status === -2 ? (
                                                <div className="text-red-500 font-semibold text-xs ml-4">
                                                    Rejected by Admin
                                                </div>
                                            ) : item.status === -1 ? (
                                                <div className="text-red-500 font-semibold text-xs ml-4">
                                                    Rejected by Field Officer
                                                </div>
                                            ) : (
                                                <div className="text-orange-500 font-semibold text-xs ml-4">
                                                    Pending by Admin
                                                </div>
                                            )}
                                        </td>
                                    ) : (
                                        <> </>
                                    )}

                                    {role == "Field Officer" ? (
                                        <td>
                                            {item.status === 1 ? (
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-start gap-2">
                                                        <button
                                                            onClick={() => {
                                                                handleApprove(item?.id);
                                                            }}
                                                            className="bg-[#4338CA] text-white text-xs p-2 rounded-3xl"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleReject(item?.id);
                                                            }}
                                                            className="bg-red-500 text-white text-xs p-2 rounded-3xl"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            ) : item.status === -1 ? (
                                                <div className=" text-red-500 font-semibold text-xs ml-4">
                                                    Rejected by Field Officer
                                                </div>
                                            ) : item.status === 2 ? (
                                                <div className=" text-green-500 font-semibold text-xs ml-4">
                                                    Approved by Admin
                                                </div>
                                            ) : item.status === -2 ? (
                                                <div className="text-red-500 font-semibold text-xs ml-4">
                                                    Rejected by Admin
                                                </div>
                                            ) : null}
                                        </td>
                                    ) : (
                                        <> </>
                                    )}

                                    {/* {role == 'Admin Officer' ? (
                                        <td>
                                            {item.status === 2 ? (
                                                <td className="px-6 py-4">
                                                    <div className='flex justify-start gap-2'>
                                                        <button onClick={() => { handleApprove(item?.id) }} className='bg-[#4338CA] text-white text-xs p-2 rounded-3xl'>Approve</button>
                                                        <button onClick={() => { handleReject(item?.id) }} className='bg-red-500 text-white text-xs p-2 rounded-3xl'>Reject</button>
                                                    </div>
                                                </td>

                                            ) : item.status === -1 ? <div className=' text-red-500 font-semibold text-xs ml-4'>Rejected by Rejected  Officer</div> :
                                                item.status === 2 ? <div className=' text-green-500 font-semibold text-xs ml-4'>Approved by Admin</div> :
                                                    item.status === -2 ? <div className='text-red-500 font-semibold text-xs ml-4'>Rejected by Admin</div> :
                                                        null
                                            }




                                        </td>
                                    ) :
                                        <> </>} */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-4 text-center text-gray-500">No data found</div>
            )}

            {/* navbar pagination */}

            <nav className="mt-4">
                <div>
                    Page {currentPage} of {totalPages}
                </div>
                <ul className="flex items-center -space-x-px h-8 text-sm justify-end">
                    <li>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <span className="sr-only">Previous</span>
                            <svg
                                className="w-2.5 h-2.5 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                            >
                                <path stroke="currentColor" d="M5 1 1 5l4 4" />
                            </svg>
                        </button>
                    </li>

                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index}>
                            <button
                                onClick={() => setCurrentPage(index + 1)}
                                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-red border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === index + 1
                                        ? "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100"
                                        : ""
                                    }`}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <span className="sr-only">Next</span>
                            <svg
                                className="w-2.5 h-2.5 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                            >
                                <path stroke="currentColor" d="m1 9 4-4-4-4" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>

            {/* navbar pagination */}
        </div>
    );
};

export default RejectedView;
