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
  editData?: any;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, ulbID, editData }) => {
  // const [selectedMarket, setSelectedMarket] = useState<string>('');
  const [marketInput, setMarketInput] = useState<string>('');
  const [addressInput, setAddressInput] = useState<string>('');
  const [isMarketValid, setIsMarketValid] = useState<boolean>(true); // Validation state
  const values = {
    location: marketInput,
    address: addressInput,
    id: ulbID
  };
  useEffect(() => {
    if (editData) {
      setMarketInput(editData.location || '');
      setAddressInput(editData.address || '');
    } else {
      setMarketInput('');
      setAddressInput('');
    }
  }, [editData]);

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

  const handleAddressInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressInput(event.target.value);
  };

  const handleSubmit = async () => {
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
      if (editData) {
        await fetchLocationEdit(); // Call the edit API
      } else {
        await fetchLocationAdd(); // Call the add API
      }
      // setSelectedMarket('');
      setMarketInput('');
      setAddressInput('');

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
        // toast.error("Failed to save location");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchLocationEdit = async () => {
    try {
      const res = await axios({
        url: `${ASSETS.LIST.locationEdit}`, // Assuming this is the URL for the edit endpoint
        method: "POST",
        data: { ...values, id: editData.id }, // Use the ID from editData for the update
      });

      if (res?.data?.status === true) {
        toast.success("Location Updated Successfully");
      } else {
        toast.error("Failed to update location");
      }
    } catch (error) {
      console.error("Error updating location:", error);
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
            onKeyPress={(e: any) => {
              if (!/[a-zA-Z0-9/-]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          <label htmlFor="addressInput">Address:</label>
          <input
            type="text"
            id="addressInput"
            value={addressInput}
            onChange={handleAddressInputChange}
            placeholder="Enter Address"
            required
            onKeyPress={(e: any) => {
              if (!/[a-zA-Z0-9,/-]/.test(e.key)) {
                e.preventDefault();
              }
            }}
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
