/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
"use client"

import { useState } from "react"
import { X,  } from "lucide-react"
import Image from "next/image"
import Input from "@/components/global/atoms/Input"
import Card from "@mui/material/Card/Card"
// import CardHeader from "@mui/material/CardHeader/CardHeader"
// import { Button } from "/components/ui/button"
// import { Card, CardHeader, CardTitle } from "/components/ui/card"

interface FloorDetail {
  type: string
  length: string
  breadth: string
  height: string
  name: string
  property_name: string
  type_of_plot?: string
  index?: number
}

interface Floor {
  floor: string | number
  plotCount: number
  details: FloorDetail[]
}

interface DataModalProps {
  isVisible: boolean
  onClose: () => void
  savedFloors: Floor[]
  selectedFloor: number | null
  onSaveEdit: (editedFloor: Floor) => void
  Home3?: string
}

export default function DataModal({
  isVisible,
  onClose,
  savedFloors,
  // selectedFloor,
  onSaveEdit,
  Home3,
}: DataModalProps) {
  const [editedFloorIndex, setEditedFloorIndex] = useState<number | null>(null)
  const [editedDetails, setEditedDetails] = useState<FloorDetail[]>([])

  const handleEditFloor = (floor: Floor, index: number) => {
    setEditedFloorIndex(index)
    setEditedDetails([...floor.details])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, detailIndex: number, field: keyof FloorDetail) => {
    const newDetails = [...editedDetails]
    newDetails[detailIndex] = {
      ...newDetails[detailIndex],
      [field]: e.target.value,
    }
    setEditedDetails(newDetails)
  }

  const handleSave = () => {
    if (editedFloorIndex === null) return

    const editedFloor = {
      ...savedFloors[editedFloorIndex],
      details: editedDetails,
    }

    onSaveEdit(editedFloor)
    setEditedFloorIndex(null)
    setEditedDetails([])
  }

  if (!isVisible) return null

  console.log("savedFloors",savedFloors)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-7xl w-full h-[90vh] shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div className="flex items-center">
            <Image src={Home3 || "/placeholder.svg"} alt="building" width={40} height={20} />
            <h3 className="text-2xl font-semibold text-[#4338CA] ml-3">Floor Details</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          {savedFloors.map((floor, floorIndex) => (
            <div key={floorIndex} className="mb-6">
              <Card className="mb-4 py-4">
                 <div className="text-xl font-semibold text-[#4338CA]">
                    Floor {floor.floor} - Plot Count: {floor.plotCount}
                  </div>
                  </Card>
              {/* <Card className="mb-4">
                <CardHeader>asd
                  <div className="text-2xl font-semibold text-[#4338CA]">
                    Floor {floor.floor} - Plot Count: {floor.plotCount}
                  </div>
                </CardHeader>
              </Card>asd */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {floor.details.map((detail, detailIndex) => {
                  const isEditMode = editedFloorIndex === floorIndex
                  const isComplete = detail.type && detail.length && detail.breadth && detail.height && detail.name && detail.property_name

                  if (isEditMode) {
                    return (
                      <div
                        key={`${floorIndex}-${detailIndex}`}
                        className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all"
                      >
                        <div className="space-y-4">
                          <h4 className="text-xl font-semibold text-[#4338CA] border-b pb-2">Edit Details</h4>
                          <div className="space-y-3">
                            <Input
                              type="text"
                              value={editedDetails[detailIndex]?.type || ""}
                              onChange={(e) => handleInputChange(e, detailIndex, "type")}
                              placeholder="Type"
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#4338CA] focus:border-transparent"
                            />
                            <div className="bg-white/50 rounded-lg p-3 space-y-2 border-2 border-[#4338CA]/10">
                              <p className="text-lg font-semibold text-[#4338CA] border-b-2 border-[#4338CA]/30 pb-1">
                                Dimensions
                              </p>
                              <div className="grid grid-cols-3 gap-2">
                                <Input
                                  type="number"
                                  value={editedDetails[detailIndex]?.length || ""}
                                  onChange={(e) => handleInputChange(e, detailIndex, "length")}
                                  placeholder="Length"
                                  className="w-full p-2 border rounded"
                                />
                                <Input
                                  type="number"
                                  value={editedDetails[detailIndex]?.breadth || ""}
                                  onChange={(e) => handleInputChange(e, detailIndex, "breadth")}
                                  placeholder="Breadth"
                                  className="w-full p-2 border rounded"
                                />
                                <Input
                                  type="number"
                                  value={editedDetails[detailIndex]?.height || ""}
                                  onChange={(e) => handleInputChange(e, detailIndex, "height")}
                                  placeholder="Height"
                                  className="w-full p-2 border rounded"
                                />
                              </div>
                            </div>
                            <Input
                              type="text"
                              value={editedDetails[detailIndex]?.name || ""}
                              onChange={(e) => handleInputChange(e, detailIndex, "name")}
                              placeholder="Name"
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#4338CA] focus:border-transparent"
                            />
                            <Input
                              type="text"
                              value={editedDetails[detailIndex]?.property_name || ""}
                              onChange={(e) => handleInputChange(e, detailIndex, "property_name")}
                              placeholder="Property Name"
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#4338CA] focus:border-transparent"
                            />
                          </div>
                          <button
                            onClick={handleSave}
                            className="w-full bg-[#4338CA] text-white px-4 py-2 rounded-lg hover:bg-[#4338CA]/90 transition-all"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={`${floorIndex}-${detailIndex}`}
                      className={`shadow-lg rounded-xl p-6 hover:shadow-xl transition-all ${
                        isComplete ? 'border-2 border-green-200' : 'border-2 border-yellow-200'
                      }`}
                      style={isComplete ? { backgroundColor: '#dcfce7' } : { backgroundColor: '#fef9c3' }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b-2 border-[#4338CA]/30 pb-2">
                          <span className="text-lg font-bold text-[#4338CA]">Type</span>
                          <span className="text-lg font-semibold">{detail.type}</span>
                        </div>

                        <div className="flex items-center justify-between border-b-2 border-[#4338CA]/30 pb-2">
                          <span className="text-lg font-semibold text-[#4338CA]">Plot Type</span>
                          <span className="text-lg font-semibold">{detail.type_of_plot || "N/A"}</span>
                        </div>

                        <div className="flex items-center justify-between border-b-2 border-[#4338CA]/30 pb-2">
                          <span className="text-lg font-semibold text-[#4338CA]">Plot</span>
                          <span className="text-lg font-semibold">{detail.index || detailIndex + 1}</span>
                        </div>

                        <div className="bg-white/50 rounded-lg p-3 space-y-2 border-2 border-[#4338CA]/10">
                          <p className="text-lg font-semibold text-[#4338CA] border-b-2 border-[#4338CA]/30 pb-1">
                            Dimensions
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <p className="text-sm text-[#4338CA]">Length</p>
                              <p className="font-semibold">{detail.length || "Not Provided meters"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-[#4338CA]">Breadth</p>
                              <p className="font-semibold">{detail.breadth || "Not Provided meters"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-[#4338CA]">Height</p>
                              <p className="font-semibold">{detail.height || "Not Provided meters"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-lg font-semibold text-[#4338CA]">Name</span>
                          <span className="text-lg font-semibold">{detail.name || "Unnamed Unit 1"}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-lg font-semibold text-[#4338CA]">Property Name</span>
                          <span className="text-lg font-semibold">{detail.property_name || "Unknown Property"}</span>
                        </div>

                        <button
                          onClick={() => handleEditFloor(floor, floorIndex)}
                          className="w-full mt-4 bg-[#4338CA] text-white px-4 py-2 rounded-lg hover:bg-[#4338CA]/90 transition-all"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}