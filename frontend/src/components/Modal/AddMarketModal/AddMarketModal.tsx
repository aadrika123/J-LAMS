/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from 'react';
// import styles from './AddMarket.css';
import './AddMarket.css';
import toast from 'react-hot-toast';
import { ASSETS } from '@/utils/api/urls';
import axios from "@/lib/axiosConfig";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  ulbID: any
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, ulbID }) => {
  // const [selectedMarket, setSelectedMarket] = useState<string>('');
  const [marketInput, setMarketInput] = useState<string>('');
  const [isMarketValid, setIsMarketValid] = useState<boolean>(true); // Validation state
  const values = {
    location: marketInput,
    id: ulbID
  };

  useEffect(() => {
    if (isOpen) {
      console.log('Modal is opened');
      const modalElement = document.getElementById('modal-content');
      modalElement?.focus();
    } else {
      console.log('Modal is closed');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    const result = onClose();
    console.log('onClose returned:', result);
    return result;
  };

  // const handleMarketChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedMarket(event.target.value);
  // };

  const handleMarketInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMarketInput(event.target.value);
  };

  const handleSubmit = () => {
    if (
      // !selectedMarket ||
      !marketInput) {
      setIsMarketValid(false);
    } else {
      setIsMarketValid(true);
      toast.success('Market added successfully!',)
      console.log('Form Submitted with:', { marketInput, ulbID });

      values.location = marketInput;
      values.id = ulbID;

      // setSelectedMarket('');
      setMarketInput('');
      fetchLocationAdd()

      handleClose()
    }
  };


  const fetchLocationAdd = async () => {
    try {
      const res = await axios({
        url: `${ASSETS.LIST.locationadd}`,
        method: "POST",
        data: values,
      });

      if (res?.data?.status === true) {
        toast.success("Location Added Successfully");
        // window.location.reload()
        return res?.data?.data;

      } else {
        toast.error("Failed to save location");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  return (
    <div className={"modalOverlay"} onClick={handleClose}>
      <div
        id="modal-content"
        className={"modalContent"}
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
      >
        <button onClick={handleClose} className={"closeButton"}>X</button>
        <h2 className='text-bold'>Location Master</h2>

        {/* <div className={styles.marketSelection}>
          <label htmlFor="marketSelect" className={styles.selectLabel}>
            Select Circle:
          </label>
          <select
            id="marketSelect"
            value={selectedMarket}
            onChange={handleMarketChange}
            className={styles.selectInput}
            required
          >
            <option value="">-- Choose a Location --</option>
            {circleData?.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.circle_name} 
              </option>
            ))}
          </select>
        </div> */}

        <div className={"marketInput"}>
          <label htmlFor="marketInput">Location Name:</label>
          <input
            type="text"
            id="marketInput"
            value={marketInput}
            onChange={handleMarketInputChange}
            placeholder="Enter Location"
            required
          />
          {!isMarketValid && <span className={"error"}>Both fields are required!</span>}
        </div>

        <div className={"submitButtonContainer"}>
          <button
            onClick={handleSubmit}
            className={"submitButton"}
            disabled={!marketInput}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;