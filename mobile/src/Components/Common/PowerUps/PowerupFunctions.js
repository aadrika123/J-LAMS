import { localstorageRemoveEntire } from "../../Common/Localstorage";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";

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
export const allowNumberMultiplyInput = (
  currentValue,
  oldValue,
  max = null
) => {
  if (currentValue.length > max)
    //stop if max value and return oldvalue
    return oldValue;

  const re = /^[0-9*]+$/; // Regex to match only numbers and the '*' character

  // If currentValue is empty or matches the regex, return currentValue; otherwise, return oldValue
  if (currentValue === "" || re.test(currentValue)) {
    return currentValue;
  } else {
    return oldValue;
  }
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

export const allowCharacterSpecialInput = (
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
export const allowNumberCharacterInput = (
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
export const allowCharacterNumberDotCommaSpaceInput = (
  currentValue,
  oldValue,
  max = null
) => {
  if (currentValue.length > max)
    //stop if max value and return oldvalue
    return oldValue;

  const re = /^[\.a-zA-Z0-9,! ]*$/; //character + number + space + dot + comma
  // const re = /^[\a-zA-Z0-9! ]*$/;    //character + number + space
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

export const handleNullWithEmpty = (value) => {
  // null
  // undefined
  // not defined

  if (
    value === undefined ||
    value === null ||
    typeof value === "undefined" ||
    value === ""
  ) {
    return "";
  } else {
    return value;
  }
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

export const projectAuthentication = (type, data) => {
  if (type === "MODULE_PERMISSION") {
    return data?.length === 0 ? false : true;
  }
};

export const clearLocalStorage = () => {
  localstorageRemoveEntire();
};

// 👉 ════════════════════════║🔰 Added By: R U Bharti (START) 🔰║═══════════════════════════  👈

// To change 454632 => 4,54,632 with null safety which return 0
export const nullToZero = (value) => {
  if (
    value === undefined ||
    value === null ||
    typeof value === "undefined" ||
    value === ""
  ) {
    return "0";
  } else {
    return parseFloat(value).toLocaleString("en-IN");
  }
};

// To change "4546.32" => "4,546.32" with null safety which return 0.00
export const nullToFloat = (value) => {
  if (
    value === undefined ||
    value === null ||
    typeof value === "undefined" ||
    value === ""
  ) {
    return 0;
  } else {
    return parseFloat(value);
  }
};

// To change 780679 => ₹7,80,679.00 with null safety which return ₹0.00
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

//  here file is getting from handleChange of doucment i.e. e.target.files[0]
export const checkSizeValidation = (file) => {
  const fileType = (file?.name).split(".")[(file?.name).split(".").length - 1];
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

export const indianDate = (value) => {
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
    const date = new Date(value);
    let formattedDate;

    const hasTime = value.includes(":");
    const isEncoded = value.includes("T");

    // console.log('date is => ', value)

    if (!isEncoded) {
      const dateTimeParts = value.split(" ");
      const dateParts = dateTimeParts[0].split("-");
      const timeParts = hasTime ? dateTimeParts[1].split(":") : [];

      const day = dateParts[2];
      const month = dateParts[1];
      const year = dateParts[0];

      if (hasTime) {
        const hours = timeParts[0];
        const minutes = timeParts[1];
        const seconds = timeParts[2];

        if (year?.length > 2) {
          formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
          // console.log("date is formatted 1=> ", value,isEncoded, isNaN(date), hasTime, formattedDate)
          return formattedDate;
        } else {
          formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
          // console.log("date is formatted 2=> ", value,isEncoded, isNaN(date), hasTime, formattedDate)
          return formattedDate;
        }
      } else {
        if (year?.length > 2) {
          formattedDate = `${day}-${month}-${year}`;
          // console.log("date is formatted 3=> ", value, isEncoded, isNaN(date), hasTime, formattedDate)
          return formattedDate;
        } else {
          formattedDate = `${year}-${month}-${day}`;
          // console.log("date is formatted 4=> ", value, isEncoded, isNaN(date), hasTime, formattedDate)
          return formattedDate;
        }
      }
    } else {
      const dateParts = value.split("T");
      const date = dateParts[0];
      // const time = dateParts[1].split('.')[0];

      const year = date.substring(0, 4);
      const month = date.substring(5, 7);
      const day = date.substring(8, 10);

      const formattedDate = `${day}-${month}-${year}`;

      // console.log("date is formatted 5=> ", year.length, value,isEncoded, isNaN(date), hasTime, formattedDate)
      return formattedDate;
    }
  }
};

export const checkErrorMessage = (text) => {
  let msg = JSON.stringify(text);

  const keywords = [
    "SQLSTATE",
    "Undefined table",
    "Connection",
    "SQL",
    "SELECT",
  ];

  const lowerText = msg.toLowerCase();
  const foundKeywords = [];

  keywords.forEach((keyword) => {
    if (lowerText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  });

  if (foundKeywords?.length == 0) {
    return msg;
  } else {
    return "Error! Please try again later.";
  }
};

export const encrypt = (text) => {
  const salt = "&*@$@&*$";

  // Encrypt the username using AES encryption with a fixed key
  const ciphertext = CryptoJS.AES.encrypt(text, salt).toString();

  return ciphertext;
};

export const decrypt = (eText) => {
  const salt = "&*@$@&*$";

  try {
    // Decrypt the username using AES decryption with the fixed key
    const bytes = CryptoJS.AES.decrypt(eText, salt);

    // Convert the decrypted bytes to a UTF-8 string
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedText;
  } catch (error) {
    // Handle decryption errors here
    console.error("Decryption error:", error);
    return null; // Return null to indicate an error or invalid input
  }
};

// 👉 ════════════════════════║🔰 Added By: R U Bharti (END) 🔰║═══════════════════════════  👈
