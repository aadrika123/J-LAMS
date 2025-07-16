// // import axios from 'axios';
// // import React, { useState } from 'react'
// // import toast from 'react-hot-toast';

// // const Imageupload = () => {
// //     const [file1, setFile1] = useState  (null);
// //     const [file2, setFile2] = useState  (null);
// //     const [file3, setFile3] = useState  (null);
// //     const [file4, setFile4] = useState  (null);
// //     const [file5, setFile5] = useState  (null);


// //     const handleUpload = async () => {
// //         if (file1) {
// //             const data = new FormData();
// //             data.append('file', file1);
// //             try {
// //                 const response = await axios.post(
// //                     "https://aadrikainfomedia.com/auth/api/lams/v1/dms/upload-gets",
// //                     data,
// //                     {
// //                         headers: {
// //                             "Content-Type": "multipart/form-data",
// //                             Authorization: `Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725`,
// //                         },
// //                     }
// //                 );
// //                                 console.log("Response:", response);

// //                 if (response.status === 200) {
// //                     return {
// //                         blue_print: response?.data?.data,
// //                     };
// //                 } else {
// //                     toast.error("Failed to upload files");
// //                 }
// //             } catch (error) {
// //                 console.error("Error uploading files:", error);
// //                 toast.error("Error uploading files");
// //             }
// //         } else {
// //             console.log("not uploaded")
// //         }
// //     };

// //     const handleUpload2 = async () => {
// //         if (file2) {
// //             const data = new FormData();
// //             data.append('file', file2);
// //             try {
// //                 const response = await axios.post(
// //                     "https://aadrikainfomedia.com/auth/api/lams/v1/dms/upload-gets",
// //                     data,
// //                     {
// //                         headers: {
// //                             "Content-Type": "multipart/form-data",
// //                             Authorization: `Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725`,
// //                         },
// //                     }
// //                 );                console.log("Response:", response);

// //                 if (response.status === 200) {
// //                     return {
// //                         ownership_doc: response?.data?.data
// //                     };
// //                 } else {
// //                     toast.error("Failed to upload files");
// //                 }
// //             } catch (error) {
// //                 console.error("Error uploading files:", error);
// //                 toast.error("Error uploading files");
// //             }
// //         } else {
// //             console.log("not uploaded")
// //         }
// //     };
// //     const handleUpload3 = async () => {
// //         if (file3) {
// //             const data = new FormData();
// //             data.append('file', file3);
// //             try {
// //                 const response = await axios.post(
// //                     "https://aadrikainfomedia.com/auth/api/lams/v1/dms/upload-gets",
// //                     data,
// //                     {
// //                         headers: {
// //                             "Content-Type": "multipart/form-data",
// //                             Authorization: `Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725`,
// //                         },
// //                     }
// //                 );                console.log("Response:", response);

// //                 if (response.status === 200) {
// //                     return {
// //                         ownership_doc: response?.data?.data
// //                     };
// //                 } else {
// //                     toast.error("Failed to upload files");
// //                 }
// //             } catch (error) {
// //                 console.error("Error uploading files:", error);
// //                 toast.error("Error uploading files");
// //             }
// //         } else {
// //             console.log("not uploaded")
// //         }
// //     };
// //     const handleUpload4 = async () => {
// //         if (file4) {
// //             const data = new FormData();
// //             data.append('file', file2);
// //             try {
// //                 const response = await axios.post(
// //                     "https://aadrikainfomedia.com/auth/api/lams/v1/dms/upload-gets",
// //                     data,
// //                     {
// //                         headers: {
// //                             "Content-Type": "multipart/form-data",
// //                             Authorization: `Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725`,
// //                         },
// //                     }
// //                 );
// //                                 console.log("Response:", response);

