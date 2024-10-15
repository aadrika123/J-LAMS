import { useState } from "react";
import { LuCloudy } from "react-icons/lu";
import pdfIcon from "@/assets/Images/pdfIcon.png";
import csvIcon from "@/assets/Images/csvIcon.png";
import xlsxIcon from "@/assets/Images/xlsx.png";
import ImageModal from "@/Components/Pages/Others/ImageModal/ImageModal";

export default function ImageDisplay({
  preview,
  imageDoc,
  alt,
  showPreview,
  width,
  url,
}) {
  const [imageModal, setImageModal] = useState(false);
  if (imageModal) {
    return (
      <ImageModal
        imageModal={imageModal}
        setImageModal={setImageModal}
        imageUrl={preview || url}
        imageDoc={imageDoc}
      />
    );
  }
  return (
    <div className={`w-${width} text-center rounded-md flex flex-col`}>
      {preview == null && (
        <div
          className={`${showPreview} p-10 mb-10 mt-5 border-[3px] rounded-xl border-dashed flex justify-center items-center flex-col`}
        >
          {" "}
          <div className={`rounded-md mt-8`}>
            <LuCloudy className='text-[1.5rem]' />
          </div>
          <h3 className='text-xl text-black font-openSans'>Choose a file </h3>
          <h1 className='text-gray-400 text-sm'>
            JPEG, PNG, JPG, and PDF formats, up to 2MB
          </h1>
        </div>
      )}

      <div>
        {(imageDoc?.type?.match(/(jpg|jpeg|png)$/) ||
          url?.match(/(jpg|jpeg|png)$/)) && (
          <img
            src={url || preview}
            alt={alt}
            className={`rounded cursor-pointer `}
            onClick={() => setImageModal(true)}
          />
        )}

        {/* {imageDoc?.type?.match(/\.(pdf|csv|xlsx)$/i) && (
        <img
          src={pdfIcon}
          alt='Image Previewss'
          className='cursor-pointer'
          onClick={() => setImageModal(true)}
        />
      )} */}

        {(imageDoc?.type === "application/pdf" ||
          imageDoc?.type === "text/csv" ||
          imageDoc?.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          (url && url?.includes("pdf")) ||
          url?.includes("csv") ||
          url?.includes("xlsx")) && (
          <img
            src={
              imageDoc?.type === "application/pdf" || url?.includes("pdf")
                ? pdfIcon
                : imageDoc?.type === "text/csv" || url?.includes("csv")
                ? csvIcon
                : xlsxIcon
            }
            alt={alt}
            className='cursor-pointer'
            onClick={() => setImageModal(true)}
          />
        )}
      </div>
      <div className='mb-4 text-center'>
        <p className='text-red-500 text-xs '>{imageDoc?.name}</p>
      </div>
    </div>
  );
}
