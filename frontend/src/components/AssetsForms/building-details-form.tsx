"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Building, DollarSign, Save, Send, Plus, Check, Edit3, Eye, X, Upload } from "lucide-react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { ASSETS } from '@/utils/api/urls';

interface Unit {
  index: number
  type: "Commercial" | "Residential"
  length?: number
  breadth?: number
  height?: number
  owner_name?: string
  property_no?: string
}

export default function BuildingDetailsForm() {
  // Building Configuration States
  const [showBuildingConfig, setShowBuildingConfig] = useState(false)
  const [buildingName, setBuildingName] = useState("")
  const [floorCount, setFloorCount] = useState("")
  const [floorDisable, setFloorDisable] = useState(false)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [plotNo, setPlotNo] = useState(0)
  const [commercialCount, setCommercialCount] = useState(0)
  const [residentialCount, setResidentialCount] = useState(0)
  const [commercialUnits, setCommercialUnits] = useState<Unit[]>([])
  const [residentialUnits, setResidentialUnits] = useState<Unit[]>([])
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [savedFloors, setSavedFloors] = useState<any[]>([])
  const [showDataModal, setShowDataModal] = useState(false)
  const [financialYear, setFinancialYear] = useState("")
  const [startYear, setStartYear] = useState("")
  const [endYear, setEndYear] = useState("")

  // Add these new state variables after the existing ones
  const [formData, setFormData] = useState({
    asset_type: "BUILDING",
    building_name: "",
    ulb_id: 2,
    role: "Municipal",
    head: "",
    cost_of_acquisition: "",
    accumulated_depreciation: "",
    addition_during_year: "",
    depreciation_for_year: "",
    wdv_start: "",
    wdv_end: "",
    ownership_type: "",
    date_of_acquisition: "",
    contractor_name: "",
    road_name: "",
    road_type: "",
    financial_year: "",
    is_drafted: false,
    parent_land_id: "",
  })

  // File Upload States
  const [blueprintFile, setBlueprintFile] = useState<File | null>(null)
  const [ownershipFile, setOwnershipFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

const handleFileUpload = async (
  file: File,
  endpoint = "https://jharkhandegovernance.com/auth/api/lams/v1/dms/upload-gets"
) => {
  if (!file) return null

  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await axios.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data?.data || response.data?.filename
  } catch (error: any) {
    console.error("File upload error:", error)
    toast.error("Failed to upload file")
    return null
  }
}


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "blueprint" | "ownership") => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileType = file.type
    const fileSize = file.size
    const acceptedFileTypes = ["image/png", "image/jpeg", "application/pdf"]

    if (!acceptedFileTypes.includes(fileType)) {
      toast.error("Please upload a PNG, JPEG, or PDF file.")
      return
    }

    if (fileSize / 1024 >= 2048) {
      toast.error("Cannot upload more than 2MB data!")
      return
    }

    if (type === "blueprint") {
      setBlueprintFile(file)
    } else {
      setOwnershipFile(file)
    }
  }

const handleSaveDraft = async () => {
  setIsSubmitting(true)
  try {
    // Upload files first
    let blueprintUrl = null
    let ownershipUrl = null

    if (blueprintFile) {
      blueprintUrl = await handleFileUpload(blueprintFile)
    }

    if (ownershipFile) {
      ownershipUrl = await handleFileUpload(ownershipFile)
    }

    // Prepare the payload
    const payload = {
      asset_type: "BUILDING",
      building_name: buildingName,
      ulb_id: 2,
      blue_print: blueprintUrl || "blueprint.pdf",
      ownership_doc: ownershipUrl || "ownership_doc.pdf",
      role: "Municipal",
      head: formData.head || "Urban Development",
      cost_of_acquisition: Number(formData.cost_of_acquisition) || 1200000,
      accumulated_depreciation: Number(formData.accumulated_depreciation) || 100000,
      addition_during_year: Number(formData.addition_during_year) || 50000,
      depreciation_for_year: Number(formData.depreciation_for_year) || 20000,
      wdv_start: Number(formData.wdv_start) || 1100000,
      wdv_end: Number(formData.wdv_end) || 1080000,
      ownership_type: formData.ownership_type || "FREEHOLD",
      date_of_acquisition: formData.date_of_acquisition,
      contractor_name: formData.contractor_name,
      road_name: formData.road_name,
      road_type: formData.road_type || "EARTHEN",
      financial_year: financialYear,
      is_drafted: true,
      parent_land_id: Number(formData.parent_land_id) || 2,
      floorData: savedFloors,
    }

    const response = await axios.post("https://jharkhandegovernance.com/auth/api/lams/v1/asset/create", payload)

    toast.success("Building Details form saved as draft")
    console.log("API Response:", response.data)
  } catch (error) {
    console.error("Save draft error:", error)
    toast.error("Failed to save building as draft")
  } finally {
    setIsSubmitting(false)
  }
}

