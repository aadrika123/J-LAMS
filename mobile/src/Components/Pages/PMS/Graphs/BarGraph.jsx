// import React, { useContext } from 'react'
// import { contextVar } from "@/Components/context/contextVar"; // Adjust path if necessary
// import TitleBar from "../../Others/TitleBar";
// const BarGraph = () => {
    // const { titleBarVisibility } = useContext(contextVar);

//   return (
//     <>
        //   {/* Title bar container */}
        //   <div className="p-4">
        //       <TitleBar
        //           titleBarVisibility={titleBarVisibility}
        //           titleText={"Graph View"}
        //       />
        //   </div>
    
  
//     <div>BarGraph</div>
//       </>
//   )
// }

// export default BarGraph

import  { useContext } from 'react'
import { contextVar } from "@/Components/context/contextVar";

import { useState } from 'react';
import Chart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import { mockVehicleCountData } from './mockData'; // Adjust the path as necessary
import TitleBar from '../../Others/TitleBar';

const BarGraph = () => {
    const data = mockVehicleCountData.data;
    const { titleBarVisibility } = useContext(contextVar);
    const [fromDate, setFromDate] = useState(new Date('2024-08-01'));
    const [toDate, setToDate] = useState(new Date('2024-08-20'));

    // Filter data based on selected date range
    const filterDataByDate = (data, fromDate, toDate) => {
        return data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= fromDate && itemDate <= toDate;
        });
    };

    // Generate chart data
    const getChartData = () => {
        const filteredTwoWheeler = filterDataByDate(data.two_wheeler, fromDate, toDate);
        const filteredFourWheeler = filterDataByDate(data.four_wheeler, fromDate, toDate);

        const categories = [...new Set([...filteredTwoWheeler, ...filteredFourWheeler].map(item => item.date))];

        return {
            series: [
                {
                    name: "Two-Wheeler",
                    data: categories.map(date => {
                        const item = filteredTwoWheeler.find(d => d.date === date);
                        return item ? item.vehicle_count : 0;
                    }),
                },
                {
                    name: "Four-Wheeler",
                    data: categories.map(date => {
                        const item = filteredFourWheeler.find(d => d.date === date);
                        return item ? item.vehicle_count : 0;
                    }),
                },
            ],
            options: {
                chart: {
                    height: 300,
                    type: 'bar',
                    zoom: {
                        enabled: false,
                    },
                },
                colors: ["#4A3AFF", "#C893FD"],
                dataLabels: {
                    enabled: true,
                },
                stroke: {
                    curve: "smooth",
                },
                xaxis: {
                    categories,
                },
            },
        };
    };

    const chartData = getChartData();

    return (
        <>
        {/* Title bar container */ }
        < div className= "p-4" >
            <TitleBar
                titleBarVisibility={titleBarVisibility}
                titleText={"Graph View"}
            />
        </div>
        <div className="flex flex-col h-[400px] flex-1 justify-start items-center border-2 rounded-md shadow-xl bg-white m-2 relative">
            <div className="flex flex-row w-full h-[50px] justify-between">
                <div className="flex flex-1 items-center mt-6 ml-5 flex-row gap-1">
                    <div className="flex h-fit w-fit p-2 bg-[#665DD9] rounded-md">
                        <svg
                            width="22"
                            height="21"
                            viewBox="0 0 22 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M14.8817 0.956787C18.8606 0.956787 21.3554 3.26581 21.3554 6.99251V9.23363L21.3482 9.33384C21.2957 9.69433 20.9643 9.97217 20.5633 9.97217H20.5542L20.4291 9.96283C20.2647 9.93808 20.1119 9.86486 19.994 9.75238C19.8466 9.61177 19.7662 9.42169 19.7712 9.22514V6.99251C19.7712 4.0553 18.0321 2.43388 14.8817 2.43388H7.12426C3.96481 2.43388 2.23486 4.0553 2.23486 6.99251V14.2337C2.23486 17.1709 3.97392 18.7838 7.12426 18.7838H14.8817C18.0412 18.7838 19.7712 17.1624 19.7712 14.2337C19.7712 13.8258 20.1258 13.4951 20.5633 13.4951C21.0008 13.4951 21.3554 13.8258 21.3554 14.2337C21.3554 17.9519 18.8789 20.2609 14.8909 20.2609H7.12426C3.12715 20.2609 0.650581 17.9519 0.650581 14.2337V6.99251C0.650581 3.26581 3.12715 0.956787 7.12426 0.956787H14.8817ZM6.60527 8.24889C6.8154 8.25553 7.01408 8.33979 7.15754 8.48309C7.301 8.6264 7.37747 8.817 7.3701 9.01291V15.1845C7.35501 15.5924 6.98813 15.9116 6.55064 15.8975C6.11316 15.8835 5.77073 15.5414 5.78582 15.1335V8.95349L5.79993 8.83799C5.8317 8.6866 5.91436 8.54739 6.03756 8.44147C6.19155 8.30906 6.39602 8.2397 6.60527 8.24889ZM11.0394 5.35412C11.4769 5.35412 11.8316 5.68478 11.8316 6.09267V15.142C11.8316 15.5499 11.4769 15.8806 11.0394 15.8806C10.6019 15.8806 10.2473 15.5499 10.2473 15.142V6.09267C10.2473 5.68478 10.6019 5.35412 11.0394 5.35412ZM15.4281 11.5087C15.8655 11.5087 16.2202 11.8394 16.2202 12.2472V15.1335C16.2202 15.5414 15.8655 15.8721 15.4281 15.8721C14.9906 15.8721 14.6359 15.5414 14.6359 15.1335V12.2472C14.6359 11.8394 14.9906 11.5087 15.4281 11.5087Z"
                                fill="white"
                                fillOpacity="0.92"
                            />
                        </svg>
                    </div>
                    <div className="flex font-semibold">
                       Vehicle Count dashboard
                    </div>
                </div>
                <div className="">
                    <div className="flex p-4 gap-3">
                        <div className="items-center mb-4">
                            <div className="relative">
                                <DatePicker
                                    selected={fromDate}
                                    onChange={(date) => setFromDate(date)}
                                    selectsStart
                                    startDate={fromDate}
                                    endDate={toDate}
                                    dateFormat="yyyy-MM-dd"
                                    className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                                />
                                <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                            </div>
                        </div>
                        <div className="mt-2">to</div>
                        <div className="items-center">
                            <div className="relative">
                                <DatePicker
                                    selected={toDate}
                                    onChange={(date) => setToDate(date)}
                                    selectsEnd
                                    startDate={fromDate}
                                    endDate={toDate}
                                    minDate={fromDate}
                                    dateFormat="yyyy-MM-dd"
                                    className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                                />
                                <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-1 justify-center items-center w-full h-full">
                <div className="flex text-center grid-cols-2 gap-3 justify-center mt-3">
                    <div>
                        <Chart
                            options={chartData.options}
                            series={chartData.series}
                            type="bar"
                            height="300"
                            width="600"
                        />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default BarGraph;
