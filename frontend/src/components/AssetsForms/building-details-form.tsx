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
import { Building, DollarSign, Save, Send, Plus, Check, Edit3, Eye, X } from "lucide-react"
import { toast } from "react-hot-toast"

interface Unit {
  index: number
  type: "Commercial" | "Residential"
  length?: number
  breadth?: number
  height?: number
  name?: string
  property_name?: string
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
  const [plotNos, setPlotNos] = useState<Array<number | string>>([])
  const [showDataModal, setShowDataModal] = useState(false)

  const handleSaveDraft = () => {
    toast.success("Building Details form saved as draft")
  }

  const handleSubmitForReview = () => {
    toast.success("Building Details form submitted for review")
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
        name: "",
        property_name: "",
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
          length: 0,
          breadth: 0,
          height: 0,
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

  const processFloorData = () => {
    const allCommercialUnits = commercialUnits.filter(
      (unit) => unit && unit.length && unit.breadth && unit.height && unit.name && unit.property_name,
    )

    const allResidentialUnits = residentialUnits.filter(
      (unit) => unit && unit.length && unit.breadth && unit.height && unit.name && unit.property_name,
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
          name: unit.name || `Commercial Unit ${index + 1}`,
          property_name: unit.property_name || "Unknown Property",
          type_of_plot: "Commercial",
        })),
        ...allResidentialUnits.map((unit, index) => ({
          index: allCommercialUnits.length + index + 1,
          type: "Residential",
          length: String(unit.length || "Not Provided"),
          breadth: String(unit.breadth || "Not Provided"),
          height: String(unit.height || "Not Provided"),
          name: unit.name || `Residential Unit ${index + 1}`,
          property_name: unit.property_name || "Unknown Property",
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

  return (
    <div className="space-y-8">
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
              <Select>
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
              <Input id="roadName" placeholder="Enter road/street name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roadType">Road Type *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select road type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="earthen">Earthen</SelectItem>
                  <SelectItem value="tar">Tar</SelectItem>
                  <SelectItem value="concrete">Concrete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="head">Head</Label>
              <Input id="head" placeholder="Enter head" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="acquisitionDate">Date of Acquisition/Construction *</Label>
              <Input id="acquisitionDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costOfAcquisition">Cost of Acquisition *</Label>
              <Input id="costOfAcquisition" type="number" placeholder="Enter cost" />
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
                <p className="text-sm">Click "Configure Building" to set up floors and units.</p>
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
              <Label htmlFor="wdv20240401">WDV as on 01/04/2024</Label>
              <Input id="wdv20240401" type="number" placeholder="Enter WDV" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addition202425">Addition During 2024-25</Label>
              <Input id="addition202425" type="number" placeholder="Enter addition" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accumulatedDepreciation">Accumulated Depreciation till 2024</Label>
              <Input id="accumulatedDepreciation" type="number" placeholder="Enter depreciation" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depreciation202425">Depreciation 2024-25</Label>
              <Input id="depreciation202425" type="number" placeholder="Enter depreciation" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wdv20250331">WDV as on 31/03/2025</Label>
              <Input id="wdv20250331" type="number" placeholder="Auto-calculated" disabled className="bg-gray-100" />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button type="submit" onClick={handleSubmitForReview} className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
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
                    <Button onClick={handleSaveBuildingInfo} disabled={floorDisable} className="w-full md:w-auto">
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
                                    unit?.length && unit?.breadth && unit?.height && unit?.name && unit?.property_name

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
                                    unit?.length && unit?.breadth && unit?.height && unit?.name && unit?.property_name

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
                                      ? commercialUnits[selectedUnit.index]?.name || ""
                                      : residentialUnits[selectedUnit.index]?.name || ""
                                  }
                                  onChange={(e) => handleUnitDetailsChange(e, "name")}
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
                                  onChange={(e) => handleUnitDetailsChange(e, "property_name")}
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
                                    (u) => u?.length && u?.breadth && u?.height && u?.name && u?.property_name,
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
                                    <strong>Owner:</strong> {detail.name}
                                  </p>
                                  <p className="col-span-2">
                                    <strong>Property:</strong> {detail.property_name}
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