// //                 if (response.status === 200) {
// //                     return {
// //                         ownership_doc: response?.data?.data
// //                     };
// //                 } else {
// //                     toast.error("Failed to upload files");
// //                 }
// //             } catch (error) {
// //                 console.error("Error uploading files:", error);
// //                 toast.error("Error uploading files");
// //             }
// //         } else {
// //             console.log("not uploaded")
// //         }
// //     };
// //     const handleUpload5 = async () => {
// //         if (file5) {
// //             const data = new FormData();
// //             data.append('file', file5);
// //             try {
// //                 const response = await axios.post(
// //                     "https://aadrikainfomedia.com/auth/api/lams/v1/dms/upload-gets",
// //                     data,
// //                     {
// //                         headers: {
// //                             "Content-Type": "multipart/form-data",
// //                             Authorization: `Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725`,
// //                         },
// //                     }
// //                 );
// //                 console.log("Response:", response);

// //                 if (response.status === 200) {
// //                     return {
// //                         ownership_doc: response?.data?.data
// //                     };
// //                 } else {
// //                     toast.error("Failed to upload files");
// //                 }
// //             } catch (error) {
// //                 console.error("Error uploading files:", error);
// //                 toast.error("Error uploading files");
// //             }
// //         } else {
// //             console.log("not uploaded")
// //         }
// //     };
// //     const handleSubmitFormik = async () => {

// //         try {
// //             const fileUploadData = await handleUpload();
// //             if (fileUploadData) {
// //                 values.blue_print = fileUploadData.blue_print;
// //             }

// //             const fileUploadData2 = await handleUpload2();
// //             if (fileUploadData2) {
// //                 values.ownership_doc = fileUploadData2.ownership_doc;
// //             }
// //             const fileUploadData3= await handleUpload3();
// //             if (fileUploadData3) {
// //                 values.ownership_doc = fileUploadData3.ownership_doc;
// //             }
// //             const fileUploadData4 = await handleUpload4();
// //             if (fileUploadData4) {
// //                 values.ownership_doc = fileUploadData4.ownership_doc;
// //             }
// //             const fileUploadData5 = await handleUpload5();
// //             if (fileUploadData5) {
// //                 values.ownership_doc = fileUploadData5.ownership_doc;
// //             }


           

// //             const response = await axios.post(
// //                 `https://aadrikainfomedia.com/auth/api/lams/v1/asset/update-single/?id=${id}`,
// //                 data,
// //                 {
// //                     headers: {
// //                         "Content-Type": "multipart/form-data",
// //                         Authorization: `Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725`,
// //                     },
// //                 }
// //             );

         
// //     };
// //         const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
// //             const fileInput = e.target;
// //             const file = fileInput.files?.[0] ?? null;

// //             if (!file) {
// //                 setFile1(null);
// //                 return;
// //             }

// //             const fileType = file.type;
// //             const fileSize = file.size;

// //             const acceptedFileTypes = ["image/png", "image/jpeg", "application/pdf"];

// //             if (!acceptedFileTypes.includes(fileType)) {
// //                 alert("Please upload a PNG, JPEG, or PDF file.");
// //                 setFile1(null);
// //                 fileInput.value = "";
// //                 return;
// //             }

// //             if (fileSize / 1024 >= 2048) {
// //                 alert("Cannot upload more than 2MB data!");
// //                 setFile1(null);
// //                 fileInput.value = "";
// //                 return;
// //             }

// //             setFile1(file);
// //         };
// //   return (
// //     <>
// //       <div className="container mx-auto">
// //           {locationError && <p className="text-red-500">{locationError}</p>}
// //           <input
// //               type="file"
// //               multiple
// //               accept="image/*"
// //               onChange={handleFileChange}
// //               className="mb-4 p-2 border border-gray-300 rounded w-full"
// //               disabled={images.length >= 5}
// //           />

// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //               {images.map((image, index) => (
// //                   <div
// //                       key={index + 1}
// //                       className="relative border border-gray-300 p-4 bg-white rounded shadow-sm"
// //                   >
// //                       <img
// //                           src={URL.createObjectURL(image)}
// //                           alt={`Uploaded ${index + 1}`}
// //                           className="w-full h-48 object-cover mb-2 rounded"
// //                       />
// //                       <button
// //                           onClick={() => handleRemoveImage(index)}
// //                           className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
// //                       >
// //                           <svg
// //                               xmlns="http://www.w3.org/2000/svg"
// //                               className="h-5 w-5"
// //                               viewBox="0 0 24 24"
// //                               fill="none"
// //                               stroke="currentColor"
// //                               strokeWidth="2"
// //                               strokeLinecap="round"
// //                               strokeLinejoin="round"
// //                           >
// //                               <path d="M6 18L18 6M6 6l12 12" />
// //                           </svg>
// //                       </button>
// //                       <div>
// //                           <h2 className="font-bold text-lg">{titles[index]?.title}</h2>
// //                           <input
// //                               type="text"
// //                               placeholder="Label"
// //                               value={labels[index] || ""}
// //                               onChange={e => handleLabelChange(index, e.target.value)}
// //                               className="border border-gray-300 p-2 rounded-md w-full"
// //                           />
// //                           <p className="mt-2">Latitude: {locations[index]?.latitude}</p>
// //                           <p>Longitude: {locations[index]?.longitude}</p>
// //                       </div>
// //                   </div>
// //               ))}
// //           </div>
// //           </>
// //   )
// // }

// // export default Imageupload



// import axios from 'axios';
// import React, { useState } from 'react';
// import toast from 'react-hot-toast';
// import ConfirmationModal from './ConfirmationModal'; // Adjust the path if needed

// const ImageUploader = () => {
//     const [files, setFiles] = useState < File[] > ([]);
//     const [locationError, setLocationError] = useState < string | null > (null);
//     const [latitude, setLatitude] = useState < number | null > (null);
//     const [longitude, setLongitude] = useState < number | null > (null);
//     const [isModalOpen, setIsModalOpen] = useState < boolean > (false);
//     const [modalMessage, setModalMessage] = useState < string > ("");
//     const [modalSideMessage, setModalSideMessage] = useState < string | null > (null);
//     const [actionHandler, setActionHandler] = useState < (() => void) | null > (null);

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const fileInput = e.target;
//         const selectedFiles = Array.from(fileInput.files ?? []);

//         const acceptedFileTypes = ["image/png", "image/jpeg", "application/pdf"];

//         const validFiles = selectedFiles.filter(file =>
//             acceptedFileTypes.includes(file.type) && file.size / 1024 < 2048
//         );

//         if (validFiles.length !== selectedFiles.length) {
//             alert("Some files are invalid or too large. Only PNG, JPEG, or PDF files under 2MB are allowed.");
//         }

//         setFiles(validFiles);
//         fileInput.value = "";
//     };

//     const handleUpload = async () => {
//         if (files.length > 0) {
//             const uploadPromises = files.map(file => {
//                 const data = new FormData();
//                 data.append('file', file);

//                 return axios.post(
//                     "https://aadrikainfomedia.com/auth/api/lams/v1/dms/upload-gets",
//                     data,
//                     {
//                         headers: {
//                             "Content-Type": "multipart/form-data",
//                             Authorization: 'Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725',
//                         },
//                     }
//                 ).then(response => {
//                     if (response.status === 200) {
//                         return response.data.data; // Adjust according to the actual response structure
//                     } else {
//                         throw new Error("Failed to upload file");
//                     }
//                 });
//             });

//             try {
//                 const fileUrls = await Promise.all(uploadPromises);
//                 return fileUrls;
//             } catch (error) {
//                 console.error("Error uploading files:", error);
//                 toast.error("Error uploading files");
//             }
//         } else {
//             console.log("No files selected");
//         }
//     };

//     const handleSubmit = async () => {
//         try {
//             const fileUrls = await handleUpload();
//             if (fileUrls) {
//                 // Assuming you need to send the data to another endpoint
//                 const response = await axios.post(
//                     "https://aadrikainfomedia.com/auth/api/lams/v1/asset/update-single/",
//                     {
//                         image_urls: fileUrls,
//                         latitude,
//                         longitude
//                     },
//                     {
//                         headers: {
//                             "Content-Type": "application/json",
//                             Authorization: `Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725`,
//                         },
//                     }
//                 );

//                 if (response.status === 200) {
//                     toast.success("Files uploaded and data updated successfully");
//                 } else {
//                     toast.error("Failed to update data");
//                 }
//             }
//         } catch (error) {
//             console.error("Error submitting data:", error);
//             toast.error("Error submitting data");
//         }
//     };

