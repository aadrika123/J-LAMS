"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Formik, type FormikHelpers } from "formik"
import * as Yup from "yup"
import toast, { Toaster } from "react-hot-toast"
import axios from "@/lib/axiosConfig"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// Icons
import {
  X,
  Eye,
  Plus,
  Check,
  Edit3,
  Building,
  Upload,
  Save,
  ArrowLeft,
  FileText,
  MapPin,
  Calendar,
  Copy,
} from "lucide-react"

// Import your existing components and assets
import { InnerHeading } from "@/components/Helpers/Heading"
import Customer from "@/assets/icons/cv 1.png"
import InputBox from "@/components/Helpers/InputBox"
import SelectForNoApi from "@/components/global/atoms/SelectForNoApi"
import { ASSETS } from "@/utils/api/urls"
import Jhar from "@/assets/icons/jhar.png"

export const DashboardMain = () => {
  // Interfaces
  interface Unit {
    index: number
    type: "Commercial" | "Residential"
    length?: number
    breadth?: number
    height?: number
    name?: string
    property_name?: string
    [key: string]: any
  }

  interface FloorData {
    floor: string
    plotCount: number
    units: Record<string, Unit[]>
  }

  type NavigationStackType = React.ReactNode[][]

  // State variables
  const [isLoading, setIsLoading] = useState(true)
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [floorCount, setFloorCount] = useState("")
  const [buildingName, setBuildingName] = useState("")
  const [isModalVisible, setIsModalVisible] = useState<any>(false)
  const [isModalVisibleData, setIsModalVisibleData] = useState<any>(false)
  const [data, setData] = useState<any>([])
  const [plotNo, setPlotNo] = useState<any>(0)
  const [, setNavigationStack] = useState<NavigationStackType>([])
  const [sessionData, setSessionData] = useState<FloorData[]>([])
  const [floorDisable, setFloorDisable] = useState(false)
  const [plotNos, setPlotNos] = useState<Array<number | string>>([])
  const [selectedFloor, setSelectedFloor] = useState<any>(null)
  const [ulbID, setUlbID] = useState<string | null>()
  const [commercialCount, setCommercialCount] = useState<any>(0)
  const [residentialCount, setResidentialCount] = useState<any>(0)
  const [selectedMarket, setSelectedMarket] = useState<string>("")
  const [circleData, setCircleData] = useState<any>([])
  const [commercialUnits, setCommercialUnits] = useState<Unit[]>([])
  const [residentialUnits, setResidentialUnits] = useState<Unit[]>([])
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [editedFloor, setEditedFloor] = useState<any>(null)
  const [editedDetails, setEditedDetails] = useState<any>([])
  const [editedFloorIndex, setEditedFloorIndex] = useState<any>(null)
  const [draft, setDraft] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [succeessId, setSucceessId] = useState()
  const [savedFloors, setSavedFloors] = useState<any[]>([])
  // const [showBuildingModal, setShowBuildingModal] = useState(false)


  //for successfull buid consiling the varibles
  console.log(data, "data")
  console.log(sessionData, "sessionData")
  console.log(editedFloor, "editedFloor")
  console.log(sessionData, "sessionData")


  // Event handlers
  const handleMarketChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMarket(event.target.value)
  }

  // Effects
  useEffect(() => {
    const storedUserDetails = localStorage.getItem("user_details")
    if (storedUserDetails) {
      try {
        const userDetails = JSON.parse(storedUserDetails)
        setUlbID(userDetails.ulb_id || null)
        fetchData(userDetails.ulb_id)
      } catch (error) {
        console.error("Error parsing user details:", error)
      }
    }
  }, [])

  useEffect(() => {
    const numericFloorCount = Number.parseInt(floorCount) || 0
    setPlotNos(Array(numericFloorCount).fill(""))
  }, [floorCount])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const storedData = sessionStorage.getItem("unitData")
    if (storedData) {
      setSessionData(JSON.parse(storedData))
    }
  }, [isModalVisibleData])

  // Form configuration
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
    type_of_land: "",
    area: "",
    order_no: "",
    order_date: "",
    acquisition: "",
    from_whom_acquired: "",
    mode_of_acquisition: "",
    role: "Municipal",
    building_approval_plan: "",
    no_of_floors: Number.parseInt(floorCount),
    building_name: buildingName,
    ulb_id: ulbID,
    location: "",
  }

  const employeeValidationSchema = Yup.object().shape({
    khata_no: Yup.string()
      .matches(/^[a-zA-Z0-9/-]*$/, "Only alphanumeric characters, hyphen (-), and slash (/) are allowed")
      .max(10, "Maximum 10 characters")
      .required("Khata No. is required"),
    plot_no: Yup.string().required("Plot No. is Required"),
    type_of_assets: Yup.mixed().required("Choose Asset Category Name"),
    area: Yup.string().required("Area. is Required"),
    type_of_land: Yup.string().required("Type of Land"),
    acquisition: Yup.date()
      .max(new Date(), "Date of Acquisition cannot be in the future")
      .required("Date of Acquisition is required"),
    order_date: Yup.date().max(new Date(), "Order Date cannot be in the future").required("Order Date is required"),
    ward_no: Yup.string().required("Ward No. is Required"),
  })

  // API functions
  const handleUpload = async () => {
    if (file1) {
      const data = new FormData()
      data.append("file", file1)
      try {
        const response = await axios.post(`${ASSETS.LIST.validate}`, data)
        if (response.status === 200) {
          return { blue_print: response?.data?.data }
        } else {
          toast.error("Failed to upload files")
        }
      } catch (error) {
        console.error("Error uploading files:", error)
        toast.error("Error uploading files")
      }
    }
  }

  const handleUpload2 = async () => {
    if (file2) {
      const data = new FormData()
      data.append("file", file2)
      try {
        const response = await axios.post(`${ASSETS.LIST.validate}`, data)
        if (response.status === 200) {
          return { ownership_doc: response?.data?.data }
        } else {
          toast.error("Failed to upload files")
        }
      } catch (error) {
        console.error("Error uploading files:", error)
        toast.error("Error uploading files")
      }
    }
  }

  const fetchData = async (ulbID: number) => {
    try {
      const res = await axios({
        url: `${ASSETS.LIST.locationselect}id=${ulbID}`,
        method: "GET",
      })
      setCircleData(res?.data?.data?.data)
      return res?.data?.data
    } catch (error) {
      console.error("Error fetching data:", error)
      return []
    }
  }

  // Business logic functions
  const processFloorData = () => {
    const mergedUnits = [
      ...(Array.isArray(commercialUnits) ? commercialUnits : []).map((unit) => ({ unitType: "Commercial", ...unit })),
      ...(Array.isArray(residentialUnits) ? residentialUnits : []).map((unit) => ({
        unitType: "Residential",
        ...unit,
      })),
    ]

    const isUnitFilled = (unit: any) => {
      return unit?.length && unit?.breadth && unit?.height && unit?.name && unit?.property_name
    }

    const filledUnits = mergedUnits.filter((unit) => isUnitFilled(unit))

    return mergedUnits.map((unit, index) => {
      const length = unit.length && !isNaN(Number(unit.length)) ? String(unit.length) : null
      const breadth = unit.breadth && !isNaN(Number(unit.breadth)) ? String(unit.breadth) : null
      const height = unit.height && !isNaN(Number(unit.height)) ? String(unit.height) : null
      const name = unit.name || `Unnamed Unit ${index + 1}`
      const propertyName = unit.property_name || "Unknown Property"

      const plotCount = filledUnits.filter((filledUnit) => filledUnit.name === unit.name).length
      const floorName =
        selectedFloor === null ? "Unknown Floor" : selectedFloor === 0 ? "Basement" : `Floor ${selectedFloor - 1}`

      const details = [
        {
          index: index + 1,
          type: unit.type,
          length: length || "Not Provided",
          breadth: breadth || "Not Provided",
          height: height || "Not Provided",
          name: name,
          property_name: propertyName,
          type_of_plot: unit.type === "Commercial" ? "Commercial" : "Residential",
        },
      ]

      return {
        floor: floorName,
        plotCount: plotCount,
        type: unit.type,
        details: details,
      }
    })
  }

  const handleSaveFloorData = () => {
    const floorData = processFloorData()
    setSavedFloors((prevFloors) => {
      const existingFloorNames = prevFloors.map((floor) => floor.floor)
      const newFloorData = floorData.filter((floor) => !existingFloorNames.includes(floor.floor))
      return [...prevFloors, ...newFloorData]
    })
    toast.success("Floor Details Saved Successfully")
  }

  const handleEditFloor = (floor: any, index: any) => {
    setEditedFloor(floor.floor)
    setEditedDetails(floor.details.map((detail: any) => ({ ...detail })))
    setEditedFloorIndex(index)
  }

  const handleInputChange = (e: any, detailIndex: any, field: any) => {
    const { value } = e.target
    const updatedDetails: any = [...editedDetails]
    updatedDetails[detailIndex][field] = value
    setEditedDetails(updatedDetails)
  }

  const handleSaves = () => {
    const updatedFloors = [...savedFloors]
    if (editedFloorIndex !== null) {
      updatedFloors[editedFloorIndex] = {
        ...updatedFloors[editedFloorIndex],
        details: editedDetails,
        plotCount: editedDetails.filter((detail: { type: any }) => detail.type).length,
      }
    }
    setSavedFloors(updatedFloors)
    setEditedFloorIndex(null)
  }

  const handleSubmitFormik = async (values: any, { resetForm }: FormikHelpers<any>, draft: boolean) => {
    try {
      const fileUploadData = await handleUpload()
      if (fileUploadData) {
        values.blue_print = fileUploadData.blue_print
      }

      const fileUploadData2 = await handleUpload2()
      if (fileUploadData2) {
        values.ownership_doc = fileUploadData2.ownership_doc
      }

      values.role = initialValues.role
      values.no_of_floors = initialValues.no_of_floors
      values.floorData = savedFloors
      values.is_drafted = draft
      values.building_name = buildingName
      values.location = selectedMarket

      const res = await axios({
        url: `${ASSETS.LIST.create}`,
        method: "POST",
        data: values,
      })

      if (res?.data?.status === true) {
        toast.success(res?.data?.data?.is_drafted === true ? "Draft saved successfully" : "Assets successfully added")
        resetForm()
        setIsModalOpen(true)
        setSucceessId(res?.data?.data?.assets_id)
      } else if (res?.data?.type === "DUPLICATE") {
        toast.error("Duplicate asset data found. Please check and try again.")
      } else {
        toast.error("Failed to add assets")
      }
    } catch (error) {
      toast.error("Failed to add Assets")
      console.error("Error submitting data:", error)
    }
  }

  // File handling
  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target
    const file = fileInput.files?.[0] ?? null

    if (!file) {
      setFile1(null)
      return
    }

    const fileType = file.type
    const fileSize = file.size
    const acceptedFileTypes = ["image/png", "image/jpeg", "application/pdf"]

    if (!acceptedFileTypes.includes(fileType)) {
      alert("Please upload a PNG, JPEG, or PDF file.")
      setFile1(null)
      fileInput.value = ""
      return
    }

    if (fileSize / 1024 >= 2048) {
      alert("Cannot upload more than 2MB data!")
      setFile1(null)
      fileInput.value = ""
      return
    }

    setFile1(file)
  }

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target
    const file = fileInput.files?.[0] ?? null

    if (!file) {
      setFile2(null)
      return
    }

    const fileType = file.type
    const fileSize = file.size
    const acceptedFileTypes = ["image/png", "image/jpeg", "application/pdf"]

    if (!acceptedFileTypes.includes(fileType)) {
      alert("Please upload a PNG, JPEG, or PDF file.")
      setFile2(null)
      fileInput.value = ""
      return
    }

    if (fileSize / 1024 >= 2048) {
      alert("Cannot upload more than 2MB data!")
      setFile2(null)
      fileInput.value = ""
      return
    }

    setFile2(file)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value)
    const currentDate = new Date()
    const lastYearDate = new Date()
    lastYearDate.setFullYear(currentDate.getFullYear() - 1)
    currentDate.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)
    lastYearDate.setHours(0, 0, 0, 0)

    if (selectedDate < lastYearDate) {
      toast.error("Please select a date within the last year or a future date!")
      return false
    }
    return true
  }

  // Navigation handlers
  const handleBack = () => {
    window.location.replace("/lams/apply/approve-application")
  }

  // const closeModal = () => {
  //   setIsModalOpen(false)
  // }

  const handleClose = () => {
    setIsModalVisible(false)
  }

  const handleCloseDataModal = () => {
    setIsModalVisibleData(false)
  }

  const handleCloseSuccessModal = () => {
    setIsModalOpen(false)
    window.location.replace("/lams/apply/approve-application")
  }

  // Building modal handlers
  const handleSave = (value: boolean) => {
    if (buildingName?.length === 0 && floorCount?.length === 0) {
      toast.error("Building Name & Floor Cannot be Empty")
      return false
    } else if (buildingName?.length == 0) {
      toast.error("Building Name Cannot be Empty")
      return false
    } else if (floorCount?.length == 0) {
      toast.error("Floor Cannot be Empty")
      return false
    }

    const numericFloorCount = Number(floorCount)
    if (isNaN(numericFloorCount) || numericFloorCount < 0) {
      console.error("Invalid floor count")
      return
    }

    const boxes = Array.from({ length: numericFloorCount }, (_, index) => (
      <React.Fragment key={index}>
        <></>
      </React.Fragment>
    ))
    if (numericFloorCount > 0) {
      setFloorDisable(true)
      setNavigationStack((prevStack) => [...prevStack, boxes] as any)
      if (value) {
        handleTypeBox({ target: { value: numericFloorCount } }, "Residential", 0)
        handleTypeBox({ target: { value: numericFloorCount } }, "Commercial", 0)
      }
    }
  }

  const handleFloor = (index: number) => {
    setSelectedFloor(index)
    setPlotNos([])
    setCommercialCount(0)
    setResidentialCount(0)
    setCommercialUnits([])
    setResidentialUnits([])
    setSelectedUnit(null)

    setData((prevData: any) => {
      const updatedData = [...prevData]
      if (!updatedData[index]) {
        updatedData[index] = {
          floor: index === 0 ? "Basement" : `Floor ${index + 1}`,
          units: {},
          plotCount: 0,
        }
      }
      return updatedData
    })

    setNavigationStack((prevStack) => [...prevStack])
  }

  const handlePlotCountChange = (e: any, index: any) => {
    const plotNumber = Number.parseInt(e.target.value)
    setPlotNo(plotNumber)

    setPlotNos((prev) => {
      const newPlotNos = [...prev]
      newPlotNos[index] = plotNumber
      return newPlotNos
    })

    setData((prevData: any) => {
      const updatedData = Array.isArray(prevData) ? [...prevData] : []
      if (!updatedData[index]) {
        updatedData[index] = { floor: index + 2, units: {}, plotCount: plotNumber }
      } else {
        updatedData[index].plotCount = plotNumber
      }
      return updatedData
    })
  }

  const handleTypeBox = (e: any, type: string, index: number | null) => {
    const count = Number.parseInt(e?.target?.value) || e || 0
    if (isNaN(count)) return

    setData((prevData: any) => {
      const updatedData = [...prevData]
      if (index !== null && index >= 0 && index < updatedData.length) {
        const floorObj = updatedData[index] || {}
        floorObj.units = floorObj.units || {}
        floorObj.units[type] = new Array(count).fill({}).map((_, unitIndex) => ({
          index: unitIndex + 1,
          type,
        }))
        updatedData[index] = floorObj
      }
      return updatedData
    })

    const newBoxes = Array.from({ length: count }, (_, boxIndex) => (
      <div key={`box-${index}-${boxIndex}`} className="flex flex-column"></div>
    ))

    setNavigationStack((prevStack) => {
      const newStack = [...prevStack]
      newStack[index || 0] = [newBoxes]
      return newStack
    })
  }

  const generateBoxes = (count: any) => {
    return Array.from({ length: count }, (_, index) => index + 1)
  }

  const handleUnitClick = (type: string, index: number) => {
    if (type === "Commercial") {
      if (!commercialUnits[index]) {
        const updatedUnits: any = [...commercialUnits]
        updatedUnits[index] = {
          length: Number(""),
          breadth: Number(""),
          height: Number(""),
          name: "",
          property_name: "",
          index: index,
          type: "Commercial",
        }
        setCommercialUnits(updatedUnits)
      }
    } else if (type === "Residential") {
      if (!residentialUnits[index]) {
        const updatedUnits = [...residentialUnits]
        updatedUnits[index] = {
          length: Number(""),
          breadth: Number(""),
          height: Number(""),
          name: "",
          property_name: "",
          index: index,
          type: "Residential",
        }
        setResidentialUnits(updatedUnits)
      }
    }

    setSelectedUnit({ type, index })
  }

  const handleUnitDetailsChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value
    if (selectedUnit) {
      if (selectedUnit.type === "Commercial") {
        const updatedUnits = [...commercialUnits]
        updatedUnits[selectedUnit.index] = {
          ...updatedUnits[selectedUnit.index],
          [field]: value,
        }
        setCommercialUnits(updatedUnits)
      } else if (selectedUnit.type === "Residential") {
        const updatedUnits = [...residentialUnits]
        updatedUnits[selectedUnit.index] = {
          ...updatedUnits[selectedUnit.index],
          [field]: value,
        }
        setResidentialUnits(updatedUnits)
      }
    }
  }

  const validateUnitCount = (
    newCount: number,
    existingCount: any,
    maxCount: number,
    setCount: { (value: any): void; (value: any): void; (arg0: number): void },
    setUnits: any,
    type: string,
  ) => {
    if (newCount + existingCount > maxCount) {
      alert(`The total number of Commercial and Residential units cannot exceed ${maxCount}.`)
      setCount(0)
    } else {
      setCount(newCount)
      const emptyUnits = Array.from({ length: newCount }, (_, i) => ({
        length: 0,
        breadth: 0,
        height: 0,
        name: "",
        property_name: "",
        index: i,
        type: type,
      }))
      setUnits(emptyUnits)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#007335]"></div>
        <Image src={Jhar || "/placeholder.svg"} alt="jhar" className="rounded-full h-28 w-28" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </Button>
            </div>
            <div>
              <InnerHeading className="text-2xl font-bold text-gray-900">Asset Registration</InnerHeading>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center space-x-3">
              <Image
                src={Customer || "/placeholder.svg"}
                alt="employee"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-semibold text-gray-900">Asset Registration Form</span>
            </CardTitle>
          </CardHeader>
          <div className="overflow-y-auto max-h-[calc(110vh-200px)]">
            <CardContent className="p-8">
              <Formik
                initialValues={initialValues}
                validationSchema={employeeValidationSchema}
                onSubmit={(values, formikHelpers) => handleSubmitFormik(values, formikHelpers, draft)}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, handleReset }) => {
                  const handleDataModal = () => {
                    setIsModalVisibleData(!isModalVisibleData)
                  }

                  useEffect(() => {
                    if (values.type_of_assets === "Building") {
                      setIsModalVisible(true)
                    } else {
                      setIsModalVisible(false)
                    }
                  }, [values.type_of_assets])

                  return (
                    <>
                      <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Asset Information Section */}
                        <div className="space-y-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <Building className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Asset Information</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="type_of_assets" className="text-sm font-medium text-gray-700">
                                Asset Category Name <span className="text-red-500">*</span>
                              </Label>
                              <SelectForNoApi
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.type_of_assets}
                                error={errors.type_of_assets}
                                touched={touched.type_of_assets}
                                label=""
                                name="type_of_assets"
                                required={true}
                                placeholder={"Choose Asset Category Name"}
                                options={[
                                  { id: 1, name: "Building" },
                                  { id: 2, name: "Hall" },
                                  { id: 3, name: "Vacant Land" },
                                  { id: 4, name: "Others" },
                                ]}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="asset_sub_category_name" className="text-sm font-medium text-gray-700">
                                Asset Sub-Category Name
                              </Label>
                              <SelectForNoApi
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.asset_sub_category_name}
                                error={errors.asset_sub_category_name}
                                touched={touched.asset_sub_category_name}
                                label=""
                                name="asset_sub_category_name"
                                placeholder={"Choose Asset Sub Category Name"}
                                options={[
                                  { id: 1, name: "Hospitals" },
                                  { id: 2, name: "Library" },
                                  { id: 3, name: "Parking" },
                                  { id: 4, name: "Enclosed/Non-Enclosed" },
                                  ...(values.type_of_assets === "Building" ? [] : [{ id: 5, name: "Vacant Land" }]),
                                  { id: 6, name: "Gym" },
                                  { id: 7, name: "Market" },
                                ]}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="assets_category_type" className="text-sm font-medium text-gray-700">
                                Asset Category Type
                              </Label>
                              <SelectForNoApi
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.assets_category_type}
                                error={errors.assets_category_type}
                                touched={touched.assets_category_type}
                                label=""
                                name="assets_category_type"
                                placeholder={"Choose Asset Category Type"}
                                options={[
                                  { id: 1, name: "Immovable" },
                                  { id: 2, name: "movable" },
                                ]}
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Property Details Section */}
                        <div className="space-y-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                              onKeyPress={(e: any) => {
                                if (!/[a-zA-Z0-9/-]/.test(e.key)) {
                                  e.preventDefault()
                                }
                              }}
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
                                  e.preventDefault()
                                }
                              }}
                            />

                            <div className="">
                              <Label htmlFor="type_of_land" className="">
                                Type of Land <span className="text-red-500">*</span>
                              </Label>
                              <SelectForNoApi
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.type_of_land}
                                error={errors.type_of_land}
                                touched={touched.type_of_land}
                                label=""
                                name="type_of_land"
                                required={true}
                                placeholder={"Choose Type of Land"}
                                options={[
                                  { id: 1, name: "Commercial Land" },
                                  { id: 2, name: "Residential Land" },
                                  { id: 3, name: "Agriculture Land" },
                                  { id: 4, name: "Mixed Land" },
                                ]}
                              />
                            </div>

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
                                if (!((e.key >= "0" && e.key <= "9") || e.key === ".")) {
                                  e.preventDefault()
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
                                if (!/[a-zA-Z0-9,/-]/.test(e.key)) {
                                  e.preventDefault()
                                }
                              }}
                            />
                          </div>
                        </div>

                        <Separator />

                        {/* Document Upload Section */}
                        <div className="space-y-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <Upload className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Document Upload</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="blue_print" className="text-sm font-medium text-gray-700">
                                Blue Print
                              </Label>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                                <input
                                  type="file"
                                  name="blue_print"
                                  accept="image/*,.pdf"
                                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                  onChange={handleFile1Change}
                                />
                                <p className="text-xs text-gray-500 mt-1">PNG, JPEG, or PDF (max 2MB)</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="ownership_doc" className="text-sm font-medium text-gray-700">
                                Ownership Documents
                              </Label>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                                <input
                                  type="file"
                                  name="ownership_doc"
                                  accept="image/*,.pdf"
                                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                  onChange={handleFile2Change}
                                />
                                <p className="text-xs text-gray-500 mt-1">PNG, JPEG, or PDF (max 2MB)</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Legal Information Section */}
                        <div className="space-y-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Legal Information</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputBox
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.order_no}
                              error={errors.order_no}
                              touched={touched.order_no}
                              label="Order No."
                              name="order_no"
                              type="text"
                              placeholder={"Enter order no."}
                              maxLength={10}
                            />

                            <div className="space-y-2">
                              <Label htmlFor="order_date" className="text-sm font-medium text-gray-700">
                                Order Date *
                              </Label>
                              <InputBox
                                onChange={(e) => {
                                  if (handleDateChange(e as any)) {
                                    handleChange(e)
                                  }
                                }}
                                onBlur={handleBlur}
                                error={errors.order_date}
                                touched={touched.order_date}
                                value={values.order_date}
                                label=""
                                name="order_date"
                                type="date"
                                placeholder={"Enter order date"}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="acquisition" className="text-sm font-medium text-gray-700">
                                Date of Acquisition *
                              </Label>
                              <InputBox
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.acquisition}
                                value={values.acquisition}
                                label=""
                                placeholder={"Enter Your Acquisition"}
                                name="acquisition"
                                type="date"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="mode_of_acquisition" className="text-sm font-medium text-gray-700">
                                Mode of Acquisition
                              </Label>
                              <SelectForNoApi
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.mode_of_acquisition}
                                label=""
                                name="mode_of_acquisition"
                                placeholder={"Choose mode of Acquisition"}
                                options={[
                                  { id: 1, name: "Acquired" },
                                  { id: 2, name: "Donation" },
                                  { id: 3, name: "Purchase" },
                                  { id: 4, name: "Others" },
                                ]}
                              />
                            </div>

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

                            <InputBox
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.building_approval_plan}
                              label="Building Approval Plan No. / Gift Deed No."
                              placeholder={"Building Approval Plan No. / Gift Deed No."}
                              name="building_approval_plan"
                              type="text"
                              maxLength={20}
                              onKeyPress={(e: any) => {
                                if (!/[a-zA-Z0-9,/-]/.test(e.key)) {
                                  e.preventDefault()
                                }
                              }}
                            />
                          </div>
                        </div>

                        <Separator />

                        {/* Location Information Section */}
                        <div className="space-y-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                                Select Location
                              </Label>
                              <select
                                name="location"
                                id="location"
                                value={selectedMarket}
                                onChange={handleMarketChange}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="" disabled>
                                  -- Choose a Location --
                                </option>
                                {circleData?.map((item: any) => (
                                  <option key={item.id} value={item.location}>
                                    {item.location}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="ward_no" className="text-sm font-medium text-gray-700">
                                Ward No. *
                              </Label>
                              <SelectForNoApi
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label=""
                                name="ward_no"
                                value={values.ward_no}
                                error={errors.ward_no}
                                touched={touched.ward_no}
                                placeholder={"Ward no."}
                                required={true}
                                options={Array.from({ length: 55 }, (_, index) => ({
                                  id: index + 1,
                                  name: `${index + 1}`,
                                }))}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                          <Button type="button" variant="outline" onClick={handleReset} className="px-6 bg-transparent">
                            Reset
                          </Button>
                          <Button type="submit" variant="outline" onClick={() => setDraft(true)} className="px-6">
                            <Save className="h-4 w-4 mr-2" />
                            Save As Draft
                          </Button>
                          <Button
                            type="submit"
                            onClick={() => setDraft(false)}
                            className="px-6 bg-blue-600 hover:bg-blue-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </form>

                      {/* Building Modal */}
                      {values.type_of_assets === "Building" && isModalVisible && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                              <div className="flex items-center space-x-3">
                                <Building className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-900">Building Configuration</h2>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Button
                                  variant="outline"
                                  onClick={handleDataModal}
                                  className="flex items-center space-x-2 bg-transparent"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>View Data</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={handleClose}
                                  className="hover:bg-red-100 hover:text-red-600"
                                >
                                  <X className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>

                            {/* Modal Content with Scroll */}
                            <ScrollArea className="h-[calc(90vh-120px)]">
                              <div className="p-6 space-y-8">
                                {/* Building Basic Info */}
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
                                          onChange={(e: any) => setBuildingName(e.target.value)}
                                          placeholder="Enter building name"
                                          disabled={floorDisable}
                                          onKeyPress={(e: any) => {
                                            if (!/[a-zA-Z0-9/ ]/.test(e.key)) {
                                              e.preventDefault()
                                            }
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="floorCount">Number of Floors (1-10) *</Label>
                                        <Input
                                          id="floorCount"
                                          type="number"
                                          min="1"
                                          max="10"
                                          value={floorCount}
                                          onChange={(e: any) => {
                                            const value = Number.parseInt(e.target.value)
                                            if (!isNaN(value) && value >= 1 && value <= 10) {
                                              setFloorCount(value.toString())
                                            } else if (e.target.value === "") {
                                              setFloorCount("")
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

                                {/* Floor Selection */}
                                {floorDisable && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Floor Selection</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                        {Array.from({ length: Math.max(Number(floorCount), 0) + 2 }, (_, index) => {
                                          const savedFloorNumbers = savedFloors.map((floor) => {
                                            const match = floor.floor.match(/\d+/)
                                            return match ? Number(match[0]) : null
                                          })
                                          const isSaved = savedFloorNumbers.includes(index - 1)

                                          return (
                                            <Button
                                              key={index}
                                              variant={selectedFloor === index ? "default" : "outline"}
                                              className={`h-16 flex flex-col items-center justify-center relative ${isSaved
                                                  ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                                                  : selectedFloor === index
                                                    ? "bg-blue-600 text-white"
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
                                                {index === 0 ? "Basement" : `Floor ${index - 1}`}
                                              </span>
                                            </Button>
                                          )
                                        })}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Floor Configuration */}
                                {selectedFloor !== null && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>
                                        {selectedFloor === 0 ? "Basement" : `Floor ${selectedFloor - 1}`} Configuration
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
                                          onChange={(e: any) => handlePlotCountChange(e, selectedFloor)}
                                          maxLength={3}
                                          onKeyPress={(e: any) => {
                                            if (!(e.key >= "0" && e.key <= "9")) {
                                              e.preventDefault()
                                            }
                                          }}
                                        />
                                      </div>

                                      {plotNo > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label htmlFor="commercialUnits">Commercial Units</Label>
                                            <Input
                                              id="commercialUnits"
                                              type="number"
                                              placeholder="Number of Commercial units"
                                              onChange={(e: any) => {
                                                const commercialUnitsCount = Number.parseInt(e.target.value) || 0
                                                validateUnitCount(
                                                  commercialUnitsCount,
                                                  residentialCount,
                                                  plotNo,
                                                  setCommercialCount,
                                                  setCommercialUnits,
                                                  "Commercial",
                                                )
                                              }}
                                              value={commercialCount}
                                              maxLength={2}
                                              onKeyPress={(e: any) => {
                                                if (!(e.key >= "0" && e.key <= "9")) {
                                                  e.preventDefault()
                                                }
                                              }}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="residentialUnits">Residential Units</Label>
                                            <Input
                                              id="residentialUnits"
                                              type="number"
                                              placeholder="Number of Residential units"
                                              onChange={(e: any) => {
                                                const residentialUnitsCount = Number.parseInt(e.target.value) || 0
                                                validateUnitCount(
                                                  residentialUnitsCount,
                                                  commercialCount,
                                                  plotNo,
                                                  setResidentialCount,
                                                  setResidentialUnits,
                                                  "Residential",
                                                )
                                              }}
                                              value={residentialCount}
                                              maxLength={2}
                                              onKeyPress={(e: any) => {
                                                if (!(e.key >= "0" && e.key <= "9")) {
                                                  e.preventDefault()
                                                }
                                              }}
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
                                                  const unit = commercialUnits[num - 1]
                                                  const isComplete =
                                                    unit?.length &&
                                                    unit?.breadth &&
                                                    unit?.height &&
                                                    unit?.name &&
                                                    unit?.property_name

                                                  return (
                                                    <Button
                                                      key={num}
                                                      variant={
                                                        selectedUnit?.type === "Commercial" &&
                                                          selectedUnit?.index === num - 1
                                                          ? "default"
                                                          : "outline"
                                                      }
                                                      className={`h-12 ${isComplete
                                                          ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                                                          : selectedUnit?.type === "Commercial" &&
                                                            selectedUnit?.index === num - 1
                                                            ? "bg-blue-600 text-white"
                                                            : "hover:bg-gray-50"
                                                        }`}
                                                      onClick={() => handleUnitClick("Commercial", num - 1)}
                                                    >
                                                      {isComplete && <Check className="h-3 w-3 mr-1" />}
                                                      {num}
                                                    </Button>
                                                  )
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
                                                  const unit = residentialUnits[num - 1]
                                                  const isComplete =
                                                    unit?.length &&
                                                    unit?.breadth &&
                                                    unit?.height &&
                                                    unit?.name &&
                                                    unit?.property_name

                                                  return (
                                                    <Button
                                                      key={num}
                                                      variant={
                                                        selectedUnit?.type === "Residential" &&
                                                          selectedUnit?.index === num - 1
                                                          ? "default"
                                                          : "outline"
                                                      }
                                                      className={`h-12 ${isComplete
                                                          ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                                                          : selectedUnit?.type === "Residential" &&
                                                            selectedUnit?.index === num - 1
                                                            ? "bg-blue-600 text-white"
                                                            : "hover:bg-gray-50"
                                                        }`}
                                                      onClick={() => handleUnitClick("Residential", num - 1)}
                                                    >
                                                      {isComplete && <Check className="h-3 w-3 mr-1" />}
                                                      {num}
                                                    </Button>
                                                  )
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
                                                {selectedUnit.type} Unit {selectedUnit.index + 1} Details
                                              </span>
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                              <div className="space-y-2">
                                                <Label htmlFor="length">Length (meters) *</Label>
                                                <Input
                                                  id="length"
                                                  type="number"
                                                  placeholder="Length in meters"
                                                  value={
                                                    selectedUnit.type === "Commercial"
                                                      ? commercialUnits[selectedUnit.index]?.length || ""
                                                      : residentialUnits[selectedUnit.index]?.length || ""
                                                  }
                                                  onChange={(e: any) => handleUnitDetailsChange(e, "length")}
                                                />
                                              </div>
                                              <div className="space-y-2">
                                                <Label htmlFor="breadth">Breadth (meters) *</Label>
                                                <Input
                                                  id="breadth"
                                                  type="number"
                                                  placeholder="Breadth in meters"
                                                  value={
                                                    selectedUnit.type === "Commercial"
                                                      ? commercialUnits[selectedUnit.index]?.breadth || ""
                                                      : residentialUnits[selectedUnit.index]?.breadth || ""
                                                  }
                                                  onChange={(e: any) => handleUnitDetailsChange(e, "breadth")}
                                                />
                                              </div>
                                              <div className="space-y-2">
                                                <Label htmlFor="height">Height (meters) *</Label>
                                                <Input
                                                  id="height"
                                                  type="number"
                                                  placeholder="Height in meters"
                                                  value={
                                                    selectedUnit.type === "Commercial"
                                                      ? commercialUnits[selectedUnit.index]?.height || ""
                                                      : residentialUnits[selectedUnit.index]?.height || ""
                                                  }
                                                  onChange={(e: any) => handleUnitDetailsChange(e, "height")}
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
                                                      ? commercialUnits[selectedUnit.index]?.name || ""
                                                      : residentialUnits[selectedUnit.index]?.name || ""
                                                  }
                                                  onChange={(e: any) => handleUnitDetailsChange(e, "name")}
                                                />
                                              </div>
                                              <div className="space-y-2">
                                                <Label htmlFor="propertyName">Property Name *</Label>
                                                <Input
                                                  id="propertyName"
                                                  placeholder="Property Name"
                                                  value={
                                                    selectedUnit.type === "Commercial"
                                                      ? commercialUnits[selectedUnit.index]?.property_name || ""
                                                      : residentialUnits[selectedUnit.index]?.property_name || ""
                                                  }
                                                  onChange={(e: any) => handleUnitDetailsChange(e, "property_name")}
                                                  onKeyPress={(e: any) => {
                                                    if (!/[a-zA-Z0-9/-]/.test(e.key)) {
                                                      e.preventDefault()
                                                    }
                                                  }}
                                                />
                                              </div>
                                            </div>
                                            <div className="flex justify-center pt-4">
                                              <Button onClick={handleSaveFloorData} className="px-8 py-3">
                                                <Save className="h-4 w-4 mr-2" />
                                                Save & Move to Next Step
                                              </Button>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )}

                                      {/* Current Floor Summary */}
                                      <Card className="bg-blue-50 border-blue-200">
                                        <CardHeader>
                                          <CardTitle className="text-blue-800">
                                            {selectedFloor === 0 ? "Basement" : `Floor ${selectedFloor - 1}`} Summary
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                            <div>
                                              <div className="text-2xl font-bold text-blue-600">{plotNo || 0}</div>
                                              <div className="text-sm text-gray-600">Total Units</div>
                                            </div>
                                            <div>
                                              <div className="text-2xl font-bold text-blue-600">{commercialCount}</div>
                                              <div className="text-sm text-gray-600">Commercial</div>
                                            </div>
                                            <div>
                                              <div className="text-2xl font-bold text-green-600">{residentialCount}</div>
                                              <div className="text-sm text-gray-600">Residential</div>
                                            </div>
                                            <div>
                                              <div className="text-2xl font-bold text-purple-600">
                                                {
                                                  [...commercialUnits, ...residentialUnits].filter(
                                                    (u) =>
                                                      u?.length && u?.breadth && u?.height && u?.name && u?.property_name,
                                                  ).length
                                                }
                                              </div>
                                              <div className="text-sm text-gray-600">Completed</div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      {/* Current Floor Units Display */}
                                      <div className="space-y-6">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                          {selectedFloor === 0 ? "Basement" : `Floor ${selectedFloor - 1}`} Units
                                        </h3>

                                        {/* Commercial Units Display */}
                                        {commercialUnits?.length > 0 && (
                                          <div>
                                            <h4 className="text-lg font-semibold text-blue-600 mb-4">Commercial Units</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                              {commercialUnits.map((unit, index) => {
                                                const isValid =
                                                  unit?.length &&
                                                  unit?.breadth &&
                                                  unit?.height &&
                                                  unit?.name &&
                                                  unit?.property_name
                                                return (
                                                  <Card
                                                    key={index}
                                                    className={`${isValid ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}
                                                  >
                                                    <CardHeader className="pb-2">
                                                      <CardTitle
                                                        className={`text-lg ${isValid ? "text-green-700" : "text-yellow-700"}`}
                                                      >
                                                        Unit {index + 1}
                                                        {isValid && <Check className="h-4 w-4 inline ml-2" />}
                                                      </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-2 text-sm">
                                                      <p>
                                                        <strong>Length:</strong> {unit?.length || "N/A"} meters
                                                      </p>
                                                      <p>
                                                        <strong>Breadth:</strong> {unit?.breadth || "N/A"} meters
                                                      </p>
                                                      <p>
                                                        <strong>Height:</strong> {unit?.height || "N/A"} meters
                                                      </p>
                                                      <p>
                                                        <strong>Owner:</strong> {unit?.name || "N/A"}
                                                      </p>
                                                      <p>
                                                        <strong>Property:</strong> {unit?.property_name || "N/A"}
                                                      </p>
                                                    </CardContent>
                                                  </Card>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        )}

                                        {/* Residential Units Display */}
                                        {residentialUnits?.length > 0 && (
                                          <div>
                                            <h4 className="text-lg font-semibold text-green-600 mb-4">
                                              Residential Units
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                              {residentialUnits.map((unit, index) => {
                                                const isValid =
                                                  unit?.length &&
                                                  unit?.breadth &&
                                                  unit?.height &&
                                                  unit?.name &&
                                                  unit?.property_name
                                                return (
                                                  <Card
                                                    key={index}
                                                    className={`${isValid ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}
                                                  >
                                                    <CardHeader className="pb-2">
                                                      <CardTitle
                                                        className={`text-lg ${isValid ? "text-green-700" : "text-yellow-700"}`}
                                                      >
                                                        Unit {index + 1}
                                                        {isValid && <Check className="h-4 w-4 inline ml-2" />}
                                                      </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-2 text-sm">
                                                      <p>
                                                        <strong>Length:</strong> {unit?.length || "N/A"} meters
                                                      </p>
                                                      <p>
                                                        <strong>Breadth:</strong> {unit?.breadth || "N/A"} meters
                                                      </p>
                                                      <p>
                                                        <strong>Height:</strong> {unit?.height || "N/A"} meters
                                                      </p>
                                                      <p>
                                                        <strong>Owner:</strong> {unit?.name || "N/A"}
                                                      </p>
                                                      <p>
                                                        <strong>Property:</strong> {unit?.property_name || "N/A"}
                                                      </p>
                                                    </CardContent>
                                                  </Card>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Building Summary */}
                                      <Card className="bg-gray-50 border-gray-200">
                                        <CardHeader>
                                          <CardTitle className="text-gray-800">Building Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                              <span className="font-semibold text-blue-600">Total Floors:</span>
                                              <span className="ml-2">{floorCount || 0}</span>
                                            </div>
                                            <div>
                                              <span className="font-semibold text-blue-600">Total Units:</span>
                                              <span className="ml-2">{plotNo || 0}</span>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      )}

                      {/* Data View Modal */}
                      {isModalVisibleData && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                              <h3 className="text-2xl font-bold text-gray-900">Building Data Overview</h3>
                              <Button variant="ghost" size="icon" onClick={handleCloseDataModal}>
                                <X className="h-5 w-5" />
                              </Button>
                            </div>

                            <ScrollArea className="h-[calc(90vh-120px)]">
                              <div className="p-6 space-y-6">
                                {/* Building Summary */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Building Summary</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                      <div>
                                        <div className="text-3xl font-bold text-blue-600">{buildingName || "N/A"}</div>
                                        <div className="text-sm text-gray-600">Building Name</div>
                                      </div>
                                      <div>
                                        <div className="text-3xl font-bold text-green-600">{floorCount || 0}</div>
                                        <div className="text-sm text-gray-600">Total Floors</div>
                                      </div>
                                      <div>
                                        <div className="text-3xl font-bold text-purple-600">
                                          {savedFloors.reduce((sum, floor) => sum + (floor.plotCount || 0), 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Units</div>
                                      </div>
                                      <div>
                                        <div className="text-3xl font-bold text-orange-600">{savedFloors.length}</div>
                                        <div className="text-sm text-gray-600">Saved Floors</div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Saved Floors Data */}
                                <div className="space-y-4">
                                  {Object.values(
                                    savedFloors?.reduce((acc: any, floor: any) => {
                                      const floorNumber = floor.floor
                                      if (!acc[floorNumber]) {
                                        acc[floorNumber] = []
                                      }
                                      acc[floorNumber].push(floor)
                                      return acc
                                    }, {}),
                                  ).map((floorGroup: any, idx) => (
                                    <Card key={idx} className="border-green-300 bg-green-50">
                                      <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                          <span className="text-green-800">
                                            {floorGroup[0]?.floor === 0 ? "Basement" : `Floor ${floorGroup[0]?.floor}`}
                                          </span>
                                          <Badge className="bg-green-100 text-green-800">Complete</Badge>
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                          {floorGroup.map((floor: any, index: any) => {
                                            const isEditMode = editedFloorIndex === index

                                            return (
                                              <div key={index} className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                  <h4 className="font-semibold text-green-700">
                                                    Plot Count: {floor.plotCount}
                                                  </h4>
                                                  {isEditMode ? (
                                                    <Button
                                                      size="sm"
                                                      onClick={handleSaves}
                                                      className="bg-blue-600 hover:bg-blue-700"
                                                    >
                                                      <Save className="h-4 w-4 mr-1" />
                                                      Save
                                                    </Button>
                                                  ) : (
                                                    <Button
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={() => handleEditFloor(floor, index)}
                                                    >
                                                      <Edit3 className="h-4 w-4 mr-1" />
                                                      Edit
                                                    </Button>
                                                  )}
                                                </div>

                                                <div className="space-y-3">
                                                  {floor.details.map((detail: any, idx: any) => (
                                                    <Card key={idx} className="bg-white border-green-200">
                                                      <CardContent className="p-4">
                                                        {isEditMode ? (
                                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div>
                                                              <Label className="text-xs">Type:</Label>
                                                              <Input
                                                                value={editedDetails[idx]?.type || ""}
                                                                onChange={(e: any) => handleInputChange(e, idx, "type")}
                                                                className="h-8 text-sm"
                                                              />
                                                            </div>
                                                            <div>
                                                              <Label className="text-xs">Length:</Label>
                                                              <Input
                                                                type="number"
                                                                value={editedDetails[idx]?.length || ""}
                                                                onChange={(e: any) => handleInputChange(e, idx, "length")}
                                                                className="h-8 text-sm"
                                                              />
                                                            </div>
                                                            <div>
                                                              <Label className="text-xs">Breadth:</Label>
                                                              <Input
                                                                type="number"
                                                                value={editedDetails[idx]?.breadth || ""}
                                                                onChange={(e: any) => handleInputChange(e, idx, "breadth")}
                                                                className="h-8 text-sm"
                                                              />
                                                            </div>
                                                            <div>
                                                              <Label className="text-xs">Height:</Label>
                                                              <Input
                                                                type="number"
                                                                value={editedDetails[idx]?.height || ""}
                                                                onChange={(e: any) => handleInputChange(e, idx, "height")}
                                                                className="h-8 text-sm"
                                                              />
                                                            </div>
                                                            <div>
                                                              <Label className="text-xs">Owner Name:</Label>
                                                              <Input
                                                                value={editedDetails[idx]?.name || ""}
                                                                onChange={(e: any) => handleInputChange(e, idx, "name")}
                                                                className="h-8 text-sm"
                                                              />
                                                            </div>
                                                            <div>
                                                              <Label className="text-xs">Property Name:</Label>
                                                              <Input
                                                                value={editedDetails[idx]?.property_name || ""}
                                                                onChange={(e: any) =>
                                                                  handleInputChange(e, idx, "property_name")
                                                                }
                                                                className="h-8 text-sm"
                                                              />
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          <div className="grid grid-cols-2 gap-2 text-sm">
                                                            <p>
                                                              <strong>Type:</strong> {detail.type}
                                                            </p>
                                                            <p>
                                                              <strong>Length:</strong> {detail.length} m
                                                            </p>
                                                            <p>
                                                              <strong>Breadth:</strong> {detail.breadth} m
                                                            </p>
                                                            <p>
                                                              <strong>Height:</strong> {detail.height} m
                                                            </p>
                                                            <p>
                                                              <strong>Owner:</strong> {detail.name}
                                                            </p>
                                                            <p>
                                                              <strong>Property:</strong> {detail.property_name}
                                                            </p>
                                                          </div>
                                                        )}
                                                      </CardContent>
                                                    </Card>
                                                  ))}
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      )}
                    </>
                  )
                }}
              </Formik>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Congratulations!</h3>
                <p className="text-gray-600">Asset Added Successfully</p>
              </div>

              {succeessId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">Asset ID:</span>
                    <span className="font-bold text-lg text-blue-600">{succeessId}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(succeessId)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <Button onClick={handleCloseSuccessModal} className="w-full bg-blue-600 hover:bg-blue-700">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
