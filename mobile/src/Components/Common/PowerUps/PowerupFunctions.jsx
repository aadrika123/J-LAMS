//function to get current date
export const getCurrentDate = () => {
  let cDate = new Date();
  let year = cDate.getFullYear();
  let month = String(cDate.getMonth() + 1);
  let day = String(cDate.getDate());

  {
    month.length < 2 && (month = `0${month}`);
  }
  {
    day.length < 2 && (day = `0${day}`);
  }

  let fullDate = `${year}-${month}-${day}`;
  return fullDate;
};
//restriction (3-parameter, month<=11, year<=364)
//function to get custom before date from current date
export const getBeforeDate = (beforeYear, beforeMonth, beforeDay) => {
  let cDate = new Date();
  let year = cDate.getFullYear() - beforeYear;
  let month = String(cDate.getMonth() + 1 - beforeMonth);
  let day = String(cDate.getDate() - beforeDay);

  {
    month.length < 2 && (month = `0${month}`);
  }
  {
    day.length < 2 && (day = `0${day}`);
  }

  let fullBeforeDate = `${year}-${month}-${day}`;
  return fullBeforeDate;
};
//glitch if month=12, current=8 then =8-12 wrong
//restriction (3-parameter, month<=11, year<=364)
//function to get custom after date from current date
export const getAfterDate = (afterYear, afterMonth, afterDay) => {
  let cDate = new Date();
  let year = cDate.getFullYear() + afterYear;
  let month = String(cDate.getMonth() + 1 + afterMonth);
  let day = String(cDate.getDate() + afterDay);

  {
    month.length < 2 && (month = `0${month}`);
  }
  {
    day.length < 2 && (day = `0${day}`);
  }

  let fullBeforeDate = `${year}-${month}-${day}`;
  return fullBeforeDate;
};

export const allowCharacterCommaInput = (
  currentValue,
  oldValue,
  max = null
) => {
  if (currentValue.length > max)
    //stop if max value and return oldvalue
    return oldValue;

  const re = /^[0-9\b,]+$/; //number + comma
  if (currentValue === "" || re.test(currentValue))
    //test
    return currentValue;
  else return oldValue;
};

//have to work on this comman get data format, very usefull
// const getCurrentYMD = () => {
//     let cDate = new Date()
//     let year = cDate.getFullYear()
//     let month = String(cDate.getMonth() + 1)
//     let day = String(cDate.getDate())

//     { month.length < 2 && (month = `0${month}`) }
//     { day.length < 2 && (day = `0${day}`) }

//     let fullFormattedDate = `${year}-${month}-${day}`
//     let allDates = {
//         year,
//         month,
//         day,
//         fullFormattedDate
//     }
//     return allDates
// }

