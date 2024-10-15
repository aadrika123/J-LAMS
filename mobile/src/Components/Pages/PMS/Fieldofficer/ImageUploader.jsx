import ConfirmationModal from '@/Components/Common/Modal/ConfirmationModal';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const ImageUploader = () => {
  const [files, setFiles] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setisRejectModalOpen] = useState(false);
  const [isOnHoldModalOpen, setisOnHoldModalOpen] = useState(false);

  const [modalMessage, setModalMessage] = useState("");
  // const [modalSideMessage, setModalSideMessage] = useState(null);
  const [actionHandler, setActionHandler] = useState(null);
  const [remarks, setRemarks] = useState("");

  const handleFileChange = (e) => {
    const fileInput = e.target;
    const selectedFiles = Array.from(fileInput.files ?? []);

    // Limit to 5 files
    if (selectedFiles.length + files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    const acceptedFileTypes = ["image/png", "image/jpeg"];
    const validFiles = selectedFiles.filter(file =>
      acceptedFileTypes.includes(file.type) && file.size / 1024 < 2048
    );

    if (validFiles.length !== selectedFiles.length) {
      alert("Some files are invalid or too large. Only PNG or JPEG files under 2MB are allowed.");
    }

    setFiles(prevFiles => {
      const newFiles = [...prevFiles, ...validFiles];
      if (newFiles.length === 1) {
        // Fetch location when the first file is added
        handleGetLocation();
      }
      return newFiles;
    });
    fileInput.value = "";
  };

  const { id } = useParams();

  const handleUpload = async () => {
    if (files.length > 0) {
      const uploadPromises = files.map(file => {
        const data = new FormData();
        data.append('file', file);

        return axios.post(
          "https://aadrikainfomedia.com/auth/api/lams/v1/dms/upload-gets",
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

 

  const handleSubmit = async () => {
    try {
      const fileUrls = await handleUpload();
      if (fileUrls) {

        const data = {
          long: String(longitude) ?? null,
          lat: String(latitude) ?? null,
          remarks, // Use the state value for remarks
          image_one: fileUrls[0] ?? null,
          image_two: fileUrls[1] ?? null,
          image_three: fileUrls[2] ?? null,
          image_four: fileUrls[3] ?? null,
          image_five: fileUrls[4] ?? null,
          status: 1,
        };

        const response = await axios.post(
          `https://aadrikainfomedia.com/auth/api/lams/v1/asset/update-single/?id=${id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725`,
            },
          }
        );
        console.log(response, "res approve")

        if (response.status === 200) {
          console.log(response?.data?.status, "stts[[[")
          setRemarks("");
          toast.success("Files uploaded and data updated successfully ");

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



  const handleReject = async () => {

    try {
      const fileUrls = await handleUpload();
      if (fileUrls) {
        const data = {
          long: String(longitude) ?? null,
          lat: String(latitude) ?? null,
          remarks: remarks, // Use the state value for remarks
          image_one: fileUrls[0] ?? null,
          image_two: fileUrls[1] ?? null,
          image_three: fileUrls[2] ?? null,
          image_four: fileUrls[3] ?? null,
          image_five: fileUrls[4] ?? null,
          status: -2,
        };

        const response = await axios.post(
          `https://aadrikainfomedia.com/auth/api/lams/v1/asset/update-single/?id=${id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725`,
            },
          }
        );

        if (response.status === 200) {
          setisRejectModalOpen(false);
          setRemarks("");
          toast.success("Files uploaded and data updated successfully");
        } else {
          toast.error("Failed to update data");
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data");
    }
  };


  const handleOnHold = async () => {
    console.log(" clicked first")
    try {
      const fileUrls = await handleUpload();
      if (fileUrls) {
        const data = {
          long: String(longitude) ?? null,
          lat: String(latitude) ?? null,
          remarks: remarks, // Use the state value for remarks
          image_one: fileUrls[0] ?? null,
          image_two: fileUrls[1] ?? null,
          image_three: fileUrls[2] ?? null,
          image_four: fileUrls[3] ?? null,
          image_five: fileUrls[4] ?? null,
          status: 3,
        };

        const response = await axios.post(
          `https://aadrikainfomedia.com/auth/api/lams/v1/asset/update-single/?id=${id}`,
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
          // console.log("first")
          setisOnHoldModalOpen(false);
          setRemarks("");
          toast.success("Files uploaded and data updated successfully");
        } else {
          toast.error("Failed to update data");
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data");
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
    setActionHandler(() => action);
   
  };

  

  const handleCancel = () => {
    setIsModalOpen(false);
    setisOnHoldModalOpen(false);
    setisRejectModalOpen(false);
  };

  

  const handleApprove = () => {
    handleSubmit(); // Trigger file submission on approval
  };

  const handleRemoveImage = (index) => {
    const updatedImages = files.filter((_, i) => i !== index);
    setFiles(updatedImages);
  };

  return (
    <div className="container mx-auto">
      {locationError && <p className="text-red-500">{locationError}</p>}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        disabled={files.length >= 5} // Disable if 5 or more files
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
          onClick={() =>
            handleOpenModal(
              "Are you sure you want to put this on hold?",
              "This action can be reverted.",
              setisOnHoldModalOpen(true)
            )
          }
        >
          On-Hold
        </button>

        <button
          className="bg-[#4338CA] hover:bg-white hover:text-[#4338CA] hover:border-b-2 hover:border-[#4338CA] px-7 py-2 text-white font-semibold rounded shadow-lg border border-[#4338ca] focus:outline-none"
          onClick={() =>
            handleOpenModal(
              "Are you sure you want to reject this?",
              "This action is irreversible.",
              setisRejectModalOpen(true)
            )
          }
        >
          Reject
        </button>

        <button
          className="bg-[#4338CA] hover:bg-white hover:text-[#4338CA] hover:border-b-2 hover:border-[#4338CA] px-7 py-2 text-white font-semibold rounded shadow-lg border border-[#4338ca] focus:outline-none"
          onClick={() => {
            handleOpenModal(
              "Are you sure you want to approve this?",
              "This action is irreversible.",
              setIsModalOpen(true)
            )
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
            // confirmationHandler={handleConfirmation}
            confirmationHandler={handleApprove}
            handleCancel={handleCancel}
            message={modalMessage}
            // sideMessage={modalSideMessage}
            setRemarks={setRemarks}
            remarks={remarks}
          ></ConfirmationModal>
        )}


      </div>
    </div>
  );
};

export default ImageUploader;
