"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { Formik, Field, FieldArray } from "formik";
import axios from "@/lib/axiosConfig";
import { ASSETS } from "@/utils/api/urls";
import {
  ArrowLeft,
  Download,
  Edit,
  FileText,
  Building,
  Calendar,
  Eye,
  Save,
  X,
  Home,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Check,
  Edit3,
} from "lucide-react";

interface Unit {
  index: number;
  type: "Commercial" | "Residential";
  length?: number;
  breadth?: number;
  height?: number;
  name?: string;
  property_name?: string;
  [key: string]: any;
}

// interface FloorData {
//   floor: string;
//   plotCount: number;
//   units: Record<string, Unit[]>;
// }

const AdminApprovedView = ({ id }: { id: number }) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const status = params.get("status");
  const asset_id = params.get("asset_id");

  const [isOpen, setIsOpen] = useState(false);
  const [ulbId, setUlbId] = useState<string>("");
  const [ulbName, setUlbName] = useState<string>("");
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [datas, setData] = useState<any>();
  const [datass, setDatas] = useState<any>();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [updatedAssetId, setUpdatedAssetId] = useState("");
  const [showBuildingModal, setShowBuildingModal] = useState(false);

  // Building configuration states
  const [floorCount, setFloorCount] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [plotNo, setPlotNo] = useState<any>(0);
  const [floorDisable, setFloorDisable] = useState(false);
  const [plotNos, setPlotNos] = useState<Array<number | string>>([]);
  const [selectedFloor, setSelectedFloor] = useState<any>(null);
  const [commercialCount, setCommercialCount] = useState<any>(0);
  const [residentialCount, setResidentialCount] = useState<any>(0);
  const [commercialUnits, setCommercialUnits] = useState<Unit[]>([]);
  const [residentialUnits, setResidentialUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [savedFloors, setSavedFloors] = useState<any[]>([]);
  const [originalAssetType, setOriginalAssetType] = useState<string>("");
  const [isNewBuildingConfiguration, setIsNewBuildingConfiguration] =
    useState(false);

  const componentRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @media print {
        @page {
          size: A4;
          margin: 10mm;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 5px;
          font-size: 10px;
        }
        tr {
          page-break-inside: avoid;
        }
        h1, h2, h3, h4, h5, h6 {
          font-size: 14px;
        }
      }
    `,
  });

  const getStatusBadge = (statusValue: number) => {
    switch (statusValue) {
      case 2:
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white py-2">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved by Admin
          </Badge>
        );
      case 1:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white py-2">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved by Field Officer
          </Badge>
        );
      case 0:
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white py-2">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case -1:
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white py-2">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white py-2">
            <AlertCircle className="w-3 h-3 mr-1" />
            Sent back by Field Officer
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown Status</Badge>;
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios({
        url: `${ASSETS.LIST.getById}?id=${id}`,
        method: "GET",
      });
      return res.data?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchFieldOfficerData = async () => {
    try {
      const res = await axios({
        url: `${ASSETS.LIST.getAllData}&id=${id}`,
        method: "GET",
      });
      setData(res.data?.data);
      return res.data?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAdminData = async () => {
    try {
      const res = await axios({
        url: `${ASSETS.LIST.updateMany}&id=${id}`,
        method: "GET",
      });
      setDatas(res.data?.data);
      return res.data?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFieldOfficerData();
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user_details");
      const user_details = JSON.parse(data as string);
      setRole(user_details?.user_type);
      setUlbId(user_details?.ulb_id || "");
    }
  }, []);

  useEffect(() => {
    const fetchUlbData = async (ulbId: any) => {
      try {
        const res = await axios({
          url: `${ASSETS.LIST.getAll}?id=${ulbId}`,
          method: "GET",
        });
        const ulbName = res.data?.data?.data[0]?.ulb_name || "not found";
        setUlbName(ulbName);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (ulbId) {
      fetchUlbData(ulbId);
    }
  }, [ulbId]);

  const handleUploadOwnershipDoc = async () => {
    if (file1) {
      const data = new FormData();
      data.append("file", file1);
      try {
        const response = await axios.post(`${ASSETS.LIST.validate}`, data);
        if (response.status === 200) {
          return { ownership_doc: response?.data?.data };
        } else {
          toast.error("Failed to upload files");
        }
      } catch (error) {
        toast.error("Error uploading files");
      }
    }
  };

  const handleUploadBlueprint = async () => {
    if (file2) {
      const data = new FormData();
      data.append("file", file2);
      try {
        const response = await axios.post(`${ASSETS.LIST.validate}`, data);
        if (response.status === 200) {
          return { blue_print: response?.data?.data };
        } else {
          toast.error("Failed to upload files");
        }
      } catch (error) {
        toast.error("Error uploading files");
      }
    }
  };

  const dataUpdate = async (values: any): Promise<boolean> => {
    try {
      const fileUploadData = await handleUploadOwnershipDoc();
      if (fileUploadData) {
        values.ownership_doc = fileUploadData.ownership_doc;
      }

      const fileUploadData2 = await handleUploadBlueprint();
      if (fileUploadData2) {
        values.blue_print = fileUploadData2.blue_print;
      }

      values.status = 0;

      if (values.type_of_assets === "Building") {
        values.building_name = buildingName;
        values.no_of_floors = Number.parseInt(floorCount) || 0;
        values.floorData = savedFloors;
      }

      const res = await axios({
        url: `${ASSETS.LIST.reCreate}?assets_id=${asset_id}`,
        method: "POST",
        data: { id, ...values },
      });

      if (res?.data?.status === true || res?.status === 200) {
        toast.success("Assets successfully sent for approval.");
        setIsOpen(false);
        const modifiedAssetId = res?.data?.data?.id;
        setUpdatedAssetId(modifiedAssetId);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
        return true;
      } else if (res?.data?.["meta-data"]?.type === "DUPLICATE") {
        toast.error(
          res?.data?.message ||
            "Duplicate asset data found. Please check and try again."
        );
      } else if (res?.data?.status === 400) {
        toast.error("There is already a pending update request for this asset");
      }

      return false;
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("An error occurred. Please try again.");
      return false;
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void
  ) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0] ?? null;

    if (!file) {
      setFile(null);
      return;
    }

    const fileType = file.type;
    const fileSize = file.size;
    const acceptedFileTypes = ["image/png", "image/jpeg", "application/pdf"];

    if (!acceptedFileTypes.includes(fileType)) {
      toast.error("Please upload a PNG, JPEG, or PDF file.");
      setFile(null);
      fileInput.value = "";
      return;
    }

    if (fileSize / 1024 >= 2048) {
      toast.error("Cannot upload more than 2MB data!");
      setFile(null);
      fileInput.value = "";
      return;
    }

    setFile(file);
  };

  // Building configuration functions
  const resetBuildingConfiguration = () => {
    setBuildingName("");
    setFloorCount("");
    setFloorDisable(false);
    setPlotNos([]);
    setSelectedFloor(null);
    setCommercialCount(0);
    setResidentialCount(0);
    setCommercialUnits([]);
    setResidentialUnits([]);
    setSelectedUnit(null);
    setSavedFloors([]);
    setPlotNo(0);
  };

  const handleSave = (value: boolean) => {
    console.log("Save button clicked with value:", value);
    if (buildingName?.length === 0 && floorCount?.length === 0) {
      toast.error("Building Name & Floor Cannot be Empty");
      return false;
    } else if (buildingName?.length == 0) {
      toast.error("Building Name Cannot be Empty");
      return false;
    } else if (floorCount?.length == 0) {
      toast.error("Floor Cannot be Empty");
      return false;
    }

    const numericFloorCount = Number(floorCount);
    if (isNaN(numericFloorCount) || numericFloorCount < 0) {
      console.error("Invalid floor count");
      return;
    }

    if (numericFloorCount > 0) {
      setFloorDisable(true);
    }
  };

  const handleFloor = (index: number) => {
    setSelectedFloor(index);
    setPlotNos([]);
    setCommercialCount(0);
    setResidentialCount(0);
    setCommercialUnits([]);
    setResidentialUnits([]);
    setSelectedUnit(null);
  };

  const handlePlotCountChange = (e: any, index: any) => {
    const plotNumber = Number.parseInt(e.target.value);
    setPlotNo(plotNumber);

    setPlotNos((prev) => {
      const newPlotNos = [...prev];
      newPlotNos[index] = plotNumber;
      return newPlotNos;
    });
  };

  const generateBoxes = (count: any) => {
    return Array.from({ length: count }, (_, index) => index + 1);
  };

  const handleUnitClick = (type: string, index: number) => {
    if (type === "Commercial") {
      if (!commercialUnits[index]) {
        const updatedUnits: any = [...commercialUnits];
        updatedUnits[index] = {
          length: Number(""),
          breadth: Number(""),
          height: Number(""),
          name: "",
          property_name: "",
          index: index,
          type: "Commercial",
        };
        setCommercialUnits(updatedUnits);
      }
    } else if (type === "Residential") {
      if (!residentialUnits[index]) {
        const updatedUnits = [...residentialUnits];
        updatedUnits[index] = {
          length: Number(""),
          breadth: Number(""),
          height: Number(""),
          name: "",
          property_name: "",
          index: index,
          type: "Residential",
        };
        setResidentialUnits(updatedUnits);
      }
    }

    setSelectedUnit({ type, index });
  };

  const handleUnitDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
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

  const validateUnitCount = (
    newCount: number,
    existingCount: any,
    maxCount: number,
    setCount: { (value: any): void; (value: any): void; (arg0: number): void },
    setUnits: any,
    type: string
  ) => {
    if (newCount + existingCount > maxCount) {
      alert(
        `The total number of Commercial and Residential units cannot exceed ${maxCount}.`
      );
      setCount(0);
    } else {
      setCount(newCount);
      const emptyUnits = Array.from({ length: newCount }, (_, i) => ({
        length: 0,
        breadth: 0,
        height: 0,
        name: "",
        property_name: "",
        index: i,
        type: type,
      }));
      setUnits(emptyUnits);
    }
  };

  const processFloorData = () => {
    const mergedUnits = [
      ...(Array.isArray(commercialUnits) ? commercialUnits : []).map(
        (unit) => ({ unitType: "Commercial", ...unit })
      ),
      ...(Array.isArray(residentialUnits) ? residentialUnits : []).map(
        (unit) => ({
          unitType: "Residential",
          ...unit,
        })
      ),
    ];

    const isUnitFilled = (unit: any) => {
      return (
        unit?.length &&
        unit?.breadth &&
        unit?.height &&
        unit?.name &&
        unit?.property_name
      );
    };

    const filledUnits = mergedUnits.filter((unit) => isUnitFilled(unit));

    return mergedUnits.map((unit, index) => {
      const length =
        unit.length && !isNaN(Number(unit.length)) ? String(unit.length) : null;
      const breadth =
        unit.breadth && !isNaN(Number(unit.breadth))
          ? String(unit.breadth)
          : null;
      const height =
        unit.height && !isNaN(Number(unit.height)) ? String(unit.height) : null;
      const name = unit.name || `Unnamed Unit ${index + 1}`;
      const propertyName = unit.property_name || "Unknown Property";

      const plotCount = filledUnits.filter(
        (filledUnit) => filledUnit.name === unit.name
      ).length;
      const floorName =
        selectedFloor === null
          ? "Unknown Floor"
          : selectedFloor === 0
            ? "Basement"
            : `Floor ${selectedFloor - 1}`;

      const details = [
        {
          index: index + 1,
          type: unit.type,
          length: length || "Not Provided",
          breadth: breadth || "Not Provided",
          height: height || "Not Provided",
          name: name,
          property_name: propertyName,
          type_of_plot:
            unit.type === "Commercial" ? "Commercial" : "Residential",
        },
      ];

      return {
        floor: floorName,
        plotCount: plotCount,
        type: unit.type,
        details: details,
      };
    });
  };

  const handleSaveFloorData = () => {
    const floorData = processFloorData();
    setSavedFloors((prevFloors) => {
      const existingFloorNames = prevFloors.map((floor) => floor.floor);
      const newFloorData = floorData.filter(
        (floor) => !existingFloorNames.includes(floor.floor)
      );
      return [...prevFloors, ...newFloorData];
    });
    toast.success("Floor Details Saved Successfully");
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchData,
    staleTime: 1000,
  });

  useEffect(() => {
    if (data?.data) {
      console.log("Setting original asset type:", data?.data?.type_of_assets);
      setOriginalAssetType(data?.data?.type_of_assets || "");

      // Set building details if it's already a building
      if (data?.data?.type_of_assets === "Building") {
        setBuildingName(data?.data?.building_name || "");
        setFloorCount(data?.data?.no_of_floors?.toString() || "");
        if (data?.data?.floorData) {
          setSavedFloors(data?.data?.floorData);
        }
      }
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error)
    return (
      <div className="text-red-500 text-center">Error: {error.message}</div>
    );

  const initialValues = {
    type_of_assets: data?.data?.type_of_assets,
    asset_sub_category_name: data?.data?.asset_sub_category_name,
    assets_category_type: data?.data?.assets_category_type,
    khata_no: data?.data?.khata_no,
    plot_no: data?.data?.plot_no,
    blue_print: data?.data?.blue_print,
    ownership_doc: data?.data?.ownership_doc,
    ward_no: data?.data?.ward_no,
    ulb_id: data?.data?.ulb_id,
    address: data?.data?.address,
    type_of_land: data?.data?.type_of_land,
    area: data?.data?.area,
    order_date: data?.data?.order_date,
    order_no: data?.data?.order_no,
    acquisition: data?.data?.acquisition,
    mode_of_acquisition: data?.data?.mode_of_acquisition,
    from_whom_acquired: data?.data?.from_whom_acquired,
    building_approval_plan: data?.data?.building_approval_plan,
    building_name: data?.data?.building_name || "",
    no_of_floors: data?.data?.no_of_floors || 0,
    floorData:
      data?.data?.floorData?.map((floor: any) => ({
        id: floor.id,
        floor: floor.floor,
        plotCount: floor.plotCount,
        type: floor.type,
        assetsListId: floor.assetsListId,
        details: floor.details?.map((detail: any) => ({
          id: detail.id,
          index: detail.index,
          length: detail.length,
          breadth: detail.breadth,
          height: detail.height,
          name: detail.name,
          type: detail.type,
          type_of_plot: detail.type_of_plot,
          property_name: detail.property_name,
        })),
      })) || [],
  };

  const renderDocument = (docUrl: string, altText: string) => {
    if (!docUrl) {
      return <p className="text-gray-500 text-sm">No document found</p>;
    }

    if (docUrl.endsWith(".pdf")) {
      return (
        <iframe
          src={docUrl}
          className="w-full h-32 border rounded"
          title={altText}
        />
      );
    } else {
      return (
        <img
          src={docUrl || "/placeholder.svg"}
          alt={altText}
          className="w-24 h-24 object-cover rounded border"
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Asset Details
                </h1>
                <p className="text-sm text-gray-500">
                  View and manage asset information
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-transparent"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </Button>

              {status === "clicked" && role !== "Field Officer" && (
                <div className="flex items-center space-x-3">
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center space-x-2">
                        <Edit className="w-4 h-4" />
                        <span>Update</span>
                      </Button>
                    </DialogTrigger>
                    {getStatusBadge(data?.data?.status)}
                    <DialogContent className="max-w-6xl max-h-[90vh] bg-white text-gray-800">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Edit className="w-5 h-5" />
                          <span>Update Asset Information</span>
                        </DialogTitle>
                      </DialogHeader>

                      <ScrollArea className="h-[70vh] pr-4">
                        <Formik
                          initialValues={initialValues}
                          onSubmit={(values) => dataUpdate(values)}
                        >
                          {({
                            values,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                          }) => (
                            <form onSubmit={handleSubmit} className="space-y-6">
                              <Tabs defaultValue="basic" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="basic">
                                    Basic Info
                                  </TabsTrigger>
                                  <TabsTrigger value="documents">
                                    Documents
                                  </TabsTrigger>
                                  <TabsTrigger value="acquisition">
                                    Acquisition
                                  </TabsTrigger>
                                  <TabsTrigger value="floors">
                                    Floor Data
                                  </TabsTrigger>
                                </TabsList>
                                <div className="border-b border-gray-300 w-full mt-4 mb-4"></div>

                                <TabsContent
                                  value="basic"
                                  className="space-y-4"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="type_of_assets">
                                        Asset Category
                                      </Label>
                                      <Select
                                        value={values.type_of_assets}
                                        onValueChange={(value) => {
                                          console.log(
                                            "Asset type changed to:",
                                            value
                                          );
                                          console.log(
                                            "Original asset type:",
                                            originalAssetType
                                          );

                                          setFieldValue(
                                            "type_of_assets",
                                            value
                                          );

                                          // If changing TO Building (regardless of what it was before)
                                          if (value === "Building") {
                                            // If it was already a Building, just add floors
                                            if (
                                              originalAssetType === "Building"
                                            ) {
                                              setIsNewBuildingConfiguration(
                                                false
                                              );
                                              setShowBuildingModal(true);
                                            }
                                            // If it wasn't a Building before (or originalAssetType is empty/undefined), show full configuration
                                            else {
                                              setIsNewBuildingConfiguration(
                                                true
                                              );
                                              resetBuildingConfiguration();
                                              setShowBuildingModal(true);
                                            }
                                          }
                                          // If changing FROM Building to something else, reset building data
                                          else if (
                                            originalAssetType === "Building" &&
                                            value !== "Building"
                                          ) {
                                            resetBuildingConfiguration();
                                          }
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Choose Asset Category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white text-gray-800 z-50">
                                          <SelectItem value="Building">
                                            Building
                                          </SelectItem>
                                          <SelectItem value="Hall">
                                            Hall
                                          </SelectItem>
                                          <SelectItem value="Vacant Land">
                                            Vacant Land
                                          </SelectItem>
                                          <SelectItem value="Others">
                                            Others
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="asset_sub_category_name">
                                        Asset Sub-Category
                                      </Label>
                                      <Select
                                        value={values.asset_sub_category_name}
                                        onValueChange={(value) =>
                                          handleChange({
                                            target: {
                                              name: "asset_sub_category_name",
                                              value,
                                            },
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Choose Sub Category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white text-gray-800 z-50">
                                          <SelectItem value="Hospitals">
                                            Hospitals
                                          </SelectItem>
                                          <SelectItem value="Library">
                                            Library
                                          </SelectItem>
                                          <SelectItem value="Parking">
                                            Parking
                                          </SelectItem>
                                          <SelectItem value="Enclosed/Non-Enclosed">
                                            Enclosed/Non-Enclosed
                                          </SelectItem>
                                          <SelectItem value="Vacant Land">
                                            Vacant Land
                                          </SelectItem>
                                          <SelectItem value="Gym">
                                            Gym
                                          </SelectItem>
                                          <SelectItem value="Market">
                                            Market
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="khata_no">
                                        Khata No.
                                      </Label>
                                      <Input
                                        id="khata_no"
                                        name="khata_no"
                                        value={values.khata_no}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter Khata No."
                                        maxLength={10}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="plot_no">Plot No.</Label>
                                      <Input
                                        id="plot_no"
                                        name="plot_no"
                                        value={values.plot_no}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter Plot No."
                                        maxLength={10}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="ward_no">Ward No.</Label>
                                      <Input
                                        id="ward_no"
                                        name="ward_no"
                                        value={values.ward_no}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter Ward No."
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="area">Area (sqft)</Label>
                                      <Input
                                        id="area"
                                        name="area"
                                        value={values.area}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Area in sqft"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="order_no">
                                        Order No.
                                      </Label>
                                      <Input
                                        id="order_no"
                                        name="order_no"
                                        value={values.order_no}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter order no."
                                      />
                                      <p className="text-xs text-red-500">
                                        Please enter a new unique order number.
                                        It must be numeric.
                                      </p>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="order_date">
                                        Order Date
                                      </Label>
                                      <Input
                                        id="order_date"
                                        name="order_date"
                                        type="date"
                                        value={values.order_date}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="address">Address</Label>
                                      <Input
                                        id="address"
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter address"
                                        maxLength={100}
                                      />
                                    </div>
                                  </div>

                                  {/* Show building details if asset type is Building */}
                                  {values.type_of_assets === "Building" && (
                                    <Card className="mt-6">
                                      <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                          <span className="flex items-center space-x-2">
                                            <Building className="w-5 h-5 text-blue-600" />
                                            <span>Building Details</span>
                                          </span>
                                          <div className="flex space-x-2">
                                            {originalAssetType ===
                                              "Building" && (
                                              <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                  setIsNewBuildingConfiguration(
                                                    false
                                                  );
                                                  setShowBuildingModal(true);
                                                }}
                                                className="flex items-center space-x-2"
                                              >
                                                <Plus className="w-4 h-4" />
                                                <span>Add Floors</span>
                                              </Button>
                                            )}
                                            {originalAssetType !== "Building" &&
                                              values.type_of_assets ===
                                                "Building" && (
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  onClick={() => {
                                                    setIsNewBuildingConfiguration(
                                                      true
                                                    );
                                                    setShowBuildingModal(true);
                                                  }}
                                                  className="flex items-center space-x-2"
                                                >
                                                  <Building className="w-4 h-4" />
                                                  <span>
                                                    Configure Building
                                                  </span>
                                                </Button>
                                              )}
                                          </div>
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label>Building Name</Label>
                                            <p className="text-lg font-semibold text-blue-600">
                                              {buildingName ||
                                                values.building_name ||
                                                "Not specified"}
                                            </p>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Number of Floors</Label>
                                            <p className="text-lg font-semibold text-blue-600">
                                              {floorCount ||
                                                values.no_of_floors ||
                                                "Not specified"}
                                            </p>
                                          </div>
                                        </div>
                                        {savedFloors.length > 0 && (
                                          <div className="mt-4">
                                            <Label className="text-sm font-medium text-gray-500 mb-2 block">
                                              Configured Floors:{" "}
                                              {savedFloors.length}
                                            </Label>
                                            <div className="flex flex-wrap gap-2">
                                              {savedFloors.map(
                                                (floor, index) => (
                                                  <Badge
                                                    key={index}
                                                    variant="secondary"
                                                  >
                                                    {floor.floor} (
                                                    {floor.plotCount} units)
                                                  </Badge>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  )}
                                </TabsContent>

                                <TabsContent
                                  value="documents"
                                  className="space-y-4"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                          <FileText className="w-4 h-4" />
                                          <span>Ownership Document</span>
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="ownership_doc">
                                            Upload New Document
                                          </Label>
                                          <Input
                                            id="ownership_doc"
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) =>
                                              handleFileChange(e, setFile1)
                                            }
                                            className="cursor-pointer"
                                          />
                                        </div>
                                        <div>
                                          <Label>Current Document</Label>
                                          <div className="mt-2">
                                            {renderDocument(
                                              data?.data?.ownership_doc,
                                              "Ownership Document"
                                            )}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                          <Building className="w-4 h-4" />
                                          <span>Blueprint</span>
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="blue_print">
                                            Upload New Blueprint
                                          </Label>
                                          <Input
                                            id="blue_print"
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) =>
                                              handleFileChange(e, setFile2)
                                            }
                                            className="cursor-pointer"
                                          />
                                        </div>
                                        <div>
                                          <Label>Current Blueprint</Label>
                                          <div className="mt-2">
                                            {renderDocument(
                                              data?.data?.blue_print,
                                              "Blueprint"
                                            )}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>

                                <TabsContent
                                  value="acquisition"
                                  className="space-y-4"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="acquisition">
                                        Date of Acquisition
                                      </Label>
                                      <Input
                                        id="acquisition"
                                        name="acquisition"
                                        type="date"
                                        value={values.acquisition}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="mode_of_acquisition">
                                        Mode of Acquisition
                                      </Label>
                                      <Select
                                        value={values.mode_of_acquisition}
                                        onValueChange={(value) =>
                                          handleChange({
                                            target: {
                                              name: "mode_of_acquisition",
                                              value,
                                            },
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Choose mode" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white text-gray-800 z-50">
                                          <SelectItem value="Acquired">
                                            Acquired
                                          </SelectItem>
                                          <SelectItem value="Donation">
                                            Donation
                                          </SelectItem>
                                          <SelectItem value="Purchase">
                                            Purchase
                                          </SelectItem>
                                          <SelectItem value="Others">
                                            Others
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="from_whom_acquired">
                                        From Whom Acquired
                                      </Label>
                                      <Input
                                        id="from_whom_acquired"
                                        name="from_whom_acquired"
                                        value={values.from_whom_acquired}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="From whom acquired"
                                        maxLength={50}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="building_approval_plan">
                                        Building Approval Plan No.
                                      </Label>
                                      <Input
                                        id="building_approval_plan"
                                        name="building_approval_plan"
                                        value={values.building_approval_plan}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Building Approval Plan No."
                                        maxLength={20}
                                      />
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent
                                  value="floors"
                                  className="space-y-4"
                                >
                                  {values.type_of_assets === "Building" && (
                                    <FieldArray name="floorData">
                                      {({ push }) => (
                                        <div className="space-y-6">
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {values.floorData?.map(
                                              (floor: any, floorIndex: any) => (
                                                <Card
                                                  key={floorIndex}
                                                  className="border-2"
                                                >
                                                  <CardHeader>
                                                    <CardTitle className="text-lg">
                                                      Floor {floor.floor}
                                                    </CardTitle>
                                                  </CardHeader>
                                                  <CardContent className="space-y-4">
                                                    {floor?.details?.map(
                                                      (
                                                        detail: any,
                                                        detailIndex: any
                                                      ) => (
                                                        <div
                                                          key={detailIndex}
                                                          className="p-4 border rounded-lg space-y-3 "
                                                        >
                                                          <div className="grid grid-cols-2 gap-2 ">
                                                            <div>
                                                              <Label>
                                                                Plot
                                                              </Label>
                                                              <Field
                                                                name={`floorData[${floorIndex}].details[${detailIndex}].index`}
                                                                type="number"
                                                                placeholder="Plot Number"
                                                                className="w-full p-2 border rounded bg-white text-gray-800"
                                                              />
                                                            </div>
                                                            <div>
                                                              <Label>
                                                                Length
                                                              </Label>
                                                              <Field
                                                                name={`floorData[${floorIndex}].details[${detailIndex}].length`}
                                                                type="text"
                                                                placeholder="Length"
                                                                className="w-full p-2 border rounded bg-white text-gray-800"
                                                              />
                                                            </div>
                                                            <div>
                                                              <Label>
                                                                Breadth
                                                              </Label>
                                                              <Field
                                                                name={`floorData[${floorIndex}].details[${detailIndex}].breadth`}
                                                                type="text"
                                                                placeholder="Breadth"
                                                                className="w-full p-2 border rounded bg-white text-gray-800"
                                                              />
                                                            </div>
                                                            <div>
                                                              <Label>
                                                                Height
                                                              </Label>
                                                              <Field
                                                                name={`floorData[${floorIndex}].details[${detailIndex}].height`}
                                                                type="text"
                                                                placeholder="Height"
                                                                className="w-full p-2 border rounded bg-white text-gray-800"
                                                              />
                                                            </div>
                                                          </div>
                                                          <div>
                                                            <Label>
                                                              Owner Name
                                                            </Label>
                                                            <Field
                                                              name={`floorData[${floorIndex}].details[${detailIndex}].name`}
                                                              type="text"
                                                              placeholder="Owner Name"
                                                              className="w-full p-2 border rounded bg-white text-gray-800"
                                                            />
                                                          </div>
                                                          <div>
                                                            <Label>
                                                              Property Name
                                                            </Label>
                                                            <Field
                                                              name={`floorData[${floorIndex}].details[${detailIndex}].property_name`}
                                                              type="text"
                                                              placeholder="Property Name"
                                                              className="w-full p-2 border rounded bg-white text-gray-800"
                                                            />
                                                          </div>
                                                          <div className="grid grid-cols-2 gap-2 bg-white text-gray-800">
                                                            <div className="bg-white text-gray-800">
                                                              <Label>
                                                                Type of Plot
                                                              </Label>
                                                              <Field
                                                                as="select"
                                                                name={`floorData[${floorIndex}].details[${detailIndex}].type_of_plot`}
                                                                className="w-full p-2 border rounded bg-white text-gray-800"
                                                              >
                                                                <option>
                                                                  Choose option
                                                                </option>
                                                                <option value="Enclosed">
                                                                  Enclosed
                                                                </option>
                                                                <option value="Non-Enclosed">
                                                                  Non-Enclosed
                                                                </option>
                                                              </Field>
                                                            </div>
                                                            <div>
                                                              <Label>
                                                                Type
                                                              </Label>
                                                              <Field
                                                                as="select"
                                                                name={`floorData[${floorIndex}].details[${detailIndex}].type`}
                                                                className="w-full p-2 border rounded"
                                                              >
                                                                <option>
                                                                  Choose option
                                                                </option>
                                                                <option value="Commercial">
                                                                  Commercial
                                                                </option>
                                                                <option value="Residential">
                                                                  Residential
                                                                </option>
                                                              </Field>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )
                                                    )}
                                                  </CardContent>
                                                </Card>
                                              )
                                            )}
                                          </div>
                                          <Button
                                            type="button"
                                            onClick={() =>
                                              push({
                                                details: [
                                                  {
                                                    index: "",
                                                    length: "",
                                                    breadth: "",
                                                    height: "",
                                                    name: "",
                                                    property_name: "",
                                                  },
                                                ],
                                              })
                                            }
                                            className="w-full"
                                          >
                                            Add Floor +
                                          </Button>
                                        </div>
                                      )}
                                    </FieldArray>
                                  )}
                                </TabsContent>
                              </Tabs>

                              <div className="flex justify-end pt-4 border-t">
                                <Button
                                  type="submit"
                                  className="flex items-center space-x-2"
                                >
                                  <Save className="w-4 h-4" />
                                  <span>Save Changes</span>
                                </Button>
                              </div>
                            </form>
                          )}
                        </Formik>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Building Configuration Modal */}
      {showBuildingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-99 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <Building className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isNewBuildingConfiguration
                    ? "Building Configuration"
                    : "Add Floors to Building"}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBuildingModal(false)}
                className="hover:bg-red-100 hover:text-red-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content with Scroll */}
            <ScrollArea className="h-[calc(90vh-120px)]">
              <div className="p-6 space-y-8">
                {/* Building Basic Info - Show only for new building configuration */}
                {isNewBuildingConfiguration && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-blue-600" />
                        <span>Building Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="buildingName">Building Name *</Label>
                          <Input
                            id="buildingName"
                            value={buildingName}
                            onChange={(e: any) =>
                              setBuildingName(e.target.value)
                            }
                            placeholder="Enter building name"
                            disabled={floorDisable}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="floorCount">
                            Number of Floors (1-10) *
                          </Label>
                          <Input
                            id="floorCount"
                            type="number"
                            min="1"
                            max="10"
                            value={floorCount}
                            onChange={(e: any) => {
                              const value = Number.parseInt(e.target.value);
                              if (!isNaN(value) && value >= 1 && value <= 10) {
                                setFloorCount(value.toString());
                              } else if (e.target.value === "") {
                                setFloorCount("");
                              }
                            }}
                            placeholder="Enter number of floors"
                            disabled={floorDisable}
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSave(false)}
                        disabled={floorDisable}
                        className="w-full md:w-auto"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Floors
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* For existing buildings, show current building info */}
                {!isNewBuildingConfiguration &&
                  originalAssetType === "Building" && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-blue-800">
                          Current Building Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              {data?.data?.building_name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-600">
                              Building Name
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              {data?.data?.no_of_floors || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                              Total Floors
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {data?.data?.floorData?.reduce(
                                (sum: number, floor: any) =>
                                  sum + (floor.plotCount || 0),
                                0
                              ) || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                              Total Units
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-orange-600">
                              {data?.data?.floorData?.length || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                              Configured Floors
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setBuildingName(data?.data?.building_name || "");
                            setFloorCount(
                              data?.data?.no_of_floors?.toString() || ""
                            );
                            setFloorDisable(true);
                          }}
                          className="w-full mt-4"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Continue Adding Floors
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                {/* Floor Selection */}
                {(floorDisable ||
                  (!isNewBuildingConfiguration &&
                    originalAssetType === "Building")) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Floor Selection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {Array.from(
                          {
                            length:
                              Math.max(
                                Number(floorCount) ||
                                  Number(data?.data?.no_of_floors) ||
                                  0,
                                0
                              ) + 2,
                          },
                          (_, index) => {
                            const savedFloorNumbers = savedFloors.map(
                              (floor) => {
                                const match = floor.floor.match(/\d+/);
                                return match ? Number(match[0]) : null;
                              }
                            );
                            const existingFloorNumbers =
                              data?.data?.floorData?.map((floor: any) => {
                                const match = floor.floor.match(/\d+/);
                                return match ? Number(match[0]) : null;
                              }) || [];

                            const isSaved =
                              savedFloorNumbers.includes(index - 1) ||
                              existingFloorNumbers.includes(index - 1);

                            return (
                              <Button
                                key={index}
                                variant={
                                  selectedFloor === index
                                    ? "default"
                                    : "outline"
                                }
                                className={`h-16 flex flex-col items-center justify-center relative ${
                                  isSaved
                                    ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                                    : selectedFloor === index
                                      ? "bg-blue-600 text-white hover:bg-gray-600"
                                      : "hover:bg-gray-50"
                                }`}
                                onClick={() => !isSaved && handleFloor(index)}
                                disabled={isSaved}
                              >
                                {isSaved && (
                                  <Check className="h-4 w-4 absolute top-1 right-1 text-green-600" />
                                )}
                                <span className="font-bold text-lg">
                                  {index === 0 ? "B" : (index - 1).toString()}
                                </span>
                                <span className="text-xs">
                                  {index === 0
                                    ? "Basement"
                                    : `Floor ${index - 1}`}
                                </span>
                              </Button>
                            );
                          }
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Floor Configuration */}
                {selectedFloor !== null && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {selectedFloor === 0
                          ? "Basement"
                          : `Floor ${selectedFloor - 1}`}{" "}
                        Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="totalUnits">Total Units on Floor</Label>
                        <Input
                          id="totalUnits"
                          type="number"
                          placeholder={`No of shop/flat on the floor ${selectedFloor === 0 ? "B" : selectedFloor - 1}`}
                          value={plotNos[selectedFloor] || ""}
                          onChange={(e: any) =>
                            handlePlotCountChange(e, selectedFloor)
                          }
                          maxLength={3}
                        />
                      </div>

                      {plotNo > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="commercialUnits">
                              Commercial Units
                            </Label>
                            <Input
                              id="commercialUnits"
                              type="number"
                              placeholder="Number of Commercial units"
                              onChange={(e: any) => {
                                const commercialUnitsCount =
                                  Number.parseInt(e.target.value) || 0;
                                validateUnitCount(
                                  commercialUnitsCount,
                                  residentialCount,
                                  plotNo,
                                  setCommercialCount,
                                  setCommercialUnits,
                                  "Commercial"
                                );
                              }}
                              value={commercialCount}
                              maxLength={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="residentialUnits">
                              Residential Units
                            </Label>
                            <Input
                              id="residentialUnits"
                              type="number"
                              placeholder="Number of Residential units"
                              onChange={(e: any) => {
                                const residentialUnitsCount =
                                  Number.parseInt(e.target.value) || 0;
                                validateUnitCount(
                                  residentialUnitsCount,
                                  commercialCount,
                                  plotNo,
                                  setResidentialCount,
                                  setResidentialUnits,
                                  "Residential"
                                );
                              }}
                              value={residentialCount}
                              maxLength={2}
                            />
                          </div>
                        </div>
                      )}

                      {/* Unit Selection */}
                      {(commercialCount > 0 || residentialCount > 0) && (
                        <div className="space-y-6">
                          {commercialCount > 0 && (
                            <div>
                              <h4 className="text-lg font-semibold text-blue-600 mb-3">
                                Commercial Units
                              </h4>
                              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                                {generateBoxes(commercialCount).map((num) => {
                                  const unit = commercialUnits[num - 1];
                                  const isComplete =
                                    unit?.length &&
                                    unit?.breadth &&
                                    unit?.height &&
                                    unit?.name &&
                                    unit?.property_name;

                                  return (
                                    <Button
                                      key={num}
                                      variant={
                                        selectedUnit?.type === "Commercial" &&
                                        selectedUnit?.index === num - 1
                                          ? "default"
                                          : "outline"
                                      }
                                      className={`h-12 ${
                                        isComplete
                                          ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                                          : selectedUnit?.type ===
                                                "Commercial" &&
                                              selectedUnit?.index === num - 1
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-gray-50"
                                      }`}
                                      onClick={() =>
                                        handleUnitClick("Commercial", num - 1)
                                      }
                                    >
                                      {isComplete && (
                                        <Check className="h-3 w-3 mr-1" />
                                      )}
                                      {num}
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {residentialCount > 0 && (
                            <div>
                              <h4 className="text-lg font-semibold text-green-600 mb-3">
                                Residential Units
                              </h4>
                              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                                {generateBoxes(residentialCount).map((num) => {
                                  const unit = residentialUnits[num - 1];
                                  const isComplete =
                                    unit?.length &&
                                    unit?.breadth &&
                                    unit?.height &&
                                    unit?.name &&
                                    unit?.property_name;

                                  return (
                                    <Button
                                      key={num}
                                      variant={
                                        selectedUnit?.type === "Residential" &&
                                        selectedUnit?.index === num - 1
                                          ? "default"
                                          : "outline"
                                      }
                                      className={`h-12 ${
                                        isComplete
                                          ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                                          : selectedUnit?.type ===
                                                "Residential" &&
                                              selectedUnit?.index === num - 1
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-gray-50"
                                      }`}
                                      onClick={() =>
                                        handleUnitClick("Residential", num - 1)
                                      }
                                    >
                                      {isComplete && (
                                        <Check className="h-3 w-3 mr-1" />
                                      )}
                                      {num}
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Unit Details Form */}
                      {selectedUnit && (
                        <Card className="border-2 border-blue-200">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Edit3 className="h-5 w-5" />
                              <span>
                                {selectedUnit.type} Unit{" "}
                                {selectedUnit.index + 1} Details
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="length">
                                  Length (meters) *
                                </Label>
                                <Input
                                  id="length"
                                  type="number"
                                  placeholder="Length in meters"
                                  value={
                                    selectedUnit.type === "Commercial"
                                      ? commercialUnits[selectedUnit.index]
                                          ?.length || ""
                                      : residentialUnits[selectedUnit.index]
                                          ?.length || ""
                                  }
                                  onChange={(e: any) =>
                                    handleUnitDetailsChange(e, "length")
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="breadth">
                                  Breadth (meters) *
                                </Label>
                                <Input
                                  id="breadth"
                                  type="number"
                                  placeholder="Breadth in meters"
                                  value={
                                    selectedUnit.type === "Commercial"
                                      ? commercialUnits[selectedUnit.index]
                                          ?.breadth || ""
                                      : residentialUnits[selectedUnit.index]
                                          ?.breadth || ""
                                  }
                                  onChange={(e: any) =>
                                    handleUnitDetailsChange(e, "breadth")
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="height">
                                  Height (meters) *
                                </Label>
                                <Input
                                  id="height"
                                  type="number"
                                  placeholder="Height in meters"
                                  value={
                                    selectedUnit.type === "Commercial"
                                      ? commercialUnits[selectedUnit.index]
                                          ?.height || ""
                                      : residentialUnits[selectedUnit.index]
                                          ?.height || ""
                                  }
                                  onChange={(e: any) =>
                                    handleUnitDetailsChange(e, "height")
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="ownerName">Owner Name *</Label>
                                <Input
                                  id="ownerName"
                                  placeholder="Owner Name"
                                  value={
                                    selectedUnit.type === "Commercial"
                                      ? commercialUnits[selectedUnit.index]
                                          ?.name || ""
                                      : residentialUnits[selectedUnit.index]
                                          ?.name || ""
                                  }
                                  onChange={(e: any) =>
                                    handleUnitDetailsChange(e, "name")
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="propertyName">
                                  Property Name *
                                </Label>
                                <Input
                                  id="propertyName"
                                  placeholder="Property Name"
                                  value={
                                    selectedUnit.type === "Commercial"
                                      ? commercialUnits[selectedUnit.index]
                                          ?.property_name || ""
                                      : residentialUnits[selectedUnit.index]
                                          ?.property_name || ""
                                  }
                                  onChange={(e: any) =>
                                    handleUnitDetailsChange(e, "property_name")
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex justify-center pt-4">
                              <Button
                                onClick={handleSaveFloorData}
                                className="px-8 py-3"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Save Floor Data
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Saved Floors Summary */}
                {savedFloors.length > 0 && (
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-800">
                        Saved Floors Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {savedFloors.length}
                          </div>
                          <div className="text-sm text-gray-600">
                            Floors Configured
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {savedFloors.reduce(
                              (sum, floor) => sum + (floor.plotCount || 0),
                              0
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Units
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {buildingName || data?.data?.building_name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-600">
                            Building Name
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">
                            {floorCount || data?.data?.no_of_floors || 0}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Floors
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {savedFloors.map((floor, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            {floor.floor} ({floor.plotCount} units)
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="overflow-y-auto max-h-[calc(135vh-200px)]">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          ref={componentRef}
        >
          <div className="space-y-8">
            {/* Asset & Land Address Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  <span>Asset & Land Address Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      ULB Name
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {ulbName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Ward No.
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.ward_no || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Asset Type
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.type_of_assets || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Address
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.address || "No data found"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span>Asset Order Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Order Number
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.order_no || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Order Date
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.order_date || "No data found"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  <span>Asset Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Asset Category Name
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.type_of_assets || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Asset Sub-Category Name
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.asset_sub_category_name || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Asset Category Type
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.assets_category_type || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Area
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.area || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Khata No.
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.khata_no || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Plot No.
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.plot_no || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Type of Land
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.type_of_land || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Date of Acquisition
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.acquisition || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Mode of Acquisition
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.mode_of_acquisition || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      From Whom Acquired
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.from_whom_acquired || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Location
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.location || "No data found"}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2 border-dashed">
                    <CardHeader>
                      <CardTitle className="text-sm">
                        Ownership Document
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderDocument(
                        data?.data?.ownership_doc,
                        "Ownership Document"
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed">
                    <CardHeader>
                      <CardTitle className="text-sm">Blueprint</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderDocument(data?.data?.blue_print, "Blueprint")}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Floor Details */}
            {data?.data?.type_of_assets === "Building" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-indigo-600" />
                    <span>Floor Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {data?.data?.floorData?.map((floor: any) =>
                      floor.details?.map((detail: any) => (
                        <Card
                          key={detail.id}
                          className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2"
                        >
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary">
                                Floor {floor.floor}
                              </Badge>
                              <Badge
                                variant={
                                  detail.type === "Commercial"
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {detail.type}
                              </Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Type of Plot:
                                </span>
                                <span className="font-medium">
                                  {detail.type_of_plot}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Plot:</span>
                                <span className="font-medium">
                                  {detail.index}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Dimensions:
                                </span>
                                <span className="font-medium">
                                  {detail.length}×{detail.breadth}×
                                  {detail.height}
                                </span>
                              </div>
                              <div className="pt-2 border-t">
                                <div className="text-gray-600 text-xs">
                                  Owner:
                                </div>
                                <div className="font-medium">{detail.name}</div>
                              </div>
                              <div>
                                <div className="text-gray-600 text-xs">
                                  Property:
                                </div>
                                <div className="font-medium">
                                  {detail.property_name}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Field Officer Review */}
            {(role === "Municipal" || role === "Admin") && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-orange-600" />
                    <span className="text-orange-600">
                      Field Officer Review
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Latitude
                      </Label>
                      <p className="text-lg font-semibold text-blue-600 mt-1">
                        {datas?.data[0]?.lat || "Location Not Provided"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Longitude
                      </Label>
                      <p className="text-lg font-semibold text-blue-600 mt-1">
                        {datas?.data[0]?.long || "Location Not Provided"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Remarks
                      </Label>
                      <p className="text-lg font-semibold text-blue-600 mt-1">
                        {datas?.data[0]?.remarks || "No Remarks"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500 mb-4 block">
                      Uploaded Images
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {[
                        { key: "image_one", label: "Image 1" },
                        { key: "image_two", label: "Image 2" },
                        { key: "image_three", label: "Image 3" },
                        { key: "image_four", label: "Image 4" },
                        { key: "image_five", label: "Image 5" },
                      ].map(({ key, label }) => (
                        <Card key={key} className="border-2 border-dashed">
                          <CardContent className="p-3">
                            <Label className="text-xs text-gray-500 mb-2 block">
                              {label}
                            </Label>
                            {renderDocument(datas?.data[0]?.[key], label)}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Admin Review */}
            {role === "Municipal" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">Admin Review</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Remarks
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {datass?.data[0]?.checker_remarks ||
                        "Pending for Verification"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>
              Assets updated successfully! Modified Asset ID: {updatedAssetId}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovedView;
