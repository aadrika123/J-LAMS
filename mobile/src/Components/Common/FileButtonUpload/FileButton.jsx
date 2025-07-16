import toast from "react-hot-toast";

export default function FileButton({
  btnLabel,
  bg,
  textColor,
  imgRef,
  hoverBg,
  setImageDoc,
  setPreview,
}) {
  //image validation with file type and size limit
  const imageHandler = (e) => {
    const validExtensions = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB in bytes

    const file = e.target.files[0];
    if (!file) {
      return toast.error("No File Selected");
    }
    // Check the file type
    if (!validExtensions.includes(file.type)) {
      toast.error(
        "Invalid file type. Please select a JPG, JPEG, PNG or PDF file."
      );
      setImageDoc("");
      e.target.value = ""; // Clear the input
      return;
    }

    // Check the file size
    if (file.size > maxSizeInBytes) {
      toast.error("File size exceeds 2MB. Please select a smaller file.");
      setImageDoc("");
      e.target.value = ""; // Clear the input
      return;
    }

    if (file) {
      setImageDoc(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <input
        type='file'
        accept='.jpg, .jpeg, .pdf, .png, .csv, .xlsx'
        ref={imgRef}
        className='hidden'
        onChange={(e) => imageHandler(e)}
      />
      <button
        type='button'
        className={`text-${textColor} end-6 bg-${bg} hover:${hoverBg} rounded text-[12px] px-5 py-[5px]`}
        onClick={() => {
          imgRef?.current.click();
        }}
      >
        {btnLabel}
      </button>
    </>
  );
}