//     const handleGetLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 position => {
//                     setLatitude(position.coords.latitude);
//                     setLongitude(position.coords.longitude);
//                     setLocationError(null);
//                 },
//                 error => {
//                     setLocationError("Failed to get location");
//                 }
//             );
//         } else {
//             setLocationError("Geolocation is not supported by this browser.");
//         }
//     };

//     const handleOpenModal = (message: string, sideMessage: string | null, action: () => void) => {
//         setModalMessage(message);
//         setModalSideMessage(sideMessage);
//         setActionHandler(() => action);
//         setIsModalOpen(true);
//     };

//     const handleConfirmation = () => {
//         if (actionHandler) actionHandler();
//         setIsModalOpen(false);
//     };

//     const handleCancel = () => {
//         setIsModalOpen(false);
//     };

//     const handleOnHold = () => {
//         // Implement on-hold action logic here
//         console.log("On-Hold action");
//     };

//     const handleReject = () => {
//         // Implement reject action logic here
//         console.log("Reject action");
//     };

//     const handleApprove = () => {
//         // Implement approve action logic here
//         console.log("Approve action");
//     };

//     return (
//         <div className="container mx-auto">
//             {locationError && <p className="text-red-500">{locationError}</p>}

//             <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleFileChange}
//                 className="mb-4 p-2 border border-gray-300 rounded w-full"
//             />

//             {files.length > 0 && (
//                 <div className="relative border border-gray-300 p-4 bg-white rounded shadow-sm">
//                     {files.map((file, index) => (
//                         <img
//                             key={index}
//                             src={URL.createObjectURL(file)}
//                             alt={`Uploaded ${index}`}
//                             className="w-full h-48 object-cover mb-2 rounded"
//                         />
//                     ))}
//                     <div>
//                         <p className="mt-2">Latitude: {latitude ?? 'Not available'}</p>
//                         <p>Longitude: {longitude ?? 'Not available'}</p>
//                         <button
//                             onClick={handleGetLocation}
//                             className="mt-2 bg-blue-500 text-white rounded p-2"
//                         >
//                             Get Location
//                         </button>
//                     </div>
//                 </div>
//             )}

//             <div className="flex flex-col md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0 pt-9">
//                 <button
//                     className="bg-[#4338CA] hover:bg-white hover:text-[#4338CA] hover:border-b-2 hover:border-[#4338CA] px-7 py-2 text-white font-semibold rounded shadow-lg border border-[#4338ca] focus:outline-none"
//                     onClick={() =>
//                         handleOpenModal(
//                             "Are you sure you want to put this on hold?",
//                             "This action can be reverted.",
//                             handleOnHold
//                         )
//                     }
//                 >
//                     On-Hold
//                 </button>

//                 <button
//                     className="bg-[#4338CA] hover:bg-white hover:text-[#4338CA] hover:border-b-2 hover:border-[#4338CA] px-7 py-2 text-white font-semibold rounded shadow-lg border border-[#4338ca] focus:outline-none"
//                     onClick={() =>
//                         handleOpenModal(
//                             "Are you sure you want to reject this?",
//                             "This action is irreversible.",
//                             handleReject
//                         )
//                     }
//                 >
//                     Reject
//                 </button>

//                 <button
//                     className="bg-[#4338CA] hover:bg-white hover:text-[#4338CA] hover:border-b-2 hover:border-[#4338CA] px-7 py-2 text-white font-semibold rounded shadow-lg border border-[#4338ca] focus:outline-none"
//                     onClick={() =>
//                         handleOpenModal(
//                             "Are you sure you want to approve this?",
//                             "Make sure all details are correct.",
//                             handleApprove
//                         )
//                     }
//                 >
//                     Approve
//                 </button>

//                 {isModalOpen && (
//                     <ConfirmationModal
//                         confirmationHandler={handleConfirmation}
//                         handleCancel={handleCancel}
//                         message={modalMessage}
//                         sideMessage={modalSideMessage}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ImageUploader;
