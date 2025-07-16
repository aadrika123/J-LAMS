import React, { useState } from 'react';
import cancel from "../../../Components/assets/Cancel.svg";

function ConfirmationModal({
  confirmationHandler,
  handleCancel,
  message,
  setRemarks,
  remarks
}) {
  const handleDescriptionChange = (e) => {
    setRemarks(e.target.value);
    console.log("Updated remarks:", e.target.value);
  };

  // const handleContinue = () => {
  //   console.log("Final remarks before submitting:", remarks);
  //   confirmationHandler(remarks); // Ensure the latest remarks value is passed
  // };
  const handleContinue = () => {
    setRemarks((prevRemarks) => {
      console.log("Final remarks before submitting:", prevRemarks);
      confirmationHandler(prevRemarks);
      return prevRemarks;
    });
  };
  
  

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-[5000]">
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="bg-white w-full max-w-full md:w-1/2 lg:w-1/3 mx-auto flex flex-col z-10 rounded">
          <div className="relative overflow-hidden mt-10">
            <img
              className="max-w-full h-[8rem] mx-auto animate-wiggle mb-5 "
              src={cancel}
              alt="Cancel"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl text-center text-black font-openSans">
              {message}
            </h3>
            <div className="mt-4 px-6">
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Write your description here..."
                value={remarks}
                onChange={handleDescriptionChange} // Correctly updates remarks
              />
            </div>
          </div>
          <div className="flex flex-col m-8">
            <div className="flex justify-center space-x-5">
              <button
                className="bg-white border-blue-900 border text-blue-950 text-sm px-8 py-2 hover:bg-[#4338CA] hover:text-white rounded leading-5 shadow-lg"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-[rgb(67,56,202)] text-sm px-8 py-2 text-white rounded leading-5 shadow-lg"
                onClick={handleContinue} // Ensure latest remarks value is used
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmationModal;
