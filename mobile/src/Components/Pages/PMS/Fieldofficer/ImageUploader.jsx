import ConfirmationModal from '@/Components/Common/Modal/ConfirmationModal';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';

const ImageUploader = () => {
  const [files, setFiles] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setisRejectModalOpen] = useState(false);
  const [isOnHoldModalOpen, setisOnHoldModalOpen] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_REACT_URL;
  const navigate = useNavigate();

  const [modalMessage, setModalMessage] = useState("");
  // const [modalSideMessage, setModalSideMessage] = useState(null);
  const [actionHandler, setActionHandler] = useState(null);
  const [remarks, setRemarks] = useState("");

  const handleFileChange = async (e) => {
    const fileInput = e.target;
    const selectedFiles = Array.from(fileInput.files ?? []);
    
    // Limit to 5 files
    if (selectedFiles.length + files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }
  
    const acceptedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
    const validFiles = selectedFiles.filter(file =>
      acceptedFileTypes.includes(file.type)
    );
  
    if (validFiles.length !== selectedFiles.length) {
      alert("Some files are invalid. Only PNG or JPEG files are allowed.");
    }
  
    // Process valid files
    const processedFiles = await Promise.all(
      validFiles.map(async (file) => {
        // Check if the file is from the camera (specific logic can vary)
        if (fileInput.id === "cameraInput") {
          const options = {
            maxSizeMB: 0.5, // Max size in MB
            maxWidthOrHeight: 1280, // Max width/height in pixels
            useWebWorker: true,
          };
          try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
          } catch (error) {
            console.error("Error compressing file:", error);
            return file; // Fallback to the original file if compression fails
          }
        }
        return file; // No compression for files not from the camera
      })
    );
  
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...processedFiles];
      return newFiles;
    });
  
    // Always fetch location whenever a new file is added
    if (selectedFiles.length > 0) {
      handleGetLocation();
    }
    fileInput.value = "";
  };

  const { id } = useParams();

  const handleUpload = async () => {
    if (files.length > 0) {
      const uploadPromises = files.map(file => {
        const data = new FormData();
        data.append('file', file);
        const APIDMS_BASE_URL = import.meta.env.VITE_REACT_DMS_UPLOAD;

        console.log("tttttttttttt", APIDMS_BASE_URL)
        return axios.post(
          `${API_BASE_URL}/api/lams/v1/dms/upload-gets`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: 'Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725',
            },
          }
        ).then(response => {
          if (response.status === 200) {
            return response.data.data; // Adjust according to the actual response structure
          } else {
            throw new Error("Failed to upload file");
          }
        });
      });

      try {
        const fileUrls = await Promise.all(uploadPromises);
        return fileUrls;
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error("Error uploading files");
      }
    } else {
      console.log("No files selected");
    }
  };


  const handleOnHold = async (finalRemarks) => {
    console.log(" clicked first")
    try {
      const fileUrls = await handleUpload();
      if (fileUrls) {
        const data = {
          long: String(longitude) ?? null,
          lat: String(latitude) ?? null,
          remarks: finalRemarks, // Use the state value for remarks
          image_one: fileUrls[0] ?? null,
          image_two: fileUrls[1] ?? null,
          image_three: fileUrls[2] ?? null,
          image_four: fileUrls[3] ?? null,
          image_five: fileUrls[4] ?? null,
          status: 3,
        };

        const response = await axios.post(
          `${API_BASE_URL}/api/lams/v1/asset/update-single/?id=${id}&isMobile=${true}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725`,
            },
          }
        );
        // console.log(response, "res on hold")
        if (response.status === 200) {
          setRemarks("");
          toast.success("Files uploaded and data updated successfully");
          navigate("/field-officer");
          window.location.reload();
        } else {
          toast.error("Failed to update data");
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data");
    } finally {
      setIsModalOpen(false);
    }
  };


  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationError(null);
        },
        error => {
          setLocationError("Failed to get location");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  const handleOpenModal = (message, action) => {
    setModalMessage(message);
    setActionHandler(() => (finalRemarks) => action(finalRemarks)); // Pass final remarks
    setIsModalOpen(true);
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    setisOnHoldModalOpen(false);
    setisRejectModalOpen(false);
  };

  const handleApprove = async (finalRemarks) => {

    console.log("Final remarks in handleApprove:", finalRemarks);
    try {
      const fileUrls = await handleUpload();
      if (fileUrls) {
        const data = {
          long: String(longitude) ?? null,
          lat: String(latitude) ?? null,
          remarks : finalRemarks,
          image_one: fileUrls[0] ?? null,
          image_two: fileUrls[1] ?? null,
          image_three: fileUrls[2] ?? null,
          image_four: fileUrls[3] ?? null,
          image_five: fileUrls[4] ?? null,
          status: 1,
        };

        const response = await axios.post(
          `${API_BASE_URL}/api/lams/v1/asset/update-single/?id=${id}&isMobile=${true}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725`,
            },
          }
        );

        if (response.status === 200) {
          setRemarks("");
          toast.success("Files uploaded and data updated successfully");
          navigate("/field-officer");
          window.location.reload();
        } else {
          toast.error("Failed to update data");
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = files.filter((_, i) => i !== index);
    setFiles(updatedImages);
  };

  return (
    <div className="container mx-auto">
      {locationError && <p className="text-red-500">{locationError}</p>}

      {/* File upload input */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        disabled={files.length >= 5} // Disable if 5 or more files
      />

      {/* Camera button */}
      <button
        onClick={() => document.getElementById("cameraInput").click()}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700 focus:outline-none"
      >
        Open Camera
      </button>

      {/* Hidden input for capturing images from the camera */}
      <input
        type="file"
        accept="image/*"
        capture="environment" // Opens the camera
        id="cameraInput"
        style={{ display: "none" }}
        onChange={handleFileChange} // Reuse the same handler to manage captured images
      />

      {files.length > 0 && (
        <div className="relative border border-gray-300 p-4 bg-white rounded shadow-sm">
          {files.map((file, index) => (
            <div key={index} className="relative mb-2">
              <img
                src={URL.createObjectURL(file)}
                alt={`Uploaded ${index}`}
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
          <div>
            <p className="mt-2">
              Latitude: {latitude !== null ? latitude : "Not available"}
            </p>
            <p>Longitude: {longitude !== null ? longitude : "Not available"}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0 pt-9">
      <button
    className="bg-[#4338CA] hover:bg-white hover:text-[#4338CA] hover:border-b-2 hover:border-[#4338CA] px-7 py-2 text-white font-semibold rounded shadow-lg border border-[#4338ca] focus:outline-none"
    onClick={() => {
      handleOpenModal(
        "Are you sure you want to put this on hold?",
        handleOnHold 
      );
      setIsModalOpen(true); 
    }}
  >
    On-Hold
  </button>
        <button
          className="bg-[#4338CA] hover:bg-white hover:text-[#4338CA] hover:border-b-2 hover:border-[#4338CA] px-7 py-2 text-white font-semibold rounded shadow-lg border border-[#4338ca] focus:outline-none"
          onClick={() => {
            if (files.length === 0) {
              alert("Please upload at least one file before approving.");
              return;
            }
            handleOpenModal(
              "Are you sure you want to approve this?",
              handleApprove
            );
            setIsModalOpen(true); // Open the modal
          }}
        >
          Approve
        </button>



        {/* on hold button */}
        {isOnHoldModalOpen && (
          <ConfirmationModal
            // confirmationHandler={handleConfirmation}
            confirmationHandler={handleOnHold}
            handleCancel={handleCancel}
            message={modalMessage}
            // sideMessage={modalSideMessage}
            setRemarks={setRemarks}
            remarks={remarks}
          ></ConfirmationModal>
        )}


        {/* reject button */}
        {isRejectModalOpen && (
          <ConfirmationModal
            // confirmationHandler={handleConfirmation}
            confirmationHandler={handleReject}
            handleCancel={handleCancel}
            message={modalMessage}
            // sideMessage={modalSideMessage}
            setRemarks={setRemarks}
            remarks={remarks}
          ></ConfirmationModal>
        )}


        {/* approve button */}
        {isModalOpen && (
          <ConfirmationModal
            confirmationHandler={actionHandler} // Will execute handleApprove when confirmed
            handleCancel={handleCancel}
            message={modalMessage}
            setRemarks={setRemarks}
            remarks={remarks}
          ></ConfirmationModal>
        )}


      </div>
    </div>
  );
};

export default ImageUploader;

