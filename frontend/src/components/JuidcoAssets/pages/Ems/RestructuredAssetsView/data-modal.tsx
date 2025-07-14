// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Separator } from "@/components/ui/separator"
// import { Edit, Save, Building, Ruler } from "lucide-react"

// interface FloorDetail {
//   type: string
//   length: string
//   breadth: string
//   height: string
//   name: string
//   property_name: string
//   type_of_plot?: string
//   index?: number
// }

// interface Floor {
//   floor: string | number
//   plotCount: number
//   details: FloorDetail[]
// }

// interface DataModalProps {
//   isVisible: boolean
//   onClose: () => void
//   savedFloors: Floor[]
//   selectedFloor: number | null
//   onSaveEdit: (editedFloor: Floor) => void
//   Home3?: string
// }

// export default function DataModal({ isVisible, onClose, savedFloors, onSaveEdit }: DataModalProps) {
//   const [editedFloorIndex, setEditedFloorIndex] = useState<number | null>(null)
//   const [editedDetails, setEditedDetails] = useState<FloorDetail[]>([])

//   const handleEditFloor = (floor: Floor, index: number) => {
//     setEditedFloorIndex(index)
//     setEditedDetails([...floor.details])
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, detailIndex: number, field: keyof FloorDetail) => {
//     const newDetails = [...editedDetails]
//     newDetails[detailIndex] = {
//       ...newDetails[detailIndex],
//       [field]: e.target.value,
//     }
//     setEditedDetails(newDetails)
//   }

//   const handleSave = () => {
//     if (editedFloorIndex === null) return

//     const editedFloor = {
//       ...savedFloors[editedFloorIndex],
//       details: editedDetails,
//     }

//     onSaveEdit(editedFloor)
//     setEditedFloorIndex(null)
//     setEditedDetails([])
//   }

//   const getFloorDisplayName = (floor: string | number) => {
//     return floor === "B" || floor === 0 ? "Basement" : `Floor ${floor}`
//   }

//   const isUnitComplete = (detail: FloorDetail) => {
//     return detail.type && detail.length && detail.breadth && detail.height && detail.name && detail.property_name
//   }

//   if (!isVisible) return null

//   return (
//     <Dialog open={isVisible} onOpenChange={onClose}>
//       <DialogContent className="max-w-7xl max-h-[90vh] bg-white text-gray-800">
//         <DialogHeader>
//           <DialogTitle className="flex items-center space-x-2">
//             <Building className="w-5 h-5 text-blue-600" />
//             <span>Building Floor Details</span>
//           </DialogTitle>
//         </DialogHeader>

//         <ScrollArea className="h-[70vh] pr-4">
//           <div className="space-y-8">
//             {savedFloors.map((floor, floorIndex) => (
//               <div key={floorIndex} className="space-y-4">
//                 <Card className="border-2 border-blue-100">
//                   <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
//                     <CardTitle className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <Building className="w-5 h-5 text-blue-600" />
//                         <span className="text-blue-800">{getFloorDisplayName(floor.floor)}</span>
//                         <Badge variant="secondary" className="ml-2">
//                           {floor.plotCount} Units
//                         </Badge>
//                       </div>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleEditFloor(floor, floorIndex)}
//                         className="flex items-center space-x-1"
//                         disabled={editedFloorIndex === floorIndex}
//                       >
//                         <Edit className="w-3 h-3" />
//                         <span>Edit Floor</span>
//                       </Button>
//                     </CardTitle>
//                   </CardHeader>
//                 </Card>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                   {floor.details.map((detail, detailIndex) => {
//                     const isEditMode = editedFloorIndex === floorIndex
//                     const isComplete = isUnitComplete(detail)

//                     return (
//                       <Card
//                         key={`${floorIndex}-${detailIndex}`}
//                         className={`transition-all duration-200 hover:shadow-lg ${
//                           isComplete ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"
//                         } ${isEditMode ? "ring-2 ring-blue-500" : ""}`}
//                       >
//                         <CardHeader className="pb-3">
//                           <CardTitle className="flex items-center justify-between text-sm">
//                             <div className="flex items-center space-x-2">
//                               <Badge variant={detail.type === "Commercial" ? "default" : "secondary"}>
//                                 {detail.type}
//                               </Badge>
//                               <span className="text-gray-600">Unit {detail.index || detailIndex + 1}</span>
//                             </div>
//                             {isComplete && <Badge className="bg-green-500 text-white">Complete</Badge>}
//                           </CardTitle>
//                         </CardHeader>

//                         <CardContent className="space-y-4">
//                           {isEditMode ? (
//                             <div className="space-y-3">
//                               <div className="space-y-2">
//                                 <Label className="text-xs font-medium">Type</Label>
//                                 <Input
//                                   value={editedDetails[detailIndex]?.type || ""}
//                                   onChange={(e) => handleInputChange(e, detailIndex, "type")}
//                                   placeholder="Unit type"
//                                   className="h-8"
//                                 />
//                               </div>

//                               <div className="space-y-2">
//                                 <Label className="text-xs font-medium flex items-center space-x-1">
//                                   <Ruler className="w-3 h-3" />
//                                   <span>Dimensions</span>
//                                 </Label>
//                                 <div className="grid grid-cols-3 gap-1">
//                                   <Input
//                                     value={editedDetails[detailIndex]?.length || ""}
//                                     onChange={(e) => handleInputChange(e, detailIndex, "length")}
//                                     placeholder="L"
//                                     className="h-8 text-xs"
//                                   />
//                                   <Input
//                                     value={editedDetails[detailIndex]?.breadth || ""}
//                                     onChange={(e) => handleInputChange(e, detailIndex, "breadth")}
//                                     placeholder="W"
//                                     className="h-8 text-xs"
//                                   />
//                                   <Input
//                                     value={editedDetails[detailIndex]?.height || ""}
//                                     onChange={(e) => handleInputChange(e, detailIndex, "height")}
//                                     placeholder="H"
//                                     className="h-8 text-xs"
//                                   />
//                                 </div>
//                               </div>

//                               <div className="space-y-2">
//                                 <Label className="text-xs font-medium">Owner Name</Label>
//                                 <Input
//                                   value={editedDetails[detailIndex]?.name || ""}
//                                   onChange={(e) => handleInputChange(e, detailIndex, "name")}
//                                   placeholder="Owner name"
//                                   className="h-8"
//                                 />
//                               </div>

//                               <div className="space-y-2">
//                                 <Label className="text-xs font-medium">Property Name</Label>
//                                 <Input
//                                   value={editedDetails[detailIndex]?.property_name || ""}
//                                   onChange={(e) => handleInputChange(e, detailIndex, "property_name")}
//                                   placeholder="Property name"
//                                   className="h-8"
//                                 />
//                               </div>

//                               <Button onClick={handleSave} size="sm" className="w-full flex items-center space-x-1">
//                                 <Save className="w-3 h-3" />
//                                 <span>Save Changes</span>
//                               </Button>
//                             </div>
//                           ) : (
//                             <div className="space-y-3">
//                               <div className="space-y-2">
//                                 <div className="flex justify-between items-center">
//                                   <Label className="text-xs text-gray-500">Plot Type</Label>
//                                   <span className="text-sm font-medium">{detail.type_of_plot || "N/A"}</span>
//                                 </div>
//                                 <Separator />
//                               </div>

//                               <div className="bg-white/70 rounded-lg p-3 space-y-2">
//                                 <Label className="text-xs font-medium text-blue-600 flex items-center space-x-1">
//                                   <Ruler className="w-3 h-3" />
//                                   <span>Dimensions (m)</span>
//                                 </Label>
//                                 <div className="grid grid-cols-3 gap-2 text-xs">
//                                   <div className="text-center">
//                                     <div className="text-gray-500">Length</div>
//                                     <div className="font-semibold">{detail.length || "N/A"}</div>
//                                   </div>
//                                   <div className="text-center">
//                                     <div className="text-gray-500">Width</div>
//                                     <div className="font-semibold">{detail.breadth || "N/A"}</div>
//                                   </div>
//                                   <div className="text-center">
//                                     <div className="text-gray-500">Height</div>
//                                     <div className="font-semibold">{detail.height || "N/A"}</div>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="space-y-2">
//                                 <div className="flex justify-between items-center">
//                                   <Label className="text-xs text-gray-500">Owner</Label>
//                                   <span className="text-sm font-medium">{detail.name || "Unnamed"}</span>
//                                 </div>
//                                 <Separator />
//                                 <div className="flex justify-between items-center">
//                                   <Label className="text-xs text-gray-500">Property</Label>
//                                   <span className="text-sm font-medium">{detail.property_name || "Unknown"}</span>
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </CardContent>
//                       </Card>
//                     )
//                   })}
//                 </div>
//               </div>
//             ))}

//             {savedFloors.length === 0 && (
//               <Card className="border-2 border-dashed border-gray-300">
//                 <CardContent className="flex flex-col items-center justify-center py-12">
//                   <Building className="w-12 h-12 text-gray-400 mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">No Floor Data</h3>
//                   <p className="text-gray-500 text-center">
//                     No floor information has been saved yet. Add floors using the building modal.
//                   </p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   )
// }