export const returnCapitalize = (currentValue) => {
  let capitalizeValue = currentValue.toUpperCase();
  return capitalizeValue;
};
export const allowFloatInput = (currentValue, oldValue, max = null) => {
  if (currentValue.length > max)
    //stop if max value and return oldvalue
    return oldValue;

  const re = /^\d*\.?\d*$/; //number + one dot
  if (currentValue === "" || re.test(currentValue))
    //test for float input only one dot allowed
    return currentValue;
  else return oldValue;
};
export const allowNumberInput = (currentValue, oldValue, max = null) => {
  if (currentValue.length > max)
    //stop if max value and return oldvalue
    return oldValue;

  const re = /^[0-9\b]+$/; //number
  if (currentValue === "" || re.test(currentValue))
    //test
    return currentValue;
  else return oldValue;
};
export const allowNumberCommaInput = (currentValue, oldValue, max = null) => {
  if (currentValue.length > max)
    //stop if max value and return oldvalue
    return oldValue;

  const re = /^[0-9\b,]+$/; //number + comma
  if (currentValue === "" || re.test(currentValue))
    //test
    return currentValue;
  else return oldValue;
};
export const allowCharacterInput = (currentValue, oldValue, max = null) => {
  if (currentValue.length > max)
    //stop if max value and return oldvalue
    return oldValue;

  const re = /^[a-zA-Z\s]*$/; //character + space
  if (currentValue === "" || re.test(currentValue))
    //test
    return currentValue;
  else return oldValue;
};
export const allowCharacterSpaceCommaInput = (
  currentValue,
  oldValue,
  max = null
) => {
  if (currentValue.length > max)
    //stop if max value and return oldvalue
    return oldValue;

  const re = /^[\a-zA-Z,! ]*$/; //character + space + comma
  if (currentValue === "" || re.test(currentValue))
    //test
    return currentValue;
  else return oldValue;
};
export const allowCharacterNumberInput = (
  currentValue,
  oldValue,
  max = null
) => {
  if (currentValue.length > max)
    //stop if max value and return oldvalue
    return oldValue;

  const re = /^[\a-zA-Z0-9!]*$/; //character + number
  if (currentValue === "" || re.test(currentValue))
    //test
    return currentValue;
  else return oldValue;
};
export const allowMailInput = (currentValue, oldValue, max = null) => {
  if (currentValue.length > max)
    //stop if max value and return oldvalue
    return oldValue;

  const re = /^[\a-zA-Z0-9@.!]*$/; //character + number
  if (currentValue === "" || re.test(currentValue))
    //test
    return currentValue;
  else return oldValue;
};
export const allowCharacterNumberSpaceInput = (
  currentValue,
  oldValue,
  max = null
) => {
  if (currentValue.length > max)
    //stop if max value and return oldvalue
    return oldValue;

  // const re = /^[\.a-zA-Z0-9,! ]*$/; //character + number + space + dot + comma
  const re = /^[\a-zA-Z0-9! ]*$/; //character + number + space
  if (currentValue === "" || re.test(currentValue))
    //test
    return currentValue;
  else return oldValue;
};
export const allowCharacterNumberSpaceCommaInput = (
  currentValue,
  oldValue,
  max = null
) => {
  if (currentValue.length > max)
    //stop if max value and return oldvalue
    return oldValue;

  // const re = /^[\.a-zA-Z0-9,! ]*$/; //character + number + space + dot + comma
  const re = /^[\a-zA-Z0-9!, ]*$/; //character + number + space
  if (currentValue === "" || re.test(currentValue))
    //test
    return currentValue;
  else return oldValue;
};
export const nullToNA = (value) => {
  // null
  // undefined
  // not defined

  if (
    value === undefined ||
    value === null ||
    typeof value === "undefined" ||
    value === ""
  ) {
    return "NA";
  } else if (value === true) {
    return "Yes";
  } else if (value === false) {
    return "No";
  } else {
    return value;
  }
};

export const nullToZero = (value) => {
  if (
    value === undefined ||
    value === null ||
    typeof value === "undefined" ||
    value === ""
  ) {
    return "0";
  } else {
    return value;
  }
};

export const indianAmount = (value) => {
  if (
    value === undefined ||
    value === null ||
    typeof value === "undefined" ||
    value === ""
  ) {
    return parseFloat(0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  } else {
    return parseFloat(value).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  }
};

export const NoDataFound = () => {
  return (
    <div className='text-center w-full'>
      <img
        src='https://cdn-icons-png.flaticon.com/512/7466/7466140.png'
        className='h-16 w-16 mx-auto'
      />
      <button
        className='py-0.5 px-2 text-xs text-gray-700 bg-rose-300 rounded'
        title='We could not find any data for this request.'
      >
        No data found---
      </button>
    </div>
  );
};

//  here file is getting from handleChange of doucment i.e. e.target.files[0]
export const checkSizeValidation = (file) => {
  const fileType = file?.name?.split(".")[file?.name?.split(".").length - 1];
  const fileSize = file?.size / (1024 * 1024);

  switch (fileType) {
    case "jpeg": {
      if (fileSize <= 1) {
        return true;
      } else {
        toast.info("Image must be less than 1Mb");
        return false;
      }
    }
    case "jpg": {
      if (fileSize <= 1) {
        return true;
      } else {
        toast.info("Image must be less than 1Mb");
        return false;
      }
    }
    case "png": {
      if (fileSize <= 1) {
        return true;
      } else {
        toast.info("Image must be less than 1Mb");
        return false;
      }
    }
    case "pdf": {
      if (fileSize <= 10) {
        return true;
      } else {
        toast.info("PDF must be less than 10Mb");
        return false;
      }
    }
    default: {
      toast.info('File type must be "jpg", "jpeg", "png" or "pdf"');
      return false;
    }
  }
};

export const clearEntireLocalStorage = () => {
  // removeLocalstorageItem('menuList')
  // removeLocalstorageItem('userName')
  // removeLocalstorageItem('roles')
  // removeLocalstorageItem('token')
  // removeLocalstorageItem('device')
  // removeLocalstorageItem('userMobile')
  // removeLocalstorageItem('userEmail')
  // removeLocalstorageItem('userImage')
  // removeLocalstorageItem('ulbId')
  // removeLocalstorageItem('userUlbName')
  localStorage.clear();
};
