import React, { useState } from 'react';

const FloorDataModal = ({ selectedFloor, savedFloors, closeModal }) => {
  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        {/* Modal Content */}
        <div className="bg-white rounded-lg p-8 max-w-4xl w-full shadow-xl transform transition-all ease-in-out duration-300">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h3 className="text-2xl font-semibold text-[#4338CA]">
              {selectedFloor === 0 ? "Basement" : `Floor ${selectedFloor !== null ? selectedFloor - 1 : "No Floor Selected"}`} Details
            </h3>
            <button
              onClick={closeModal}
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

          {/* Floor Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {savedFloors?.map((floor, index) => (
              <div
                key={index}
                className="bg-[#F3F4F6] rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                <h4 className="text-xl font-semibold text-[#4338CA]">{floor.floor}</h4>
                <p className="mt-2"><strong>Plot Count:</strong> {floor.plotCount}</p>

                <h5 className="font-semibold mt-4 text-lg">Floor Details:</h5>
                <ul className="list-disc pl-6 space-y-3">
                  {floor.details.map((detail, idx) => (
                    <li key={idx}>
                      <div className="space-y-2">
                        <p><strong>Type:</strong> {detail.type}</p>
                        <p><strong>Length:</strong> {detail.length} meters</p>
                        <p><strong>Breadth:</strong> {detail.breadth} meters</p>
                        <p><strong>Height:</strong> {detail.height} meters</p>
                        <p><strong>Name:</strong> {detail.name}</p>
                        <p><strong>Property Name:</strong> {detail.property_name}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FloorDataModal;
