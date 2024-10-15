import React, { useRef, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactToPrint from "react-to-print-advanced";
// import AdvertisementApiList from '../AdvertisementModule/AdvertisementApiList';
// import WaterTankerApiList from "../WaterTankerApiList";
// import ComponentToPrint from "./SepticTankPaymentReceipt";
// import axios from "axios";
import ComponentToPrint from "@/Components/Pages/PMS/TenderForm/TenderFormViewDetails";

function PrintComponent() {
  // ══════════════════════════════║🔰 ✅ payment Id from use param... 🔰║═══════════════════════════════════
//   const { id } = useParams();

  // ══════════════════════════════║🔰 API LIST 🔰║═══════════════════════════════════
  // const { api_getSepticTankPaymentReceipt } = AdvertisementApiList();
//   const { api_getSepticTankPaymentReceipt } = WaterTankerApiList();

  const componentRef = useRef();
//   const [paymentData, setpaymentData] = useState();

  // ══════════════════════════════║🔰 function to fetch payment details 🔰║═══════════════════════════════════
//   useEffect(() => {
//     fetchPaymentData();
//   }, []);

//   const fetchPaymentData = () => {
//     axios
//       .get(`${api_getSepticTankPaymentReceipt}/${id}`)
//       .then((response) => {
//         console.log("payment data 2", response);
//         if (response.data.status) {
//           setpaymentData(response.data.data);
//         } else {
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   console.log("payment data", paymentData);

  return (
    <div className='text-center px:0 lg:[36rem]'>
      <ReactToPrint
        trigger={() => (
          <button className='flex mt-4 ml-8 px-6 py-1 text-center bg-sky-400 text-white font-medium text-sm '>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              class='w-5 h-5'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z'
              />
            </svg>
            Print
          </button>
        )}
        content={() => componentRef.current}
      />
      {/* <ComponentToPrint ref={componentRef} paymentData={paymentData} id={id} /> */}
      <ComponentToPrint ref={componentRef} />
    </div>
  );
}

export default PrintComponent;