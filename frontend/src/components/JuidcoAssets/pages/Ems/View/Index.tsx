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
} from "lucide-react";

const View = ({ id }: { id: number }) => {
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
  const [isModalVisibleData, setIsModalVisibleData] = useState(false);
  const [savedFloors, setSavedFloors] = useState<any[]>([]);
  const [editedFloorIndex, setEditedFloorIndex] = useState<any>(null);

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
      setSavedFloors(res.data?.data?.data?.floorData || []);
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
        url: `${ASSETS.LIST.updateMany}&id=${id}&assets_id=${asset_id}`,
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

  const dataUpdate = async (values: any) => {
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

      const res = await axios({
        url: `${ASSETS.LIST.update}?id=${id}&assets_id=${asset_id}`,
        method: "POST",
        data: { id, ...values },
      });

      if (res?.data?.status === 201) {
        toast.success("Assets successfully sent for approval.");
        setIsOpen(false);
        window.location.reload();
      } else if (res?.data?.["meta-data"]?.type === "DUPLICATE") {
        toast.error("Duplicate asset data found. Please check and try again.");
      } else if (res?.data?.status === 400) {
        toast.success(
          "There is already a pending update request for this asset"
        );
      }
    } catch (error) {
      console.error("Error updating data:", error);
      return [];
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

  const { isLoading, error, data } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchData,
    staleTime: 1000,
  });

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
    address: data?.data?.address,
    type_of_land: data?.data?.type_of_land,
    area: data?.data?.area,
    order_date: data?.data?.order_date,
    order_no: data?.data?.order_no,
    acquisition: data?.data?.acquisition,
    mode_of_acquisition: data?.data?.mode_of_acquisition,
    from_whom_acquired: data?.data?.from_whom_acquired,
    building_approval_plan: data?.data?.building_approval_plan,
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
    is_drafted: false,
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
                                        onValueChange={(value: any) =>
                                          handleChange({
                                            target: {
                                              name: "type_of_assets",
                                              value,
                                            },
                                          })
                                        }
                                        disabled
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Choose Asset Category" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                        onValueChange={(value: any) =>
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
                                        <SelectContent>
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
                                      <Select
                                        value={values.ward_no?.toString()}
                                        onValueChange={(value: any) =>
                                          handleChange({
                                            target: { name: "ward_no", value },
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Ward No." />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from(
                                            { length: 55 },
                                            (_, index) => (
                                              <SelectItem
                                                key={index + 1}
                                                value={(index + 1).toString()}
                                              >
                                                {index + 1}
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="type_of_land">
                                        Type of Land
                                      </Label>
                                      <Select
                                        value={values.type_of_land}
                                        onValueChange={(value: any) =>
                                          handleChange({
                                            target: {
                                              name: "type_of_land",
                                              value,
                                            },
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Choose Type of Land" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Commercial Land">
                                            Commercial Land
                                          </SelectItem>
                                          <SelectItem value="Residential Land">
                                            Residential Land
                                          </SelectItem>
                                          <SelectItem value="Agriculture Land">
                                            Agriculture Land
                                          </SelectItem>
                                          <SelectItem value="Mixed Land">
                                            Mixed Land
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
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
                                        onValueChange={(value: any) =>
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
                                        <SelectContent>
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
                                          <div className="flex flex-wrap gap-4">
                                            {values.floorData?.map(
                                              (floor: any, floorIndex: any) => (
                                                <Card
                                                  key={floorIndex}
                                                  className="w-full"
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
                                                          className="p-4 border rounded-lg space-y-3"
                                                        >
                                                          <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                              <Label>
                                                                Plot
                                                              </Label>
                                                              <Field
                                                                name={`floorData[${floorIndex}].details[${detailIndex}].index`}
                                                                type="number"
                                                                placeholder="Plot Number"
                                                                className="w-full p-2 border rounded"
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
                                                                className="w-full p-2 border rounded"
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
                                                                className="w-full p-2 border rounded"
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
                                                                className="w-full p-2 border rounded"
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
                                                              className="w-full p-2 border rounded"
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
                                                              className="w-full p-2 border rounded"
                                                            />
                                                          </div>
                                                          <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                              <Label>
                                                                Type of Plot
                                                              </Label>
                                                              <Field
                                                                as="select"
                                                                name={`floorData[${floorIndex}].details[${detailIndex}].type_of_plot`}
                                                                className="w-full p-2 border rounded"
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
                                          <div className="flex space-x-2">
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
                                              className="flex items-center space-x-2"
                                            >
                                              <Plus className="w-4 h-4" />
                                              <span>Add Floor</span>
                                            </Button>
                                            <Button
                                              type="button"
                                              variant="outline"
                                              onClick={() =>
                                                setIsModalVisibleData(true)
                                              }
                                              className="flex items-center space-x-2"
                                            >
                                              <Eye className="w-4 h-4" />
                                              <span>View Details</span>
                                            </Button>
                                          </div>
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

      {/* Main Content */}
<div className="overflow-y-auto max-h-[calc(135vh-200px)]">
      <div
        className="max-w-auto mx-auto px-4 sm:px-6 lg:px-8 py-8"
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
                              <span className="text-gray-600">Dimensions:</span>
                              <span className="font-medium">
                                {detail.length}×{detail.breadth}×{detail.height}
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
                  <span className="text-orange-600">Field Officer Review</span>
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
          {(role === "Municipal" || role === "Admin") && (
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

          {/* Field Officer Review (for Field Officer role) */}
          {role === "Field Officer" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-600">Field Officer Review</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Latitude
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {datas?.data[0]?.lat || "Pending for Verification"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Longitude
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {datas?.data[0]?.long || "Pending for Verification"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Remarks
                    </Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {datas?.data[0]?.remarks || "No Review Given"}
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
        </div>
        </div>
      </div>

      {/* Floor Details Modal */}
      <Dialog open={isModalVisibleData} onOpenChange={setIsModalVisibleData}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Floor Details</span>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-6">
              {Object.values(
                savedFloors?.reduce((acc, floor) => {
                  const floorNumber = floor.floor;
                  if (!acc[floorNumber]) {
                    acc[floorNumber] = [];
                  }
                  acc[floorNumber].push(floor);
                  return acc;
                }, {})
              ).map((floorGroup: any, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-600">
                    {floorGroup[0]?.floor === 0
                      ? "Basement"
                      : `Floor ${floorGroup[0]?.floor}`}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {floorGroup.map((floor: any, index: any) => {
                      const isOccupied = floor.plotCount > 0;
                      const floorColorClass = isOccupied
                        ? "bg-green-50 border-green-200"
                        : "bg-yellow-50 border-yellow-200";
                      const isEditMode = editedFloorIndex === index;

                      return (
                        <Card
                          key={index}
                          className={`${floorColorClass} border-2`}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Floor {floor.floor}
                            </CardTitle>
                            <p className="text-sm text-gray-600">
                              Plot Count: {floor.plotCount}
                            </p>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-3">
                              {floor.details.map((detail: any, idx: any) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-white rounded border"
                                >
                                  {isEditMode ? (
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <Label className="text-xs">Type</Label>
                                        <Input
                                          className="h-8"
                                          defaultValue={detail.type}
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">
                                          Length
                                        </Label>
                                        <Input
                                          className="h-8"
                                          defaultValue={detail.length}
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">
                                          Breadth
                                        </Label>
                                        <Input
                                          className="h-8"
                                          defaultValue={detail.breadth}
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">
                                          Height
                                        </Label>
                                        <Input
                                          className="h-8"
                                          defaultValue={detail.height}
                                        />
                                      </div>
                                      <div className="col-span-2">
                                        <Label className="text-xs">Name</Label>
                                        <Input
                                          className="h-8"
                                          defaultValue={detail.name}
                                        />
                                      </div>
                                      <div className="col-span-2">
                                        <Label className="text-xs">
                                          Property Name
                                        </Label>
                                        <Input
                                          className="h-8"
                                          defaultValue={detail.property_name}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">
                                          Type:
                                        </span>
                                        <span>{detail.type}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">
                                          Dimensions:
                                        </span>
                                        <span>
                                          {detail.length}×{detail.breadth}×
                                          {detail.height}m
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">
                                          Owner:
                                        </span>
                                        <span>{detail.name}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">
                                          Property:
                                        </span>
                                        <span>{detail.property_name}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-end">
                              {isEditMode ? (
                                <Button
                                  size="sm"
                                  onClick={() => setEditedFloorIndex(null)}
                                >
                                  <Save className="w-3 h-3 mr-1" />
                                  Save
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditedFloorIndex(index)}
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default View;
