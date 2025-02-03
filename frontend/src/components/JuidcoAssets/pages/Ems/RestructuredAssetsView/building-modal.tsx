/* eslint-disable react/react-in-jsx-scope */
"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import DataModal from "./data-modal"

interface UnitDetail {
  type: string
  length?: string
  breadth?: string
  height?: string
  name?: string
  property_name?: string
  index?: number
}

interface FloorData {
  floor: string | number
  plotCount: number
  details: UnitDetail[]
}

interface BuildingModalProps {
  isModalVisible: boolean
  onClose: () => void
  Home3: any
  values: any
  handleDataModal: () => void
  onSave?: (data: { buildingName: string; floors: FloorData[] }) => void
  onSaveEdit?: (data: FloorData) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFloorData:any
}

export default function BuildingModal({
  isModalVisible,
  onClose,
  values,
  // handleDataModal,
  onSave,
  // onSaveEdit,
  setFloorData
}: BuildingModalProps) {
  // Basic building info
  const [buildingName, setBuildingName] = useState("")
  const [floorCount, setFloorCount] = useState("")
  const [floorDisable, setFloorDisable] = useState(false)

  // Floor and plot management
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [plotNos, setPlotNos] = useState<{ [key: number]: string }>({})
  const [plotNo, setPlotNo] = useState(0)

  // Unit management
  const [commercialCount, setCommercialCount] = useState("")
  const [residentialCount, setResidentialCount] = useState("")
  const [commercialUnits, setCommercialUnits] = useState<UnitDetail[]>([])
  const [residentialUnits, setResidentialUnits] = useState<UnitDetail[]>([])
  const [selectedUnit, setSelectedUnit] = useState<{ type: string; index: number } | null>(null)

  // Saved data
  const [savedFloors, setSavedFloors] = useState<FloorData[]>([])
  const [data, setData] = useState<any[]>([])
console.log('data',data)
  // Add with other state declarations at the top
  const [isDataModalVisible, setIsDataModalVisible] = useState(false)

  const handleSave = (value: boolean) => {
    if (!buildingName && !floorCount) {
      toast.error("Building Name & Floor Cannot be Empty")
      return false
    }
    if (!buildingName) {
      toast.error("Building Name Cannot be Empty")
      return false
    }
    if (!floorCount) {
      toast.error("Floor Cannot be Empty")
      return false
    }

    const numericFloorCount = Number(floorCount)
    if (isNaN(numericFloorCount) || numericFloorCount < 0) {
      toast.error("Invalid floor count")
      return false
    }

    setFloorDisable(true)

    if (value) {
      handleTypeBox(numericFloorCount, "Residential", 0)
      handleTypeBox(numericFloorCount, "Commercial", 0)
    }

    return true
  }

  const handleFloor = (index: number) => {
    setSelectedFloor(index)
    // Reset fields when changing floor
    setPlotNo(0)
    setCommercialCount("")
    setResidentialCount("")
    setCommercialUnits([])
    setResidentialUnits([])
    setSelectedUnit(null)
  }

  const handleTypeBox = (count: number, type: string, index: number | null) => {
    if (isNaN(count)) return

    setData((prevData) => {
      const updatedData = [...prevData]
      if (index !== null && index >= 0 && index < updatedData.length) {
        const floorObj = updatedData[index] || {}
        floorObj.units = floorObj.units || {}
        floorObj.units[type] = Array(count)
          .fill({})
          .map((_, unitIndex) => ({
            index: unitIndex + 1,
            type,
          }))
        updatedData[index] = floorObj
      }
      return updatedData
    })
  }

  const handlePlotCountChange = (e: React.ChangeEvent<HTMLInputElement>, floor: number) => {
    const value = e.target.value
    setPlotNos({ ...plotNos, [floor]: value })
    setPlotNo(Number.parseInt(value) || 0)
  }

  const validateUnitCount = (
    newCount: number,
    otherCount: string,
    totalPlots: number,
    setCount: (value: string) => void,
    setUnits: (units: UnitDetail[]) => void,
    type: string,
  ) => {
    const otherCountNum = Number.parseInt(otherCount) || 0
    if (newCount + otherCountNum <= totalPlots) {
      setCount(newCount.toString())
      setUnits(Array(newCount).fill({ type }))
    } else {
      toast.error(`Total units cannot exceed ${totalPlots}`)
    }
  }

  const generateBoxes = (count: string) => {
    return Array.from({ length: Number.parseInt(count) || 0 }, (_, i) => i + 1)
  }

  const handleUnitClick = (type: string, index: number) => {
    setSelectedUnit({ type, index })
  }

  const handleUnitDetailsChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!selectedUnit) return

    const { type, index } = selectedUnit
    const units = type === "Commercial" ? [...commercialUnits] : [...residentialUnits]
    units[index] = { ...units[index], [field]: e.target.value }

    if (type === "Commercial") {
      setCommercialUnits(units)
    } else {
      setResidentialUnits(units)
    }
  }

  // const validateUnitDetails = (units: UnitDetail[]) => {
  //   return units.every((unit) => unit.length && unit.breadth && unit.height && unit.name && unit.property_name)
  // }

  const handleSaveFloorData = () => {
    if (selectedFloor === null) return

    // Validate all units have complete data
    const allUnits = [...commercialUnits, ...residentialUnits]
    // if (!validateUnitDetails(allUnits)) {
    //   toast.error("Please fill in all unit details")
    //   return
    // }

    const floorData: FloorData = {
      floor: selectedFloor === 0 ? "B" : selectedFloor - 1,
      plotCount: plotNo,
      details: allUnits,
    }

    setSavedFloors((prev) => [...prev, floorData])
    setFloorData((prev:any) => (Array.isArray(prev) ? [...prev, floorData] : [floorData]));

    // Reset fields after saving
    setSelectedFloor(null)
    setPlotNo(0)
    setCommercialCount("")
    setResidentialCount("")
    setCommercialUnits([])
    setResidentialUnits([])
    setSelectedUnit(null)

    toast.success("Floor data saved successfully")

    // Call onSave callback if provided
    onSave?.({ buildingName, floors: [...savedFloors, floorData] })
  }

  const handleCloseDataModal = () => {
    setIsDataModalVisible(false)
  }

  const handleSaveEdit = (editedFloor: FloorData) => {
    const newSavedFloors = [...savedFloors]
    const index = newSavedFloors.findIndex((floor) => floor.floor === editedFloor.floor)
    if (index !== -1) {
      newSavedFloors[index] = editedFloor
      setSavedFloors(newSavedFloors)
    }
  }

  if (!isModalVisible || values?.type_of_assets !== "Building") return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="bg-slate-100 p-6 rounded-lg shadow-md w-[70rem] max-h-[80vh] overflow-auto z-20">
        {/* Modal Header */}
        <div className="mb-[3rem] flex justify-end items-center">
          <button
            onClick={() => setIsDataModalVisible(true)}
            className="bg-[#4338CA] text-white px-4 py-2 rounded-xl mr-4 hover:bg-[#4338CA]/90 transition-colors"
          >
            View Data
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 text-white w-[3rem] p-2 rounded-xl hover:bg-red-700 transition-colors"
          >
            X
          </button>
        </div>

        {/* Building Form */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              placeholder="Building Name"
              className="border p-2 rounded focus:ring-2 focus:ring-[#4338CA] focus:border-transparent transition-all"
              disabled={floorDisable}
            />
            <input
              type="number"
              value={floorCount}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value)
                if (!isNaN(value) && value >= 1 && value <= 10) {
                  setFloorCount(value.toString())
                } else if (e.target.value === "") {
                  setFloorCount("")
                }
              }}
              placeholder="Number of Floors"
              className="border p-2 rounded w-40 focus:ring-2 focus:ring-[#4338CA] focus:border-transparent transition-all"
              disabled={floorDisable}
              min={1}
              max={10}
            />
            <button
              onClick={() => handleSave(false)}
              className="bg-[#4338CA] text-white px-4 py-2 rounded hover:bg-[#4338CA]/90 transition-colors disabled:opacity-50"
              disabled={floorDisable}
            >
              Add Floor
            </button>
          </div>

          {/* Floor Selection */}
          {floorDisable && (
            <div className="flex flex-row gap-2">
              {Array.from({ length: Math.max(Number(floorCount), 0) + 2 }, (_, index) => {
                const savedFloorNumbers = savedFloors.map((floor) => {
                  const floorNum = floor.floor
                  return typeof floorNum === "number" ? floorNum : Number.parseInt(floorNum)
                })

                const isSaved = savedFloorNumbers.includes(index - 1)

                return (
                  <button
                    key={index}
                    className={`
                      w-12 h-12 rounded-md text-white transition-all
                      ${isSaved ? "bg-green-600 cursor-not-allowed" : "bg-[#4338CA] hover:bg-[#4338CA]/90"}
                      ${selectedFloor === index ? "ring-2 ring-offset-2 ring-[#4338CA]" : ""}
                    `}
                    onClick={() => !isSaved && handleFloor(index)}
                    disabled={isSaved}
                  >
                    {index === 0 ? "B" : (index - 1).toString()}
                  </button>
                )
              })}
            </div>
          )}

          {/* Plot Count Input */}
          {selectedFloor !== null && (
            <div className="flex items-center gap-4">
              <label className="font-semibold">{selectedFloor === 0 ? "Basement" : `Floor ${selectedFloor - 1}`}</label>
              <input
                type="text"
                className="border p-2 rounded focus:ring-2 focus:ring-[#4338CA] focus:border-transparent transition-all"
                placeholder={`No of shop/flat on the floor ${selectedFloor === 0 ? "B" : selectedFloor - 1}`}
                value={plotNos[selectedFloor] || ""}
                onChange={(e) => handlePlotCountChange(e, selectedFloor)}
                maxLength={3}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
              />
            </div>
          )}

          {/* Unit Type Selection */}
          {plotNo > 0 && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div>
                  <input
                    type="text"
                    className="border p-2 rounded focus:ring-2 focus:ring-[#4338CA] focus:border-transparent transition-all"
                    placeholder="Number of Commercial units"
                    value={commercialCount}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value) || 0
                      validateUnitCount(
                        value,
                        residentialCount,
                        plotNo,
                        setCommercialCount,
                        setCommercialUnits,
                        "Commercial",
                      )
                    }}
                    maxLength={2}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  <label className="ml-2">Commercial</label>
                </div>

                <div>
                  <input
                    type="text"
                    className="border p-2 rounded focus:ring-2 focus:ring-[#4338CA] focus:border-transparent transition-all"
                    placeholder="Number of Residential units"
                    value={residentialCount}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value) || 0
                      validateUnitCount(
                        value,
                        commercialCount,
                        plotNo,
                        setResidentialCount,
                        setResidentialUnits,
                        "Residential",
                      )
                    }}
                    maxLength={2}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  <label className="ml-2">Residential</label>
                </div>
              </div>

              {/* Unit Selection */}
              <div className="space-y-4">
                <h4 className="text-sm text-[#4338CA] font-semibold">Commercial Units:</h4>
                <div className="flex gap-2 flex-wrap">
                  {generateBoxes(commercialCount).map((num) => (
                    <button
                      key={num}
                      onClick={() => handleUnitClick("Commercial", num - 1)}
                      className={`
                        w-10 h-10 rounded border border-[#4338CA] transition-all
                        ${
                          selectedUnit?.type === "Commercial" && selectedUnit?.index === num - 1
                            ? "bg-[#4338CA] text-white"
                            : "text-[#4338CA] hover:bg-[#4338CA]/10"
                        }
                      `}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <h4 className="text-sm text-[#4338CA] font-semibold">Residential Units:</h4>
                <div className="flex gap-2 flex-wrap">
                  {generateBoxes(residentialCount).map((num) => (
                    <button
                      key={num}
                      onClick={() => handleUnitClick("Residential", num - 1)}
                      className={`
                        w-10 h-10 rounded border border-[#4338CA] transition-all
                        ${
                          selectedUnit?.type === "Residential" && selectedUnit?.index === num - 1
                            ? "bg-[#4338CA] text-white"
                            : "text-[#4338CA] hover:bg-[#4338CA]/10"
                        }
                      `}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Unit Details Form */}
          {selectedUnit && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold">
                {selectedUnit.type} Unit {selectedUnit.index + 1} Details:
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  className="border p-2 rounded focus:ring-2 focus:ring-[#4338CA] focus:border-transparent transition-all"
                  placeholder="Length in meters"
                  value={
                    selectedUnit.type === "Commercial"
                      ? commercialUnits[selectedUnit.index]?.length || ""
                      : residentialUnits[selectedUnit.index]?.length || ""
                  }
                  onChange={(e) => handleUnitDetailsChange(e, "length")}
                />
                <input
                  type="number"
                  className="border p-2 rounded focus:ring-2 focus:ring-[#4338CA] focus:border-transparent transition-all"
                  placeholder="Breadth in meters"
                  value={
                    selectedUnit.type === "Commercial"
                      ? commercialUnits[selectedUnit.index]?.breadth || ""
                      : residentialUnits[selectedUnit.index]?.breadth || ""
                  }
                  onChange={(e) => handleUnitDetailsChange(e, "breadth")}
                />
                <input
                  type="number"
                  className="border p-2 rounded focus:ring-2 focus:ring-[#4338CA] focus:border-transparent transition-all"
                  placeholder="Height in meters"
                  value={
                    selectedUnit.type === "Commercial"
                      ? commercialUnits[selectedUnit.index]?.height || ""
                      : residentialUnits[selectedUnit.index]?.height || ""
                  }
                  onChange={(e) => handleUnitDetailsChange(e, "height")}
                />
                <input
                  type="text"
                  className="border p-2 rounded focus:ring-2 focus:ring-[#4338CA] focus:border-transparent transition-all"
                  placeholder="Owner Name"
                  value={
                    selectedUnit.type === "Commercial"
                      ? commercialUnits[selectedUnit.index]?.name || ""
                      : residentialUnits[selectedUnit.index]?.name || ""
                  }
                  onChange={(e) => handleUnitDetailsChange(e, "name")}
                />
                <input
                  type="text"
                  className="border p-2 rounded focus:ring-2 focus:ring-[#4338CA] focus:border-transparent transition-all"
                  placeholder="Property Name"
                  value={
                    selectedUnit.type === "Commercial"
                      ? commercialUnits[selectedUnit.index]?.property_name || ""
                      : residentialUnits[selectedUnit.index]?.property_name || ""
                  }
                  onChange={(e) => handleUnitDetailsChange(e, "property_name")}
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleSaveFloorData}
                  className="bg-[#4338CA] text-white px-6 py-3 rounded-xl text-sm w-[15rem] hover:bg-[#4338CA]/90 transition-colors"
                >
                  Save & Move to Next Step
                </button>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="border-t pt-4">
            <h3 className="text-sm text-[#4338CA] font-bold">Entered Data:</h3>
            <h4 className="text-sm text-[#4338CA] font-semibold">
              Total Floor: <span className="font-normal">{floorCount || 0}</span>
            </h4>
            <h4 className="text-sm text-[#4338CA] font-semibold">
              Total Shop/Flat: <span className="font-normal">{plotNo || 0}</span>
            </h4>
          </div>
        </div>
      </div>
      {
        isDataModalVisible &&

        <DataModal
                isVisible={isDataModalVisible}
                onClose={handleCloseDataModal}
                savedFloors={savedFloors}
                selectedFloor={selectedFloor}
                onSaveEdit={handleSaveEdit}
              />
      }

      
    </div>
  )
}