const handleSubmitForReview = async () => {
  setIsSubmitting(true)
  try {
    // Upload files first
    let blueprintUrl = null
    let ownershipUrl = null

    if (blueprintFile) {
      blueprintUrl = await handleFileUpload(blueprintFile)
    }

    if (ownershipFile) {
      ownershipUrl = await handleFileUpload(ownershipFile)
    }

    // Prepare the payload
    const payload = {
      asset_type: "BUILDING",
      building_name: buildingName,
      ulb_id: 2,
      blue_print: blueprintUrl || "blueprint.pdf",
      ownership_doc: ownershipUrl || "ownership_doc.pdf",
      role: "Municipal",
      head: "",
      cost_of_acquisition: Number(formData.cost_of_acquisition) || 1200000,
      accumulated_depreciation: Number(formData.accumulated_depreciation) || 100000,
      addition_during_year: Number(formData.addition_during_year) || 50000,
      depreciation_for_year: Number(formData.depreciation_for_year) || 20000,
      wdv_start: Number(formData.wdv_start) || 1100000,
      wdv_end: Number(formData.wdv_end) || 1080000,
      ownership_type: formData.ownership_type || "FREEHOLD",
      date_of_acquisition: formData.date_of_acquisition,
      contractor_name: formData.contractor_name,
      road_name: formData.road_name,
      road_type: formData.road_type || "EARTHEN",
      financial_year: financialYear,
      is_drafted: false,
      parent_land_id: Number(formData.parent_land_id) || 2,
      floorData: savedFloors,
    }

    const response = await axios.post("https://jharkhandegovernance.com/auth/api/lams/v1/asset/create", payload)

    toast.success("Building Details form submitted for review")
    console.log("API Response:", response.data)

    // Reset form after successful submission
    setBuildingName("")
    setFloorCount("")
    setFloorDisable(false)
    setSavedFloors([])
    setBlueprintFile(null)
    setOwnershipFile(null)
    setFinancialYear("")
    setStartYear("")
    setEndYear("")
  } catch (error) {
    console.error("Submit error:", error)
    toast.error("Failed to submit building for review")
  } finally {
    setIsSubmitting(false)
  }
}

  const handleOpenBuildingConfig = () => {
    setShowBuildingConfig(true)
  }

  const handleCloseBuildingConfig = () => {
    setShowBuildingConfig(false)
  }

  const handleSaveBuildingInfo = () => {
    if (buildingName?.length === 0 && floorCount?.length === 0) {
      toast.error("Building Name & Floor Cannot be Empty")
      return false
    } else if (buildingName?.length === 0) {
      toast.error("Building Name Cannot be Empty")
      return false
    } else if (floorCount?.length === 0) {
      toast.error("Floor Cannot be Empty")
      return false
    }

    const numericFloorCount = Number(floorCount)
    if (isNaN(numericFloorCount) || numericFloorCount < 0) {
      console.error("Invalid floor count")
      return
    }

    if (numericFloorCount > 0) {
      setFloorDisable(true)
      toast.success("Building information saved. Now configure floors.")
    }
  }

  const handleFloor = (index: number) => {
    setSelectedFloor(index)
    setPlotNo(0)
    setCommercialCount(0)
    setResidentialCount(0)
    setCommercialUnits([])
    setResidentialUnits([])
    setSelectedUnit(null)
  }

  const handlePlotCountChange = (e: any) => {
    const plotNumber = Number.parseInt(e.target.value) || 0
    setPlotNo(plotNumber)
  }

  const validateUnitCount = (
    newCount: number,
    existingCount: number,
    maxCount: number,
    setCount: (value: number) => void,
    setUnits: (units: Unit[]) => void,
    type: "Commercial" | "Residential",
  ) => {
    if (newCount + existingCount > maxCount) {
      toast.error(`The total number of Commercial and Residential units cannot exceed ${maxCount}.`)
      setCount(0)
    } else {
      setCount(newCount)
      const emptyUnits = Array.from({ length: newCount }, (_, i) => ({
        length: 0,
        breadth: 0,
        height: 0,
        owner_name: "",
        property_no: "",
        index: i,
        type: type,
      }))
      setUnits(emptyUnits)
    }
  }

  const generateBoxes = (count: number) => {
    return Array.from({ length: count }, (_, index) => index + 1)
  }

  const handleUnitClick = (type: "Commercial" | "Residential", index: number) => {
    if (type === "Commercial") {
      if (!commercialUnits[index]) {
        const updatedUnits = [...commercialUnits]
        updatedUnits[index] = {
          length: 0,
          breadth: 0,
          height: 0,
          owner_name: "",
          property_no: "",
          index: index,
          type: "Commercial",
        }
        setCommercialUnits(updatedUnits)
      }
    } else if (type === "Residential") {
      if (!residentialUnits[index]) {
        const updatedUnits = [...residentialUnits]
        updatedUnits[index] = {
          length: 0,
          breadth: 0,
          height: 0,
           owner_name: "",
          property_no: "",
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

  const processFloorData = () => {
    const allCommercialUnits = commercialUnits.filter(
      (unit) => unit && unit.length && unit.breadth && unit.height && unit.owner_name && unit.property_no,
    )

    const allResidentialUnits = residentialUnits.filter(
      (unit) => unit && unit.length && unit.breadth && unit.height && unit.owner_name && unit.property_no,
    )

    const floorName =
      selectedFloor === null ? "Unknown Floor" : selectedFloor === 0 ? "Basement" : `Floor ${selectedFloor - 1}`

    const floorData = {
      floor: floorName,
      plotCount: allCommercialUnits.length + allResidentialUnits.length,
      details: [
        ...allCommercialUnits.map((unit, index) => ({
          index: index + 1,
          type: "Commercial",
          length: String(unit.length || "Not Provided"),
          breadth: String(unit.breadth || "Not Provided"),
          height: String(unit.height || "Not Provided"),
          owner_name: unit.owner_name || `Commercial Unit ${index + 1}`,
          property_no: unit.property_no || "Unknown Property",
          type_of_plot: "Commercial",
        })),
        ...allResidentialUnits.map((unit, index) => ({
          index: allCommercialUnits.length + index + 1,
          type: "Residential",
          length: String(unit.length || "Not Provided"),
          breadth: String(unit.breadth || "Not Provided"),
          height: String(unit.height || "Not Provided"),
          owner_name: unit.owner_name || `Residential Unit ${index + 1}`,
          property_no: unit.property_no || "Unknown Property",
          type_of_plot: "Residential",
        })),
      ],
    }

    return [floorData]
  }

  const handleSaveFloorData = () => {
    const floorData = processFloorData()

    if (floorData[0].details.length === 0) {
      toast.error("Please fill at least one unit's complete details before saving")
      return
    }

    setSavedFloors((prevFloors) => {
      const filteredFloors = prevFloors.filter((floor) => floor.floor !== floorData[0].floor)
      return [...filteredFloors, ...floorData]
    })

    toast.success(`Floor Details Saved Successfully - ${floorData[0].details.length} units saved`)
  }

  const handleFinancialYearChange = (value: string) => {
    setFinancialYear(value)
    setFormData((prev) => ({
      ...prev,
      financial_year: value,
    }))

    const [start, end] = value.split("-")
    setStartYear(start)
    setEndYear(end)
  }

  return (
    <div className=" max-h-[110vh] overflow-y-auto pr-2 ">
      <div className="flex items-center space-x-3 mb-6">
        <Building className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Building Details Registration</h2>
      </div>

      <form className="space-y-8">
        {/* Basic Building Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span>Building Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contractorName">Name of Contractor</Label>
              <Select onValueChange={(value) => handleInputChange("contractor_name", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contractor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contractor1">ABC Construction Ltd.</SelectItem>
                  <SelectItem value="contractor2">XYZ Builders</SelectItem>
                  <SelectItem value="contractor3">Municipal Works Dept.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roadName">Road Name / Street *</Label>
              <Input
                id="roadName"
                placeholder="Enter road/street name"
                value={formData.road_name}
                onChange={(e) => handleInputChange("road_name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roadType">Road Type *</Label>
              <Select onValueChange={(value) => handleInputChange("road_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select road type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EARTHEN">Earthen</SelectItem>
                  <SelectItem value="TAR">Tar</SelectItem>
                  <SelectItem value="CONCRETE">Concrete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="head">Head</Label>
              <Input
                id="head"
                placeholder="Enter head"
                value={formData.head}
                onChange={(e) => handleInputChange("head", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="acquisitionDate">Date of Acquisition/Construction *</Label>
              <Input
                id="acquisitionDate"
                type="date"
                value={formData.date_of_acquisition}
                onChange={(e) => handleInputChange("date_of_acquisition", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costOfAcquisition">Cost of Acquisition *</Label>
              <Input
                id="costOfAcquisition"
                type="number"
                placeholder="Enter cost"
                value={formData.cost_of_acquisition}
                onChange={(e) => handleInputChange("cost_of_acquisition", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentLandId">Parent Land Id</Label>
              <Input
                id="parentLandId"
                type="number"
                placeholder="Enter parent land id"
                value={formData.parent_land_id}
                onChange={(e) => handleInputChange("parent_land_id", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="OwnershipType">Ownership Type *</Label>
              <Select onValueChange={(value) => handleInputChange("ownership_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Ownership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREEHOLD">Freehold</SelectItem>
                  <SelectItem value="LEASEHOLD">Leasehold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-green-600" />
              <span>Document Uploads</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ownershipDoc">Ownership Document *</Label>
              <Input
                id="ownershipDoc"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, "ownership")}
              />
              {ownershipFile && <p className="text-sm text-green-600 mt-2">✓ {ownershipFile.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="blueprint">Blueprint / Layout Plan</Label>
              <Input
                id="blueprint"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, "blueprint")}
              />
              {blueprintFile && <p className="text-sm text-green-600 mt-2">✓ {blueprintFile.name}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Building Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-blue-600" />
                <span>Building Configuration</span>
              </div>
              <Button type="button" onClick={handleOpenBuildingConfig} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Configure Building
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savedFloors.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{buildingName || "N/A"}</div>
                    <div className="text-sm text-gray-600">Building Name</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{floorCount || 0}</div>
                    <div className="text-sm text-gray-600">Total Floors</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {savedFloors.reduce((sum, floor) => sum + (floor.plotCount || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Units</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{savedFloors.length}</div>
                    <div className="text-sm text-gray-600">Configured Floors</div>
                  </div>
                </div>
                <Button type="button" variant="outline" onClick={() => setShowDataModal(true)} className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View Configuration Details
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No building configuration set up yet.</p>
                <p className="text-sm">Click &#34;Configure Building&#34; to set up floors and units.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Depreciation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span>Depreciation Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="financialYear">Financial Year*</Label>
              <Select onValueChange={handleFinancialYearChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select financial year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wdvStart">WDV as on start of FY {startYear && `(${startYear}-04-01)`}</Label>
              <Input
                id="wdvStart"
                type="number"
                placeholder="Enter WDV"
                value={formData.wdv_start}
                onChange={(e) => handleInputChange("wdv_start", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addition">Addition During {financialYear || "____"}</Label>
              <Input
                id="addition"
                type="number"
                placeholder="Enter addition"
                value={formData.addition_during_year}
                onChange={(e) => handleInputChange("addition_during_year", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accumulatedDepreciation">Accumulated Depreciation till {startYear || "____"}</Label>
              <Input
                id="accumulatedDepreciation"
                type="number"
                placeholder="Enter depreciation"
                value={formData.accumulated_depreciation}
                onChange={(e) => handleInputChange("accumulated_depreciation", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depreciation">Depreciation in {financialYear || "____"}</Label>
              <Input
                id="depreciation"
                type="number"
                placeholder="Enter depreciation"
                value={formData.depreciation_for_year}
                onChange={(e) => handleInputChange("depreciation_for_year", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wdvEnd">WDV as on end of FY {endYear && `(${endYear}-03-31)`}</Label>
              <Input
                id="wdvEnd"
                type="number"
                placeholder="Auto-calculated"
                value={formData.wdv_end}
                onChange={(e) => handleInputChange("wdv_end", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmitForReview}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </form>

      {/* Building Configuration Modal */}
      {showBuildingConfig && (
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
                  onClick={() => setShowDataModal(true)}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Data</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseBuildingConfig}
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
                          onChange={(e) => setBuildingName(e.target.value)}
                          placeholder="Enter building name"
                          disabled={floorDisable}
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
                          onChange={(e) => {
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
                      onClick={handleSaveBuildingInfo}
                      disabled={floorDisable}
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
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
                              {isSaved && <Check className="h-4 w-4 absolute top-1 right-1 text-green-600" />}
                              <span className="font-bold text-lg">{index === 0 ? "B" : (index - 1).toString()}</span>
                              <span className="text-xs">{index === 0 ? "Basement" : `Floor ${index - 1}`}</span>
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
                          value={plotNo || ""}
                          onChange={handlePlotCountChange}
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
                              onChange={(e) => {
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
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="residentialUnits">Residential Units</Label>
                            <Input
                              id="residentialUnits"
                              type="number"
                              placeholder="Number of Residential units"
                              onChange={(e) => {
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
                            />
                          </div>
                        </div>
                      )}

                      {/* Unit Selection */}
                      {(commercialCount > 0 || residentialCount > 0) && (
                        <div className="space-y-6">
                          {commercialCount > 0 && (
                            <div>
                              <h4 className="text-lg font-semibold text-blue-600 mb-3">Commercial Units</h4>
                              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                                {generateBoxes(commercialCount).map((num) => {
                                  const unit = commercialUnits[num - 1]
                                  const isComplete =
                                    unit?.length && unit?.breadth && unit?.height && unit?.owner_name && unit?.property_no

                                  return (
                                    <Button
                                      key={num}
                                      variant={
                                        selectedUnit?.type === "Commercial" && selectedUnit?.index === num - 1
                                          ? "default"
                                          : "outline"
                                      }
                                      className={`h-12 ${
                                        isComplete
                                          ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                                          : selectedUnit?.type === "Commercial" && selectedUnit?.index === num - 1
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
                              <h4 className="text-lg font-semibold text-green-600 mb-3">Residential Units</h4>
                              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                                {generateBoxes(residentialCount).map((num) => {
                                  const unit = residentialUnits[num - 1]
                                  const isComplete =
                                    unit?.length && unit?.breadth && unit?.height && unit?.owner_name && unit?.property_no

                                  return (
                                    <Button
                                      key={num}
                                      variant={
                                        selectedUnit?.type === "Residential" && selectedUnit?.index === num - 1
                                          ? "default"
                                          : "outline"
                                      }
                                      className={`h-12 ${
                                        isComplete
                                          ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                                          : selectedUnit?.type === "Residential" && selectedUnit?.index === num - 1
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
                                  onChange={(e) => handleUnitDetailsChange(e, "length")}
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
                                  onChange={(e) => handleUnitDetailsChange(e, "breadth")}
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
                                  onChange={(e) => handleUnitDetailsChange(e, "height")}
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
                                      ? commercialUnits[selectedUnit.index]?.owner_name || ""
                                      : residentialUnits[selectedUnit.index]?.owner_name || ""
                                  }
                                  onChange={(e) => handleUnitDetailsChange(e, "owner_name")}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="propertyName">Property No*</Label>
                                <Input
                                  id="propertyNo"
                                  placeholder="Property No."
                                  value={
                                    selectedUnit.type === "Commercial"
                                      ? commercialUnits[selectedUnit.index]?.property_no || ""
                                      : residentialUnits[selectedUnit.index]?.property_no || ""
                                  }
                                  onChange={(e) => handleUnitDetailsChange(e, "property_no")}
                                />
                              </div>
                            </div>
                            <div className="flex justify-center pt-4">
                              <Button onClick={handleSaveFloorData} className="px-8 py-3 bg-blue-600 hover:bg-blue-700">
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
                                    (u) => u?.length && u?.breadth && u?.height && u?.owner_name && u?.property_no,
                                  ).length
                                }
                              </div>
                              <div className="text-sm text-gray-600">Completed</div>
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
      {showDataModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-2xl font-bold text-gray-900">Building Configuration Details</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowDataModal(false)}>
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
                  {savedFloors.map((floor: any, idx) => (
                    <Card key={idx} className="border-green-300 bg-green-50">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-green-800">{floor.floor}</span>
                          <Badge className="bg-green-100 text-green-800">{floor.details.length} Units</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {floor.details.map((detail: any, detailIdx: any) => (
                            <Card key={detailIdx} className="bg-white border-green-200">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                  {detail.type} Unit {detail.index}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div className="grid grid-cols-2 gap-2 text-sm">
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
                                    <strong>Owner Name:</strong> {detail.owner_name}
                                  </p>
                                  <p className="col-span-2">
                                    <strong>Property No. :</strong> {detail.property_no}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
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
    </div>
  )
}
