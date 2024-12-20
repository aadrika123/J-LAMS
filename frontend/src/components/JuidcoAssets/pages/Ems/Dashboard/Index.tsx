/* eslint-disable @typescript-eslint/no-explicit-any */
// /***
//  * Author: Jaideep
//  * Status: Open
//  * Uses: Form details for Assets Management 
//  */

"use client"

import { InnerHeading, SubHeading } from '@/components/Helpers/Heading'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Customer from "@/assets/icons/cv 1.png";
import PrimaryButton from '@/components/Helpers/Button';
import InputBox from '@/components/Helpers/InputBox';
import toast, { Toaster } from 'react-hot-toast';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from "yup";
import SelectForNoApi from '@/components/global/atoms/SelectForNoApi';
import { ASSETS } from '@/utils/api/urls';
import axios from "@/lib/axiosConfig";
import Jhar from "@/assets/icons/jhar.png"
// import styles from '@/components/Modal/AddMarketModal/Modal.module.css'
import '../../../../Modal/AddMarketModal/AddMarket.css'
import './Modal.css'
import './Building.css'




export const DashboardMain = () => {

  // interface Unit {
  //   index: number;
  //   type: string;
  //   length: number;
  //   breadth: number;
  //   height: number;
  //   name: string;
  //   property_name: string;
  //   type_of_plot: string;
  // }

  
  interface Unit {
    index: number;
    type: 'Commercial' | 'Residential';
    length?: number;
    breadth?: number;
    height?: number;
    name?: string;
    property_name?: string;
    [key: string]: any;  
  }

  

  interface FloorData {
    floor: number;
    plotCount: number;
    units: Record<string, Unit[]>;
  }

  type NavigationStackType = React.ReactNode[][];

  const [isLoading, setIsLoading] = useState(true);

  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [floorCount, setFloorCount] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState<any>(true);
  const [isModalVisibleData, setIsModalVisibleData] = useState<any>(false);
  // const [isModalVisibleSuccessData, setIsModalVisibleSuccessData] = useState<any>(false);
  const [data, setData] = useState<any>([]);
  // const [currentType, setCurrentType] = useState<any>(null);
  const [plotNo, setPlotNo] = useState<any>(0);
  // const [count, setCount] = useState<any>(0);
  const [, setNavigationStack] = useState<NavigationStackType>([]);
  // const [unitCompletion, setUnitCompletion] = useState<{ [key: string]: boolean }>({});
  const [sessionData, setSessionData] = useState<FloorData[]>([]);
  const [floorDisable, setFloorDisable] = useState(false);

  // const [floorCount, setFloorCount] = useState(3); // Example: Number of floors
  const [plotNos, setPlotNos] = useState<Array<number | string>>([]); // Initialize plot numbers
  const [selectedFloor, setSelectedFloor] = useState(null);


  const [ulbID, setUlbID] = useState<string | null>();


  const [commercialCount, setCommercialCount] = useState<any>(0);
  const [residentialCount, setResidentialCount] = useState<any>(0);


  // const [isCommercialChecked, setIsCommercialChecked] = useState(false);
  // const [isResidentialChecked, setIsResidentialChecked] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<string>('');
  const [circleData, setCircleData] = useState<any>([]);

  const [commercialUnits, setCommercialUnits] = useState<Unit[]>([]); // Array to hold commercial units data
  const [residentialUnits, setResidentialUnits] = useState<Unit[]>([])

  const [selectedUnit, setSelectedUnit] = useState<any>(null); // Track selected unit details for edit

  const handleMarketChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMarket(event.target.value);
  };





  useEffect(() => {
    const storedUserDetails = localStorage.getItem("user_details");
    if (storedUserDetails) {
      try {
        const userDetails = JSON.parse(storedUserDetails);
        setUlbID(userDetails.ulb_id || null);
         fetchData(userDetails.ulb_id);
      } catch (error) {
        console.error('Error parsing user details:', error);
      }
    }


  }, []);


  useEffect(() => {
    const numericFloorCount = parseInt(floorCount) || 0;
    setPlotNos(Array(numericFloorCount).fill(""));
  }, [floorCount]);

  const initialValues = {
    type_of_assets: "",
    asset_sub_category_name: "",
    assets_category_type: "",
    khata_no: "",
    plot_no: "",
    blue_print: "",
    ownership_doc: "",
    ward_no: "",
    address: "",
    // depreciation_method: "Straight Line Method",
    // apreciation_method: " Percentage Based Approach",
    type_of_land: "",
    area: "",
    order_no: "",
    order_date: "",
    acquisition: "",
    from_whom_acquired: "",
    mode_of_acquisition: "",
    role: "Municipal",
    building_approval_plan: "",
    no_of_floors: parseInt(floorCount),
    building_name: buildingName,
    ulb_id: ulbID,
    location: "",
  }

  const employeeValidationSchema = Yup.object().shape({
    khata_no: Yup.string().required("Khata No. is Required"),
    plot_no: Yup.string().required("Plot No. is Required"),
    type_of_assets: Yup.mixed().required("Choose Asset Category Name"),
    // asset_sub_category_name: Yup.mixed().required("Choose Asset Sub Category Name"),
    // assets_category_type: Yup.mixed().required("Choose Asset Category Type"),
    area: Yup.string().required("Area. is Required"),
    type_of_land: Yup.string().required("Type of Land"),
    // order_date: Yup.string().required("Enter order date"),
  });

  const handleUpload = async () => {
    if (file1) {
      const data = new FormData();
      data.append('file', file1);
      try {
        const response = await axios.post(`${ASSETS.LIST.validate}`, data);

        if (response.status === 200) {
          return {
            blue_print: response?.data?.data,
          };
        } else {
          toast.error("Failed to upload files");
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error("Error uploading files");
      }
    } else {
      console.log("not uploaded")
    }
  };

  const handleUpload2 = async () => {
    if (file2) {
      const data = new FormData();
      data.append('file', file2);
      try {
        const response = await axios.post(`${ASSETS.LIST.validate}`, data);

        if (response.status === 200) {
          return {
            ownership_doc: response?.data?.data
          };
        } else {
          toast.error("Failed to upload files");
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error("Error uploading files");
      }
    } else {
      console.log("not uploaded")
    }
  };


  const fetchData = async (ulbID: number) => {
    try {

      const res = await axios({
        url: `${ASSETS.LIST.locationselect}id=${ulbID}`,
        method: "GET",
      });
      setCircleData(res?.data?.data?.data);
      return res?.data?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [succeessId, setSucceessId] = useState();

  const handleSubmitFormik = async (values: any, { resetForm }: FormikHelpers<any>) => {
    try {
      // 
      const mergedUnits = [
        ...((Array.isArray(commercialUnits) ? commercialUnits : []) as any[]).map(unit => ({ ...unit, type: 'Commercial' })),
        ...((Array.isArray(residentialUnits) ? residentialUnits : []) as any[]).map(unit => ({ ...unit, type: 'Residential' }))
      ];
  
      const isUnitFilled = (unit: any) => {
        return unit?.length && unit?.breadth && unit?.height && unit?.name && unit?.property_name;
      };
  
      const filledUnits = mergedUnits.filter(unit => isUnitFilled(unit));

      const fileUploadData = await handleUpload();
      if (fileUploadData) {
        values.blue_print = fileUploadData.blue_print;
      }
  
      const fileUploadData2 = await handleUpload2();
      if (fileUploadData2) {
        values.ownership_doc = fileUploadData2.ownership_doc;
      }
  
      values.role = initialValues.role;
      values.no_of_floors = initialValues.no_of_floors;

      values.floorData = filledUnits.map((unit) => {
        const length = unit.length && !isNaN(Number(unit.length)) ? String(unit.length) : null;
        const breadth = unit.breadth && !isNaN(Number(unit.breadth)) ? String(unit.breadth) : null;
        const height = unit.height && !isNaN(Number(unit.height)) ? String(unit.height) : null;

        const plotCount = filledUnits.filter((unit) => unit.name === unit.name).length;
      
        const details = [{
          index: 1,  
          type: unit.type,
          length: length,
          breadth: breadth,
          height: height,  
          name: unit.name,
          property_name: unit.property_name,
          type_of_plot: unit.type === 'Commercial' ? 'Commercial' : 'Residential',
        }];
      
        return {
          floor: unit.name, 
          plotCount: plotCount, 
          type: unit.type, 
          details: details,  
        };
      });

      console.log("Mapped floorData:", values.floorData);
  
      values.building_name = buildingName;
      values.location = selectedMarket;

      const res = await axios({
        url: `${ASSETS.LIST.create}`,
        method: "POST", 
        data: values,
      });
  
      if (res?.data?.status === true) {
        toast.success("Assets successfully added");
        resetForm();
        setIsModalOpen(true);
        console.log("Asset ID:", res?.data?.data?.id);
        setSucceessId(res?.data?.data?.id);
      } else if (res?.data?.type === "DUPLICATE") {
        toast.error("Duplicate asset data found. Please check and try again.");
      } else {
        toast.error("Failed to add assets");
      }
  
    } catch (error) {
      toast.error("Failed to add Assets");
      console.error('Error submitting data:', error);
    }
  };
  
  
  
  
  
  



  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timeout);

  }, []);

  useEffect(() => {
    const storedData = sessionStorage.getItem('unitData');
    if (storedData) {
      setSessionData(JSON.parse(storedData));
    }
  }, [isModalVisibleData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#007335]"></div>
        <Image src={Jhar} alt="jhar" className="rounded-full h-28 w-28" />
      </div>
    );
  }

  // const generateBoxes = (count:any) => {
  //   return Array.from({ length: count }, (_, index) => index + 1);
  // };

  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0] ?? null;

    if (!file) {
      setFile1(null);
      return;
    }

    const fileType = file.type;
    const fileSize = file.size;

    const acceptedFileTypes = ["image/png", "image/jpeg", "application/pdf"];

    if (!acceptedFileTypes.includes(fileType)) {
      alert("Please upload a PNG, JPEG, or PDF file.");
      setFile1(null);
      fileInput.value = "";
      return;
    }

    if (fileSize / 1024 >= 2048) {
      alert("Cannot upload more than 2MB data!");
      setFile1(null);
      fileInput.value = "";
      return;
    }

    setFile1(file);
  };

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0] ?? null;

    if (!file) {
      setFile2(null);
      return;
    }

    const fileType = file.type;
    const fileSize = file.size;

    const acceptedFileTypes = ["image/png", "image/jpeg", "application/pdf"];

    if (!acceptedFileTypes.includes(fileType)) {
      alert("Please upload a PNG, JPEG, or PDF file.");
      setFile2(null);
      fileInput.value = "";
      return;
    }

    if (fileSize / 1024 >= 2048) {
      alert("Cannot upload more than 2MB data!");
      setFile2(null);
      fileInput.value = "";
      return;
    }

    setFile2(file);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    const lastYearDate = new Date();
    lastYearDate.setFullYear(currentDate.getFullYear() - 1);

    currentDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    lastYearDate.setHours(0, 0, 0, 0);

    if (selectedDate < lastYearDate) {
      toast.error("Please select a date within the last year or a future date!");
      return false;
    }
    return true;
  };

  const handleBack = () => {
    window.location.replace("/lams/apply/approve-application");
  }

  const handleSave = (value: boolean) => {

    if (buildingName?.length === 0 && floorCount?.length === 0) {
      toast.error("Building Name & Floor Cannot be Empty")
      return false;
    } else if (buildingName?.length == 0) {
      toast.error("Building Name Cannot be Empty")
      return false;
    } else if (floorCount?.length == 0) {
      toast.error("Floor Cannot be Empty")
      return false;
    }


    const numericFloorCount = Number(floorCount);


    if (isNaN(numericFloorCount) || numericFloorCount < 0) {
      console.error("Invalid floor count");
      return;
    }

    const boxes = Array.from({ length: numericFloorCount }, () => (
      <></> // Return an empty fragment
    ));

    // Only proceed if floorCount is greater than 0
    if (numericFloorCount > 0) {
      setFloorDisable(true);
      setNavigationStack((prevStack) => [...prevStack, boxes] as any);
      if (value) {
        handleTypeBox({ target: { value: numericFloorCount } }, 'Residential', 0);
        handleTypeBox({ target: { value: numericFloorCount } }, 'Commercial', 0);
      }

    }

  };


  const handleFloor = (index: any) => {
    setSelectedFloor(index);
    if (!data[index]) {
      setData((prevData: any) => {
        const updatedData = Array.isArray(prevData) ? [...prevData] : [];
        if (!updatedData[index]) {
          updatedData[index] = { floor: index, units: {}, plotCount: 0 };
        }
        return updatedData;
      });
    }
  
    setNavigationStack((prevStack) => [...prevStack,] as any);
  };

  const handlePlotCountChange = (e: any, index: any) => {
    const plotNumber = parseInt(e.target.value);
    setPlotNo(plotNumber);

    setPlotNos((prev) => {
      const newPlotNos = [...prev];
      newPlotNos[index] = plotNumber; // Update the specific index
      return newPlotNos;
    });

    setData((prevData: any) => {
      const updatedData = Array.isArray(prevData) ? [...prevData] : [];
      if (!updatedData[index]) {
        updatedData[index] = { floor: index + 2, units: {}, plotCount: plotNumber };
      } else {
        updatedData[index].plotCount = plotNumber;
      }
      return updatedData;
    });
  };

  // const handleTypeSelect = (type: any) => {
  //   setCurrentType(type);
  //   const typeBox = (
  //     <>


  //     </>

  //   );
  //   setNavigationStack((prevStack) => [...prevStack, [typeBox]] as any);
  // };

  const handleCommercial = (val: any) => {
    setCommercialCount(parseInt(val) || 0);
  }


  const handleresidential = (val: any) => {
    setResidentialCount(parseInt(val) || 0);
  }

  const handleTypeBox = (e: any, type: string, index: number | null) => {
    const count = parseInt(e?.target?.value) || e || 0;

    if (isNaN(count)) return;

    // setCount(count);

    let ResidentialData:number = 0;
    let commercialData:number = 0;

    if (type === 'Residential') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ResidentialData = count;
    } else if (type === 'Commercial') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      commercialData = count;
      if (count > 10) {
        toast.error("Max 10 Floors");
        return;
      }
    }

    setData((prevData: any) => {
      const updatedData = Array.isArray(prevData) ? [...prevData] : [];
      if (index !== null && index >= 0 && index < updatedData.length) {
        const floorObj = updatedData[index];
        if (floorObj) {
          floorObj.units[type] = new Array(count).fill({}).map((_, unitIndex) => ({
            index: unitIndex + 1,
            type,
          }));
        }
      } else {
        console.error("Invalid index:", index);
      }
      return updatedData;
    });

    const newBoxes = Array.from({ length: count }, (_, boxIndex) => (
      <div key={`box-${index}-${boxIndex}`} className='flex flex-column'>
        <br />
        {type === 'Commercial' && (
          <input
            type="text"
            readOnly
            className={`border p-2 ml-2 justify-center items-center w-[3rem] text-slate-600 cursor-pointer rounded-md bg-[#d6fce7]`}
            placeholder={`${boxIndex + 1}`}
            onClick={() => handleInnerFloor(index, 'Commercial', boxIndex)}
          />
        )}
        {type === 'Residential' && (
          <input
            type="text"
            readOnly
            className={`border p-2 ml-2 justify-center items-center w-[3rem] text-slate-600 cursor-pointer rounded-md bg-[#e7e5ff]`}
            placeholder={`${boxIndex + 1}`}
            onClick={() => handleInnerFloor(index, 'Residential', boxIndex)}
          />
        )}
        <br />
      </div>
    ));

    setNavigationStack((prevStack) => {
      const newStack = [...prevStack];
      newStack[newStack.length - 1] = [newBoxes];
      return newStack;
    });
  };





  // Generate boxes for the given count
  const generateBoxes = (count: any) => {
    return Array.from({ length: count }, (_, index) => index + 1);
  };

  // Handle click on unit number to show input fields
  const handleUnitClick = (unitType: string, unitIndex: number) => {
    setSelectedUnit({ type: unitType, index: unitIndex });
  };

  // Handle input change for unit details
  const handleUnitDetailsChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    if (selectedUnit) {
        if (selectedUnit.type === "Commercial") {
      const updatedUnits = [...commercialUnits];
      updatedUnits[selectedUnit.index] = {
        ...updatedUnits[selectedUnit.index],
        [field]: value,
      };
      setCommercialUnits(updatedUnits);
    } else if (selectedUnit.type === "Residential") {
      const updatedUnits = [...residentialUnits];
      updatedUnits[selectedUnit.index] = {
        ...updatedUnits[selectedUnit.index],
        [field]: value,
      };
      setResidentialUnits(updatedUnits);
    }
    }
  };



  const handleInnerFloor = (floorIndex: any, type: any, unitIndex: any) => {
    const sessionData = JSON.parse(sessionStorage.getItem('unitData') as any) || [];
    const floorData = sessionData.find((floor: any) => floor?.floor === floorIndex);
    const unitData = floorData?.units[type]?.[unitIndex] || {};

    const innerBoxes = (
      <>


        <div>  <h4 className='text-sm text-[#4338CA] font-semibold mx-4'> Unit Number :-  <span className="font-normal">{unitIndex + 1}</span></h4></div>
        <div key={`${floorIndex}-${type}-${unitIndex}`}>

          <input
            type="text"
            className="border p-2 m-2"
            placeholder="Length in meter"
            defaultValue={unitData.length || ""}
            onChange={(e) => handleUnitDetails(e, floorIndex, type, unitIndex, "length")}
            maxLength={10}
            onKeyPress={(e: any) => {
              if (!(e.key >= "0" && e.key <= "9")) {
                e.preventDefault();
              }
            }}
          />
          <input
            type="text"
            className="border p-2 m-2"
            placeholder="Breadth in meter"
            defaultValue={unitData.breadth || ""}
            onChange={(e) => handleUnitDetails(e, floorIndex, type, unitIndex, "breadth")}
            maxLength={10}
            onKeyPress={(e: any) => {
              if (!(e.key >= "0" && e.key <= "9")) {
                e.preventDefault();
              }
            }}
          />
          <input
            type="text"
            className="border p-2 m-2"
            placeholder="Height in meter"
            defaultValue={unitData.height || ""}
            onChange={(e) => handleUnitDetails(e, floorIndex, type, unitIndex, "height")}
            maxLength={10}
            onKeyPress={(e: any) => {
              if (!(e.key >= "0" && e.key <= "9")) {
                e.preventDefault();
              }
            }}
          />
          <input
            type="text"
            className="border p-2 m-2"
            placeholder="Name"
            defaultValue={unitData.name || ""}
            onChange={(e) => handleUnitDetails(e, floorIndex, type, unitIndex, "name")}
            maxLength={30}
            onKeyPress={(e: any) => {
              if (
                !(
                  (e.key >= "a" || e.key >= "z") ||
                  (e.key <= "A" || e.key <= "Z") ||
                  e.key === " "
                )
              ) {
                e.preventDefault();
              }
            }}
          />
          <input
            type="text"
            className="border p-2 m-2"
            placeholder="Property Name"
            defaultValue={unitData.property_name || ""}
            onChange={(e) => handleUnitDetails(e, floorIndex, type, unitIndex, "property_name")}
            maxLength={10}
            onKeyPress={(e: any) => {
              if (
                !(
                  (e.key >= "a" || e.key >= "z") ||
                  (e.key <= "A" || e.key <= "Z") ||
                  (e.key <= "0" || e.key <= "9") ||
                  e.key === " "
                )
              ) {
                e.preventDefault();
              }
            }}
          />

          <select className="border p-2 m-2"
            value={unitData.type_of_plot}
            defaultValue={unitData.type_of_plot || ""}
            onChange={(e) => handleUnitDetails(e, floorIndex, type, unitIndex, "type_of_plot")}>
            <option>Choose the below options</option>
            <option value="Enclosed">Enclosed</option>
            <option value="Non-Enclosed">Non-Enclosed</option>
          </select>

          <br></br>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                handleSave(true);
                setNavigationStack((prevStack) => [...prevStack, [innerBoxes]] as any);
              }}
              className="bg-[#4338CA] text-white p-3 text-sm rounded-xl w-[15rem] items-center justify-center"
            >
              Save & Move to Floor Part
            </button>
          </div>
        </div>
      </>
    );

    setNavigationStack((prevStack) => [...prevStack, [innerBoxes]] as any);
  };

  // const handleUnitDetails = (e: any, floorIndex: any, type: any, unitIndex: any, field: any) => {
  //   const value = e.target.value;
  //   setData((prevData: any) => {
  //     const updatedData = Array.isArray(prevData) ? [...prevData] : [];
  //     let floorObj = updatedData.find((floor) => floor?.floor === floorIndex );
  //     if (!floorObj) {
  //       floorObj = { floor: floorIndex , units: {} };
  //       updatedData[floorIndex] = floorObj;
  //     }

  //     if (!floorObj.units[type]) {
  //       floorObj.units[type] = [];
  //     }

  //     if (!floorObj.units[type][unitIndex]) {
  //       floorObj.units[type][unitIndex] = {};
  //     }

  //     const unit = floorObj.units[type][unitIndex];
  //     const allFieldsFilled = unit?.length && unit?.breadth && unit?.height && unit?.name;

  //     floorObj.units[type][unitIndex][field] = value;

  //     if (allFieldsFilled) {
  //       console.log(`Unit ${unitIndex } details:`, unit);
  //       sessionStorage.setItem('unitData', JSON.stringify(updatedData));
  //       const storedData = sessionStorage.getItem('unitData');
  //       if (storedData) {
  //         setSessionData(JSON.parse(storedData));
  //       }

  //       setUnitCompletion((prevCompletion) => ({
  //         ...prevCompletion,
  //         [`${unitIndex }`]: allFieldsFilled,
  //       }));
  //     }

  //     return updatedData;
  //   });
  // };


  const handleUnitDetails = (e: any, floorIndex: any, type: any, unitIndex: any, field: any) => {
    const value = e.target.value;

    setData((prevData: any) => {
      // Get existing data from sessionStorage
      const storedData = sessionStorage.getItem('unitData');
      const initialData = storedData ? JSON.parse(storedData) : [];

      // Create a copy of the initial data
      const updatedData = Array.isArray(prevData) ? [...prevData] : [...initialData];

      // Find or create floor object
      let floorObj = updatedData.find((floor) => floor?.floor === floorIndex);
      if (!floorObj) {
        floorObj = { floor: floorIndex, units: {}, plotCount: 0 };
        updatedData.push(floorObj); // Use push instead of setting at an index
      }

      // Ensure the units object for the specific type exists
      if (!floorObj.units[type]) {
        floorObj.units[type] = [];
      }

      // Check if unit already exists for the specified unitIndex
      let unit = floorObj.units[type].find((u: any) => u.index === unitIndex);
      if (!unit) {
        // If not, create a new unit
        unit = { index: unitIndex, type, length: "", breadth: "", height: "", name: "", property_name: "", type_of_plot: "" };
        floorObj.units[type].push(unit);
      }

      // Update the field value for the specific unit
      unit[field] = value;

      // Save updated data to sessionStorage
      sessionStorage.setItem('unitData', JSON.stringify(updatedData));

      // Return the updated data for the state
      return updatedData;
    });
  };


  // const transformDataForAPI = (data: any) => {
  //   return data
  //     .filter((item: any) => item)
  //     .flatMap((floor: any) =>
  //       Object.entries(floor.units).map(([type, units]: any) => ({
  //         floor: floor.floor,
  //         plotCount: floor.plotCount,
  //         type,
  //         details: units.filter((unit: any) => unit),
  //       }))
  //     );
  // };

  const handleBackss = () => {
    setNavigationStack((prevStack) => {
      if (prevStack.length > 1) {
        const newStack = prevStack.slice(0, -1);
        return newStack;
      }
      return prevStack;
    });
  };

  const handleClose = () => {
    setIsModalVisible(false)
  }

  const handleCloseDataModal = () => {
    setIsModalVisibleData(false)
  }


  const handleCloseSuccessModal = () => {
    // setIsModalVisibleSuccessData(false);
    setIsModalOpen(false);
    window.location.replace("/lams/apply/approve-application");
  }


  return (
    <div>
      <div className="flex items-center justify-between border-b-2 pb-7 mb-10">
        <div className="flex items-center">
          <PrimaryButton
            buttonType="button"
            variant={"cancel"}
            onClick={handleBack}
            className="border-0 bg-transparent hover:bg-transparent hover:text-[#3592FF] flex items-center"
          >
            <i>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="20"
                viewBox="0 0 25 25"
                fill="none"
              >
                <g clipPath="url(#clip0_949_7008)">
                  <path
                    d="M10.6736 7.20536L4 13.9137L10.6736 20.622C10.7339 20.7012 10.8105 20.7665 10.8981 20.8134C10.9858 20.8604 11.0826 20.888 11.1819 20.8943C11.2812 20.9007 11.3806 20.8856 11.4736 20.8501C11.5666 20.8147 11.6508 20.7597 11.7206 20.6888C11.7905 20.618 11.8443 20.533 11.8784 20.4395C11.9125 20.3461 11.9262 20.2464 11.9184 20.1472C11.9107 20.048 11.8817 19.9517 11.8335 19.8646C11.7853 19.7776 11.7189 19.702 11.6389 19.6429L6.64583 14.6081H19.9306C20.1147 14.6081 20.2914 14.535 20.4216 14.4047C20.5518 14.2745 20.625 14.0979 20.625 13.9137C20.625 13.7295 20.5518 13.5529 20.4216 13.4227C20.2914 13.2924 20.1147 13.2193 19.9306 13.2193H6.64583L11.6389 8.18453C11.7687 8.05376 11.8413 7.87677 11.8407 7.69249C11.84 7.50821 11.7662 7.33174 11.6354 7.20189C11.5047 7.07205 11.3277 6.99946 11.1434 7.00012C10.9591 7.00077 10.7826 7.0746 10.6528 7.20536H10.6736Z"
                    fill="#665DD9"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_949_7008">
                    <rect
                      width="25"
                      height="25"
                      fill="white"
                      transform="matrix(0 -1 1 0 0 25)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </i>
            Back
          </PrimaryButton>
        </div>
        <div>
          <InnerHeading className="mx-5 my-5 mb-0 text-2xl">
            Asset Registration
          </InnerHeading>
        </div>
      </div>

      <div className="border rounded-lg bg-white border-[#D9E4FB] p-10 px-10 pb-30 pt-20 shadow-md">
        <div className="flex justify-between mb-10">
          <SubHeading>
            <Image src={Customer} alt="employee" width={40} height={20} />
            <span className="ml-2">Asset Registration</span>
          </SubHeading>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={employeeValidationSchema}
          onSubmit={handleSubmitFormik}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
          }) => {

            useEffect(() => {
              if (values.type_of_assets === 'Building') {
                setIsModalVisible(true);
              }
            }, [values.type_of_assets]);

            // const handleDataModal = () => {
            //   setIsModalVisibleData(!isModalVisibleData)
            // }


            return (
              <>
                <form onSubmit={handleSubmit} className="relative">
                  <Toaster />
                  <div className="grid grid-cols-2 2xl:grid-cols-3 gap-x-6 gap-4 ">

                    {/* ------------------------------------------------------- */}

                    <SelectForNoApi
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.type_of_assets}
                      error={errors.type_of_assets}
                      touched={touched.type_of_assets}
                      label="Asset Category Name"
                      name="type_of_assets"
                      required={true}
                      placeholder={"Choose Asset Category Name"}
                      options={[

                        {
                          id: 1,
                          name: "Building",
                        },
                        {
                          id: 2,
                          name: "Hall",
                        },
                        {
                          id: 3,
                          name: "Vacant Land",
                        },
                        {
                          id: 4,
                          name: "Others",
                        }
                      ]}
                    />

                    {values.type_of_assets === 'Building' && isModalVisible && (
                      <div className="fixed inset-0 flex items-center justify-center">
                        {/* Background Overlay for Blur Effect */}
                        <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm z-10"></div>

                        {/* Modal Content */}
                        <div className="bg-slate-100 p-6 rounded shadow-md w-[70rem] max-h-[80vh] overflow-auto z-20">
                          <div className='mb-[3rem]'>
                            <button onClick={handleClose} className='bg-red-600 text-white float-right ml-4 w-[3rem] p-2 rounded-xl'>X</button>
                            <button onClick={handleBackss} className="bg-[#4338CA] text-white float-right ml-4 w-50 p-2 rounded-xl">Save & Back</button>
                            {/* <button onClick={handleDataModal} className="bg-[#4338CA] text-white float-right ml-4 w-50 p-2 rounded-xl">View Data</button> */}
                          </div>

                          <div>
                            <input
                              type="text"
                              value={buildingName}
                              onChange={(e) => setBuildingName(e.target.value)}
                              placeholder="Building Name"
                              className="border p-2 m-2"
                              disabled={floorDisable}
                            />
                            <input
                              type="number"
                              value={floorCount}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                // Only update state if the value is valid (1 to 10)
                                if (!isNaN(value) && value >= 1 && value <= 10) {
                                  setFloorCount(value.toString()); // Convert number to string
                                } else if (e.target.value === '') {
                                  // Allow empty input to clear the value
                                  setFloorCount('');
                                }
                              }}
                              placeholder="Number of Floors"
                              className="border p-2 m-2"
                              disabled={floorDisable}
                              min={1}
                              max={10}
                            />




                            <button onClick={() => { handleSave(false) }} className="bg-[#4338CA] text-white p-2 ml-[-1rem]" disabled={floorDisable}>Add Floor</button>

                            {floorDisable ? (
                              <div className='flex flex-row'>
                                {Array.from({ length: Math.max(Number(floorCount), 0) + 2 }, (_, index) => (
                                  <div key={index}>
                                    <input
                                      type="text"
                                      readOnly
                                      className={`border p-2 ml-2 justify-center items-center w-[3rem] text-white cursor-pointer rounded-md ${selectedFloor === index ? 'bg-[#d6fce7]' : 'bg-[#4338CA]'
                                        }`}
                                      placeholder={index === 0 ? 'B' : (index - 1).toString()} // Adjust placeholder
                                      onClick={() => handleFloor(index)}
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : null}





                            {selectedFloor !== null && (
                              <div key={`popup-${selectedFloor}`} className="flex items-center mb-4">
                                <input
                                  type="text"
                                  className="border p-2 m-2"
                                  placeholder={`No of shop/flat on the floor ${selectedFloor === 0 ? 'B' : selectedFloor - 1}`}
                                  value={plotNos[selectedFloor] || ''}
                                  onChange={(e) => handlePlotCountChange(e, selectedFloor)}
                                  maxLength={3}
                                  onKeyPress={(e) => {
                                    if (!(e.key >= "0" && e.key <= "9")) {
                                      e.preventDefault();
                                    }
                                  }}
                                />

                                {/* <button
                                  className={`bg-[#4338CA] w-30 text-white mt-2 p-3 ml-3 text-sm rounded-xl ${currentType === "Commercial" ? "bg-[#28b145]" : ""}`}
                                  onClick={() => handleTypeSelect("Commercial")}
                                >
                                  Commercial
                                </button> */}

                                {/* <button
                                  className={`bg-[#4338CA] w-30 text-white mt-2 p-3 ml-4 text-sm rounded-xl ${currentType === "Residential" ? "bg-[#28b145]" : ""}`}
                                  onClick={() => handleTypeSelect("Residential")}
                                >
                                  Residential
                                </button> */}
                              </div>
                            )}

                            {plotNo > 0 &&
                              <div>
                                <input
                                  key={`type-Commercial`}
                                  type="text"
                                  className="border p-2 m-2"
                                  placeholder={`Number of Commercial units`}
                                  onChange={(e) => {
                                    handleCommercial(parseInt(e.target.value));
                                    handleTypeBox(e, 'Commercial', null);
                                  }}
                                  maxLength={2}
                                  onKeyPress={(e) => {
                                    if (!(e.key >= "0" && e.key <= "9")) {
                                      e.preventDefault();
                                    }
                                  }}
                                  // disabled={isCommercialChecked} // Disable if checked
                                />
                              <label htmlFor="">Commercial</label>

                                <input
                                  key={`type-Residential`}
                                  type="text"
                                  className="border p-2 m-2"
                                  placeholder={`Number of Residential units`}
                                  onChange={(e) => {
                                    handleresidential(parseInt(e.target.value));
                                    handleTypeBox(e, 'Residential', null);
                                  }}
                                  maxLength={2}
                                  onKeyPress={(e) => {
                                    if (!(e.key >= "0" && e.key <= "9")) {
                                      e.preventDefault();
                                    }
                                  }}
                                  // disabled={isResidentialChecked} // Disable if checked
                                />
                               <label htmlFor="">Residential</label>
                              </div>}


                              <div className="count-display">
        <h4 className="text-sm text-[#4338CA] font-semibold mx-4">Commercial Data:</h4>
        <div className="boxes">
          {generateBoxes(commercialCount).map((num) => (
            <span
              key={num}
              className="box"
              onClick={() => handleUnitClick("Commercial", num - 1)} // Handle click on commercial unit
            >
              {num}
            </span>
          ))}
        </div>

        <h4 className="text-sm text-[#4338CA] font-semibold mx-4">Residential Data:</h4>
        <div className="boxes">
          {generateBoxes(residentialCount).map((num) => (
            <span
              key={num}
              className="box"
              onClick={() => handleUnitClick("Residential", num - 1)} // Handle click on residential unit
            >
              {num}
            </span>
          ))}
        </div>
      </div>

      {/* Show Input Fields When a Unit is Clicked */}
      {selectedUnit && (
        <div>
          <h4>{selectedUnit.type} Unit {selectedUnit.index + 1} Details:</h4>

          {/* Length Input */}
          <input
            type="text"
            className="border p-2 m-2"
            placeholder="Length in meters"
            value={selectedUnit.type === "Commercial" ? commercialUnits[selectedUnit.index]?.length || "" : residentialUnits[selectedUnit.index]?.length || ""}
            onChange={(e) => handleUnitDetailsChange(e, "length")}
          />

          {/* Breadth Input */}
          <input
            type="text"
            className="border p-2 m-2"
            placeholder="Breadth in meters"
            value={selectedUnit.type === "Commercial" ? commercialUnits[selectedUnit.index]?.breadth || "" : residentialUnits[selectedUnit.index]?.breadth || ""}
            onChange={(e) => handleUnitDetailsChange(e, "breadth")}
          />

          {/* Height Input */}
          <input
            type="text"
            className="border p-2 m-2"
            placeholder="Height in meters"
            value={selectedUnit.type === "Commercial" ? commercialUnits[selectedUnit.index]?.height || "" : residentialUnits[selectedUnit.index]?.height || ""}
            onChange={(e) => handleUnitDetailsChange(e, "height")}
          />

          {/* Name Input */}
          <input
            type="text"
            className="border p-2 m-2"
            placeholder="Owner Name"
            value={selectedUnit.type === "Commercial" ? commercialUnits[selectedUnit.index]?.name || "" : residentialUnits[selectedUnit.index]?.name || ""}
            onChange={(e) => handleUnitDetailsChange(e, "name")}
          />

          {/* Property Name Input */}
          <input
            type="text"
            className="border p-2 m-2"
            placeholder="Property Name"
            value={selectedUnit.type === "Commercial" ? commercialUnits[selectedUnit.index]?.property_name || "" : residentialUnits[selectedUnit.index]?.property_name || ""}
            onChange={(e) => handleUnitDetailsChange(e, "property_name")}
          />

          {/* Save Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={()=>handleSave(true)}
              className="bg-[#4338CA] text-white p-3 text-sm rounded-xl w-[15rem] items-center justify-center"
            >
              Save & Move to Next Step
            </button>
          </div>
        </div>
      )}

      {/* Display Saved Data */}
<div className="container mx-auto p-4">
  {/* Commercial Units Section */}
  <h4 className="text-lg font-semibold text-[#4338CA] mb-4">Commercial Units:</h4>
  {commercialUnits?.length > 0 ? (
    <div className="space-y-4">
      {/* Displaying Commercial Units */}
      <div className="grid grid-cols-4 gap-4">
        {commercialUnits.map((unit, index) => {
          const isValid = unit?.length && unit?.breadth && unit?.height && unit?.name && unit?.property_name;
          
          return (
            <div 
              key={index} 
              className={`card p-4 rounded-lg ${isValid ? 'bg-green-100' : 'bg-yellow-100'} shadow-lg`} 
            >
              <h5 className={`font-semibold text-lg ${isValid ? 'text-green-600' : 'text-yellow-600'}`}>Unit {index + 1}</h5>
              <div className="space-y-2">
                <p><strong>Length:</strong> {unit?.length || "N/A"} meters</p>
                <p><strong>Breadth:</strong> {unit?.breadth || "N/A"} meters</p>
                <p><strong>Height:</strong> {unit?.height || "N/A"} meters</p>
                <p><strong>Name:</strong> {unit?.name || "N/A"}</p>
                <p><strong>Property Name:</strong> {unit?.property_name || "N/A"}</p>
              </div>
              {/* If incomplete data, show an empty block (yellow) */}
              {!isValid && <div className="w-full h-24 bg-yellow-300 mt-2 rounded"></div>}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <p>No Commercial units saved yet.</p>
  )}

  {/* Residential Units Section */}
  <h4 className="text-lg font-semibold text-[#4338CA] mb-4 mt-8">Residential Units:</h4>
  {residentialUnits?.length > 0 ? (
    <div className="space-y-4">
      {/* Displaying Residential Units */}
      <div className="grid grid-cols-4 gap-4">
        {residentialUnits.map((unit, index) => {
          const isValid = unit?.length && unit?.breadth && unit?.height && unit?.name && unit?.property_name;
          
          return (
            <div 
              key={index} 
              className={`card p-4 rounded-lg ${isValid ? 'bg-green-100' : 'bg-yellow-100'} shadow-lg`} 
            >
              <h5 className={`font-semibold text-lg ${isValid ? 'text-green-600' : 'text-yellow-600'}`}>Unit {index + 1}</h5>
              <div className="space-y-2">
                <p><strong>Length:</strong> {unit?.length || "N/A"} meters</p>
                <p><strong>Breadth:</strong> {unit?.breadth || "N/A"} meters</p>
                <p><strong>Height:</strong> {unit?.height || "N/A"} meters</p>
                <p><strong>Name:</strong> {unit?.name || "N/A"}</p>
                <p><strong>Property Name:</strong> {unit?.property_name || "N/A"}</p>
              </div>
              {/* If incomplete data, show an empty block (yellow) */}
              {!isValid && <div className="w-full h-24 bg-yellow-300 mt-2 rounded"></div>}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <p>No Residential units saved yet.</p>
  )}
</div>





                            commercial data :- {commercialCount}   ResidentialCount data:- {residentialCount}




                            {/* <div className="flex flex-col">
                              {inputBoxes.length > 0 ? (
                                <div className="h-[12rem] overflow-x-auto">
                                  {inputBoxes}
                                </div>
                              ) : null}
                            </div> */}

                            <h3 className='text-sm text-[#4338CA] font-bold mx-4'>Entered Data:-</h3>
                            <h4 className='text-sm text-[#4338CA] font-semibold mx-4'>Total Floor: <span className="font-normal">{floorCount || 0}</span></h4>
                            <h4 className='text-sm text-[#4338CA] font-semibold mx-4'>Total Shop/Flat: <span className="font-normal">{plotNo || 0}</span></h4>
                            {/* {currentType && <h4 className='text-sm text-[#4338CA] font-semibold mx-4'>Number of {currentType} units: <span className="font-normal">{count || 0}</span></h4>} */}

                            {/* {sessionData.length > 0 ? (
                              <div className="p-4 max-h-[40vh] overflow-y-auto">
                                {sessionData.map((floorData, floorIndex) => {
                                  if (!floorData) return null; // Skip null entries

                                  // Determine the display label for the floor
                                  const floorLabel = floorIndex === 0 ? "Basement" : `Floor ${floorIndex - 1}`;

                                  return (
                                    <div key={floorIndex} className="mb-4 border p-4 rounded-lg shadow-md">
                                      <h2 className="text-lg font-bold mb-2">{floorLabel}</h2>
                                      <p className="mb-2">Plot Count: {floorData?.plotCount}</p>

                                      {floorData?.units && Object.entries(floorData.units).length > 0 ? (
                                        Object.entries(floorData.units).map(([unitType, units]) => (
                                          <div key={unitType} className="mb-4">
                                            <h3 className="text-md font-semibold mb-2">{unitType} Units</h3>
                                            {units.map((unit, unitIndex) => (
                                              <div key={unitIndex} className="mb-2 p-2 border rounded grid grid-cols-3 gap-4">
                                                <p><strong>Index:</strong> {unit?.index}</p>
                                                <p><strong>Type:</strong> {unit?.type}</p>
                                                <p><strong>Length:</strong> {unit?.length}</p>
                                                <p><strong>Breadth:</strong> {unit?.breadth}</p>
                                                <p><strong>Height:</strong> {unit?.height}</p>
                                                <p><strong>Name:</strong> {unit?.name}</p>
                                                <p><strong>Property Name:</strong> {unit?.property_name}</p>
                                                <p><strong>Type of Plot:</strong> {unit?.type_of_plot}</p>
                                              </div>
                                            ))}
                                          </div>
                                        ))
                                      ) : (
                                        <p>No units available.</p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-center">No data available.</p>
                            )} */}

                          </div>
                        </div>
                      </div>
                    )}



                    {/* Data modal */}
                    {/* {isModalVisibleData && (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm z-10"></div>
    <div className="bg-slate-100 p-6 rounded shadow-md w-[70rem] z-20">
      <div className='mb-[3rem]'>
        <button onClick={handleCloseDataModal} className='bg-red-600 text-white float-right ml-4 w-[3rem] p-2 rounded-xl'>X</button>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Building Status Overview</h2>

        <div className="grid grid-cols-3 gap-4">
          {staticData.map((floorData, floorIndex) => (
            <div key={floorIndex} className="mb-4 border p-4 rounded-lg shadow-md">
              <h3 className="text-md font-semibold mb-2">Floor: {floorData.floor}</h3>
              <p className="mb-2">Plot Count: {floorData.plotCount}</p>

              <div className="flex flex-wrap">
                {floorData.units.map((unit, unitIndex) => {
                  let statusColor;
                  switch (unit.status) {
                    case 'Booked':
                      statusColor = 'bg-red-200'; 
                      break;
                    case 'Vacant':
                      statusColor = 'bg-green-200'; 
                      break;
                    default:
                      statusColor = 'bg-yellow-200'; 
                  }

                  return (
                    <div key={unitIndex} className={`m-2 p-2 border rounded ${statusColor} text-center`}>
                      <p className="font-bold">Unit {unit.index}</p>
                      <p>{unit.status}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)} */}


                    {/* Data Modal */}
                    {isModalVisibleData && (
                      <div className="fixed inset-0 flex items-center justify-center">
                        {/* Background Overlay for Blur Effect */}
                        <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm z-10"></div>

                        {/* Modal Content */}
                        <div className="bg-slate-100 p-6 rounded shadow-md w-[70rem] z-20 max-h-[80vh] overflow-auto">
                          <div className='mb-[3rem]'>
                            <button onClick={handleCloseDataModal} className='bg-red-600 text-white float-right ml-4 w-[3rem] p-2 rounded-xl'>X</button>
                          </div>

                          {sessionData.length > 0 ? (
                            <div className="p-4">
                              <h2 className="text-lg font-bold mb-4">Building Status Overview (with units)</h2>

                              <div className="grid grid-cols-3 gap-4">
                                {sessionData.map((floorData, floorIndex) => {
                                  if (!floorData) return null; // Skip null entries

                                  // Determine the display label for the floor
                                  const floorLabel = floorIndex === 0 ? "Basement" : `Floor ${floorIndex - 1}`;

                                  return (
                                    <div key={floorIndex} className="mb-4 border p-4 rounded-lg shadow-md">
                                      <h3 className="text-md font-semibold mb-2">{floorLabel}</h3>
                                      <p className="mb-2">Plot Count: {floorData.plotCount}</p>

                                      <div className="flex flex-wrap">
                                        {floorData.units && Object.entries(floorData.units).map(([unitType, units]) => (
                                          <div key={unitType} className="mb-4">
                                            <h4 className="font-semibold">{unitType} Units:</h4>
                                            {units.length > 0 ? (
                                              units.map((unit, unitIndex) => {
                                                const isBooked = unit.length && unit.breadth && unit.height; // Check for detailed properties
                                                const statusColor = isBooked ? 'bg-yellow-200' : 'bg-green-200'; // Red for booked, green for vacant

                                                return (
                                                  <div key={unitIndex} className={`m-2 p-2 border rounded ${statusColor} text-center`}>
                                                    <p className="font-bold">Unit {unit.index + 1}</p>
                                                    <p>Type: {unit.type}</p>
                                                    {isBooked && (
                                                      <>
                                                        <p>Length: {unit.length}</p>
                                                        <p>Breadth: {unit.breadth}</p>
                                                        <p>Height: {unit.height}</p>
                                                        <p>Name: {unit.name}</p>
                                                        {unit.property_name && <p>Property Name: {unit.property_name}</p>}
                                                      </>
                                                    )}
                                                    {!isBooked && <p>Status: Vacant</p>}
                                                  </div>
                                                );
                                              })
                                            ) : (
                                              <div className={`m-2 p-2 border rounded bg-green-200 text-center`}>
                                                <p className="font-bold">No Units Available</p>
                                                <p>Status: Vacant</p>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <p className="text-center">No data available.</p>
                          )}

                        </div>
                      </div>
                    )}






                    <SelectForNoApi
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.asset_sub_category_name}
                      error={errors.asset_sub_category_name}
                      touched={touched.asset_sub_category_name}
                      label="Asset Sub-Category Name"
                      name="asset_sub_category_name"
                      placeholder={"Choose Asset Sub Category Name"}
                      options={[
                        {
                          id: 1,
                          name: "Hospitals",
                        },
                        {
                          id: 2,
                          name: "Library",
                        },
                        {
                          id: 3,
                          name: "Parking",
                        },
                        {
                          id: 4,
                          name: "Enclosed/Non-Enclosed",
                        },
                        ...(values.type_of_assets === "Building" ? [] : [
                          {
                            id: 5,
                            name: "Vacant Land",
                          },
                        ]),
                        {
                          id: 6,
                          name: "Gym",
                        },
                        {
                          id: 7,
                          name: "Market",
                        },
                      ]}
                    />

                    <SelectForNoApi
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.assets_category_type}
                      error={errors.assets_category_type}
                      touched={touched.assets_category_type}
                      label="Asset Category Type"
                      name="assets_category_type"
                      placeholder={"Choose Asset Category Name"}
                      options={[
                        {
                          id: 1,
                          name: "Immovable",
                        },
                      ]}
                    />

                    <InputBox
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.khata_no}
                      error={errors.khata_no}
                      touched={touched.khata_no}
                      label="Khata No."
                      name="khata_no"
                      type="text"
                      required={true}
                      placeholder={"Enter Khata No."}
                      maxLength={10}
                    />

                    <InputBox
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.plot_no}
                      error={errors.plot_no}
                      touched={touched.plot_no}
                      label="Plot No."
                      placeholder={"Enter Plot No."}
                      name="plot_no"
                      type="text"
                      required={true}
                      maxLength={10}
                      onKeyPress={(e: any) => {
                        if (!(e.key >= "0" && e.key <= "9")) {
                          e.preventDefault();
                        }
                      }}
                    />

                    <div>
                      <label>Blue print</label>
                      <input
                        type='file'
                        name='blue_print'
                        accept="image/*,.pdf"
                        className="mb-4 p-1 border border-slate-400 w-full rounded"
                        onChange={handleFile1Change}

                      />
                    </div>
                    <div>
                      <label>Ownership Documents </label>

                      <input
                        type='file'
                        name='ownership_doc'
                        accept="image/*,.pdf"
                        className="mb-4 p-1 border border-slate-400 w-full rounded"
                        onChange={handleFile2Change}
                      />
                    </div>

                    {/* <InputBox
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.ward_no}
                      label="Ward No."
                      placeholder={"Enter Your Ward No."}
                      name="ward_no"
                      type="text"
                      maxLength={15}
                      onKeyPress={(e: any) => {
                        if (
                          !(
                            (e.key >= "a" || e.key >= "z") ||
                            (e.key <= "A" || e.key <= "Z") ||
                            (e.key <= "0" || e.key <= "9") ||
                            e.key === " "
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    /> */}

                    <SelectForNoApi
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.type_of_land}
                      error={errors.type_of_land}
                      touched={touched.type_of_land}
                      label="Type of Land"
                      name="type_of_land"
                      required={true}
                      placeholder={"Choose Type of Land"}
                      options={[
                        {
                          id: 1,
                          name: "Commercial Land",
                        },
                        {
                          id: 2,
                          name: "Residential Land",
                        },
                        {
                          id: 3,
                          name: "Agriculture Land",
                        },
                        {
                          id: 4,
                          name: "Mixed Land",
                        }
                      ]}
                    />

                    <InputBox
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.area}
                      error={errors.area}
                      touched={touched.area}
                      label="Area in sqft."
                      name="area"
                      type="text"
                      placeholder={"in sqft."}
                      required={true}
                      maxLength={10}
                      onKeyPress={(e: any) => {
                        if (
                          !(
                            (e.key <= "0" || e.key <= "9")
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />

                    <InputBox
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.order_no}
                      // error={errors.order_no}
                      // touched={touched.order_no}
                      label="Order No."
                      name="order_no"
                      type="text"
                      placeholder={"Enter order no."}
                      // required={true}
                      maxLength={10}
                      onKeyPress={(e: any) => {
                        if (
                          !(
                            (e.key <= "0" || e.key <= "9")
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />

                    <InputBox
                      // onChange={handleChange}
                      onChange={(e) => {
                        if (handleDateChange(e as any)) {
                          handleChange(e);
                        }
                      }}
                      onBlur={handleBlur}
                      error={errors.order_date}
                      touched={touched.order_date}
                      value={values.order_date}
                      label="Order Date"
                      name="order_date"
                      type="date"
                      placeholder={"Enter order date"}
                      onKeyPress={(e: any) => {
                        if (
                          (
                            (e.key >= "a" || e.key >= "z") ||
                            (e.key <= "A" || e.key <= "Z") ||
                            (e.key <= "0" || e.key <= "9") ||
                            e.key === " "
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />

                    <InputBox
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.address}
                      label="Address"
                      placeholder={"Enter Your Address"}
                      name="address"
                      type="text"
                      maxLength={100}
                      onKeyPress={(e: any) => {
                        if (
                          !(
                            (e.key >= "a" || e.key >= "z") ||
                            (e.key <= "A" || e.key <= "Z") ||
                            (e.key <= "0" || e.key <= "9") ||
                            e.key === " "
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />

                    <InputBox
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.acquisition}
                      label="Date of Acquisition"
                      placeholder={"Enter Your Acquisition"}
                      name="acquisition"
                      type="date"
                      onKeyPress={(e: any) => {
                        if (
                          (
                            (e.key >= "a" || e.key >= "z") ||
                            (e.key <= "A" || e.key <= "Z") ||
                            (e.key <= "0" || e.key <= "9") ||
                            e.key === " "
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />

                    <SelectForNoApi
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.mode_of_acquisition}
                      label="Mode of Acquisition"
                      name="mode_of_acquisition"
                      placeholder={"Choose mode of Acquisition"}
                      options={[
                        {
                          id: 1,
                          name: "Acquired",
                        },
                        {
                          id: 2,
                          name: "Donation",
                        },
                        {
                          id: 3,
                          name: "Purchase",
                        },
                        {
                          id: 4,
                          name: "Others",
                        }
                      ]}
                    />

                    <InputBox
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.from_whom_acquired}
                      label="From whom Acquired"
                      placeholder={"From whom Acquired"}
                      name="from_whom_acquired"
                      type="text"
                      maxLength={50}
                    />

                    {/* <div className={styles.marketSelection}> */}
                    <div className="marketSelection">


                      <label htmlFor="location" className={'selectLabel'}>
                        Select Location:
                      </label>
                      <select
                        name="location"
                        id="location"
                        value={selectedMarket}
                        onChange={handleMarketChange}
                        className={'selectInput'}
                        required

                      >

                        <option value="" disabled>-- Choose a Location --</option>
                        {circleData?.map((item: any) => (
                          <option key={item.id} value={item.location} >
                            {item.location}
                          </option>
                        ))}
                      </select>
                    </div>

                    <InputBox
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.building_approval_plan}
                      label="Building Approval Plan No. / Gift Deed No."
                      placeholder={"Building Approval Plan No. / Gift Deed No."}
                      name="building_approval_plan"
                      type="text"
                      maxLength={20}
                    />

                    <SelectForNoApi
                      onChange={handleChange}
                      onBlur={handleBlur}
                      // value={values.mode_of_acquisition}
                      label="Ward no."
                      name="ward_no"
                      value={values.ward_no}
                      placeholder={"Ward no."}
                      options={Array.from({ length: 55 }, (_, index) => ({
                        id: index + 1,
                        name: `${index + 1}`,
                      }))}
                    />


                    {/* <InputBox
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.location}
                      label="Location"
                      placeholder={"Location"}
                      name="location"
                      type="text"
                      maxLength={100}
                    /> */}






                  </div>

                  <div className="flex items-center justify-end mt-5 gap-5">
                    <PrimaryButton
                      onClick={handleReset}
                      buttonType="button"
                      variant={"cancel"}
                    >
                      Reset
                    </PrimaryButton>

                    <PrimaryButton buttonType="submit" variant="primary" onClick={() => sessionStorage.clear()}>
                      Save
                    </PrimaryButton>

                  </div>
                </form>
              </>

            )
          }}

        </Formik>


        
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Congratulations!</h2>
            <p>Your asset was successfully added.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}


{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-20">
    {/* Background Overlay for Blur Effect */}
    <div className="absolute inset-0 bg-black opacity-40 backdrop-blur-md z-10"></div>

    {/* Modal Content */}
    <div className="bg-white p-8 rounded-2xl shadow-xl w-[22rem] max-h-[80vh] overflow-auto z-20">

      {/* Circle Icon and Text */}
      <div className="flex flex-col items-center justify-center text-center space-y-6">

        <div className="mb-6">
          {/* Circle Tick Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mb-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 4.293a1 1 0 011.414 1.414l-10 10a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L7 13.586l9-9z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Success Message */}
        {succeessId ? (
          <div className="text-center space-y-3">
            <div className="font-semibold text-2xl text-green-600 mb-3">Congratulation!! Asset Added Successfully </div>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <p className="text-gray-700 text-lg font-bold">Number: <span className="font-semibold">{succeessId}</span></p>
              
              {/* Copy Icon Button */}
              <button 
                onClick={() => navigator.clipboard.writeText(succeessId)} 
                className="flex items-center justify-center bg-gray-600 text-white p-3 rounded-md shadow-md hover:bg-white hover:text-black border-2 border-black transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 10v10a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1zM6 14H5V5h9v1a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2z"/></svg>
                Copy
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-center text-gray-500 text-lg">No data available.</p>
          </div>
        )}
      </div>

      {/* Close Modal Button */}
      <div className="flex justify-center mt-6">
        <button 
          onClick={handleCloseSuccessModal} 
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-all duration-200">
          Close
        </button>
      </div>
    </div>
  </div>
)}




    </div>
  )
}