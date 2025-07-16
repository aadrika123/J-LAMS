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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
// import { toast } from "react-hot-toast"
// import { Building, Plus, Eye, Save, Home, Users, Ruler, CheckCircle, AlertCircle } from "lucide-react"
// import DataModal from "./data-modal"

// interface UnitDetail {
//   type: string
//   length?: string
//   breadth?: string
//   height?: string
//   name?: string
//   property_name?: string
//   index?: number
// }

// interface FloorData {
//   floor: string | number
//   plotCount: number
//   details: UnitDetail[]
// }

// interface BuildingModalProps {
//   isModalVisible: boolean
//   onClose: () => void
//   Home3: unknown
//   values: unknown
//   handleDataModal: () => void
//   onSave?: (data: { buildingName: string; floors: FloorData[] }) => void
//   onSaveEdit?: (data: FloorData) => void
//   setFloorData: any
// }

// export default function BuildingModal({ isModalVisible, onClose, values, onSave, setFloorData }: BuildingModalProps) {
//   // Basic building info
//   const [buildingName, setBuildingName] = useState("")
//   const [floorCount, setFloorCount] = useState("")
//   const [floorDisable, setFloorDisable] = useState(false)

//   // Floor and plot management
//   const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
//   const [plotNos, setPlotNos] = useState<{ [key: number]: string }>({})
//   const [plotNo, setPlotNo] = useState(0)

//   // Unit management
//   const [commercialCount, setCommercialCount] = useState("")
//   const [residentialCount, setResidentialCount] = useState("")
//   const [commercialUnits, setCommercialUnits] = useState<UnitDetail[]>([])
//   const [residentialUnits, setResidentialUnits] = useState<UnitDetail[]>([])
//   const [selectedUnit, setSelectedUnit] = useState<{ type: string; index: number } | null>(null)

//   // Saved data
//   const [savedFloors, setSavedFloors] = useState<FloorData[]>([])
//   const [isDataModalVisible, setIsDataModalVisible] = useState(false)

//   const handleSave = (value: boolean) => {
//     if (!buildingName && !floorCount) {
//       toast.error("Building Name & Floor Cannot be Empty")
//       return false
//     }
//     if (!buildingName) {
//       toast.error("Building Name Cannot be Empty")
//       return false
//     }
//     if (!floorCount) {
//       toast.error("Floor Cannot be Empty")
//       return false
//     }

//     const numericFloorCount = Number(floorCount)
//     if (isNaN(numericFloorCount) || numericFloorCount < 0) {
//       toast.error("Invalid floor count")
//       return false
//     }

//     setFloorDisable(true)
//     return true
//   }

//   const handleFloor = (index: number) => {
//     setSelectedFloor(index)
//     setPlotNo(0)
//     setCommercialCount("")
//     setResidentialCount("")
//     setCommercialUnits([])
//     setResidentialUnits([])
//     setSelectedUnit(null)
//   }

//   const handlePlotCountChange = (e: React.ChangeEvent<HTMLInputElement>, floor: number) => {
//     const value = e.target.value
//     setPlotNos({ ...plotNos, [floor]: value })
//     setPlotNo(Number.parseInt(value) || 0)
//   }

//   const validateUnitCount = (
//     newCount: number,
//     otherCount: string,
//     totalPlots: number,
//     setCount: (value: string) => void,
//     setUnits: (units: UnitDetail[]) => void,
//     type: string,
//   ) => {
//     const otherCountNum = Number.parseInt(otherCount) || 0
//     if (newCount + otherCountNum <= totalPlots) {
//       setCount(newCount.toString())
//       setUnits(Array(newCount).fill({ type }))
//     } else {
//       toast.error(`Total units cannot exceed ${totalPlots}`)
//     }
//   }

//   const generateBoxes = (count: string) => {
//     return Array.from({ length: Number.parseInt(count) || 0 }, (_, i) => i + 1)
//   }

//   const handleUnitClick = (type: string, index: number) => {
//     setSelectedUnit({ type, index })
//   }

//   const handleUnitDetailsChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
//     if (!selectedUnit) return

//     const { type, index } = selectedUnit
//     const units = type === "Commercial" ? [...commercialUnits] : [...residentialUnits]
//     units[index] = { ...units[index], [field]: e.target.value }

//     if (type === "Commercial") {
//       setCommercialUnits(units)
//     } else {
//       setResidentialUnits(units)
//     }
//   }

//   const handleSaveFloorData = () => {
//     if (selectedFloor === null) return

//     const allUnits = [...commercialUnits, ...residentialUnits]
//     const floorData: FloorData = {
//       floor: selectedFloor === 0 ? "B" : selectedFloor - 1,
//       plotCount: plotNo,
//       details: allUnits,
//     }

//     setSavedFloors((prev) => [...prev, floorData])
//     setFloorData((prev: any) => (Array.isArray(prev) ? [...prev, floorData] : [floorData]))

//     // Reset fields after saving
//     setSelectedFloor(null)
//     setPlotNo(0)
//     setCommercialCount("")
//     setResidentialCount("")
//     setCommercialUnits([])
//     setResidentialUnits([])
//     setSelectedUnit(null)

//     toast.success("Floor data saved successfully")
//     onSave?.({ buildingName, floors: [...savedFloors, floorData] })
//   }

//   const getFloorDisplayName = (index: number) => {
//     return index === 0 ? "Basement" : `Floor ${index - 1}`
//   }

//   const isFloorSaved = (index: number) => {
//     const savedFloorNumbers = savedFloors.map((floor) => {
//       const floorNum = floor.floor
//       return typeof floorNum === "number" ? floorNum : floorNum === "B" ? -1 : Number.parseInt(floorNum)
//     })
//     return savedFloorNumbers.includes(index - 1)
//   }

//   const getUnitDetails = (type: string, index: number) => {
//     const units = type === "Commercial" ? commercialUnits : residentialUnits
//     return units[index] || {}
//   }

//   const isUnitComplete = (type: string, index: number) => {
//     const unit = getUnitDetails(type, index)
//     return unit.length && unit.breadth && unit.height && unit.name && unit.property_name
//   }

//   if (!isModalVisible || values?.type_of_assets !== "Building") return null

//   return (
//     <>
//       <Dialog open={isModalVisible} onOpenChange={onClose}>
//         <DialogContent className="max-w-6xl max-h-[90vh] bg-white text-gray-800">
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <Building className="w-5 h-5 text-blue-600" />
//                 <span>Building Configuration</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsDataModalVisible(true)}
//                   className="flex items-center space-x-2"
//                   disabled={savedFloors.length === 0}
//                 >
//                   <Eye className="w-4 h-4" />
//                   <span>View Data</span>
//                 </Button>
//               </div>
//             </DialogTitle>
//           </DialogHeader>

//           <ScrollArea className="h-[75vh] pr-4">
//             <Tabs defaultValue="basic" className="w-full">
//               <TabsList className="grid w-full grid-cols-4">
//                 <TabsTrigger value="basic">Basic Info</TabsTrigger>
//                 <TabsTrigger value="floors" disabled={!floorDisable}>
//                   Floor Selection
//                 </TabsTrigger>
//                 <TabsTrigger value="units" disabled={selectedFloor === null}>
//                   Unit Configuration
//                 </TabsTrigger>
//                 <TabsTrigger value="details" disabled={!selectedUnit}>
//                   Unit Details
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="basic" className="space-y-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center space-x-2">
//                       <Building className="w-5 h-5" />
//                       <span>Building Information</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="buildingName">Building Name</Label>
//                         <Input
//                           id="buildingName"
//                           value={buildingName}
//                           onChange={(e) => setBuildingName(e.target.value)}
//                           placeholder="Enter building name"
//                           disabled={floorDisable}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="floorCount">Number of Floors (1-10)</Label>
//                         <Input
//                           id="floorCount"
//                           type="number"
//                           value={floorCount}
//                           onChange={(e) => {
//                             const value = Number.parseInt(e.target.value)
//                             if (!isNaN(value) && value >= 1 && value <= 10) {
//                               setFloorCount(value.toString())
//                             } else if (e.target.value === "") {
//                               setFloorCount("")
//                             }
//                           }}
//                           placeholder="Enter number of floors"
//                           disabled={floorDisable}
//                           min={1}
//                           max={10}
//                         />
//                       </div>
//                     </div>
//                     <Button
//                       onClick={() => handleSave(false)}
//                       disabled={floorDisable}
//                       className="w-full flex items-center space-x-2"
//                     >
//                       <Plus className="w-4 h-4" />
//                       <span>Initialize Building Configuration</span>
//                     </Button>
//                   </CardContent>
//                 </Card>

//                 {floorDisable && (
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Building Summary</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <Label className="text-gray-500">Building Name</Label>
//                           <p className="font-semibold">{buildingName}</p>
//                         </div>
//                         <div>
//                           <Label className="text-gray-500">Total Floors</Label>
//                           <p className="font-semibold">{floorCount}</p>
//                         </div>
//                         <div>
//                           <Label className="text-gray-500">Configured Floors</Label>
//                           <p className="font-semibold">{savedFloors.length}</p>
//                         </div>
//                         <div>
//                           <Label className="text-gray-500">Total Units</Label>
//                           <p className="font-semibold">
//                             {savedFloors.reduce((total, floor) => total + floor.plotCount, 0)}
//                           </p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}
//               </TabsContent>

//               <TabsContent value="floors" className="space-y-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Select Floor to Configure</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid grid-cols-6 gap-3">
//                       {Array.from({ length: Math.max(Number(floorCount), 0) + 2 }, (_, index) => {
//                         const isSaved = isFloorSaved(index)
//                         const isSelected = selectedFloor === index

//                         return (
//                           <Button
//                             key={index}
//                             variant={isSelected ? "default" : isSaved ? "secondary" : "outline"}
//                             className={`h-16 flex flex-col items-center justify-center relative ${
//                               isSaved ? "cursor-not-allowed opacity-75" : ""
//                             }`}
//                             onClick={() => !isSaved && handleFloor(index)}
//                             disabled={isSaved}
//                           >
//                             {isSaved && (
//                               <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-600 bg-white rounded-full" />
//                             )}
//                             <Building className="w-5 h-5 mb-1" />
//                             <span className="text-xs font-medium">{getFloorDisplayName(index)}</span>
//                           </Button>
//                         )
//                       })}
//                     </div>

//                     {selectedFloor !== null && (
//                       <Card className="mt-6">
//                         <CardHeader>
//                           <CardTitle className="text-lg">Configure {getFloorDisplayName(selectedFloor)}</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="space-y-2">
//                             <Label htmlFor="plotCount">Number of Units on this Floor</Label>
//                             <Input
//                               id="plotCount"
//                               type="number"
//                               placeholder="Enter number of units"
//                               value={plotNos[selectedFloor] || ""}
//                               onChange={(e) => handlePlotCountChange(e, selectedFloor)}
//                               maxLength={3}
//                             />
//                           </div>
//                         </CardContent>
//                       </Card>
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="units" className="space-y-6">
//                 {plotNo > 0 && (
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center space-x-2">
//                         <Users className="w-5 h-5" />
//                         <span>Unit Type Distribution</span>
//                         <Badge variant="secondary">{plotNo} Total Units</Badge>
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <Card className="border-2 border-blue-100">
//                           <CardHeader className="bg-blue-50">
//                             <CardTitle className="text-lg flex items-center space-x-2">
//                               <Building className="w-4 h-4 text-blue-600" />
//                               <span>Commercial Units</span>
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className="pt-4">
//                             <div className="space-y-3">
//                               <div className="space-y-2">
//                                 <Label>Number of Commercial Units</Label>
//                                 <Input
//                                   type="number"
//                                   placeholder="Enter count"
//                                   value={commercialCount}
//                                   onChange={(e) => {
//                                     const value = Number.parseInt(e.target.value) || 0
//                                     validateUnitCount(
//                                       value,
//                                       residentialCount,
//                                       plotNo,
//                                       setCommercialCount,
//                                       setCommercialUnits,
//                                       "Commercial",
//                                     )
//                                   }}
//                                   maxLength={2}
//                                 />
//                               </div>
//                               <div className="flex flex-wrap gap-2">
//                                 {generateBoxes(commercialCount).map((num) => (
//                                   <Button
//                                     key={num}
//                                     variant={
//                                       selectedUnit?.type === "Commercial" && selectedUnit?.index === num - 1
//                                         ? "default"
//                                         : "outline"
//                                     }
//                                     size="sm"
//                                     className="w-10 h-10 p-0 relative"
//                                     onClick={() => handleUnitClick("Commercial", num - 1)}
//                                   >
//                                     {isUnitComplete("Commercial", num - 1) && (
//                                       <CheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-green-600 bg-white rounded-full" />
//                                     )}
//                                     {num}
//                                   </Button>
//                                 ))}
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>

//                         <Card className="border-2 border-green-100">
//                           <CardHeader className="bg-green-50">
//                             <CardTitle className="text-lg flex items-center space-x-2">
//                               <Home className="w-4 h-4 text-green-600" />
//                               <span>Residential Units</span>
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className="pt-4">
//                             <div className="space-y-3">
//                               <div className="space-y-2">
//                                 <Label>Number of Residential Units</Label>
//                                 <Input
//                                   type="number"
//                                   placeholder="Enter count"
//                                   value={residentialCount}
//                                   onChange={(e) => {
//                                     const value = Number.parseInt(e.target.value) || 0
//                                     validateUnitCount(
//                                       value,
//                                       commercialCount,
//                                       plotNo,
//                                       setResidentialCount,
//                                       setResidentialUnits,
//                                       "Residential",
//                                     )
//                                   }}
//                                   maxLength={2}
//                                 />
//                               </div>
//                               <div className="flex flex-wrap gap-2">
//                                 {generateBoxes(residentialCount).map((num) => (
//                                   <Button
//                                     key={num}
//                                     variant={
//                                       selectedUnit?.type === "Residential" && selectedUnit?.index === num - 1
//                                         ? "default"
//                                         : "outline"
//                                     }
//                                     size="sm"
//                                     className="w-10 h-10 p-0 relative"
//                                     onClick={() => handleUnitClick("Residential", num - 1)}
//                                   >
//                                     {isUnitComplete("Residential", num - 1) && (
//                                       <CheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-green-600 bg-white rounded-full" />
//                                     )}
//                                     {num}
//                                   </Button>
//                                 ))}
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       </div>

//                       {selectedUnit && (
//                         <Card className="border-2 border-orange-200 bg-orange-50">
//                           <CardHeader>
//                             <CardTitle className="flex items-center space-x-2">
//                               <AlertCircle className="w-4 h-4 text-orange-600" />
//                               <span>
//                                 Selected: {selectedUnit.type} Unit {selectedUnit.index + 1}
//                               </span>
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent>
//                             <p className="text-sm text-gray-600">
//                               Click on the "Unit Details" tab to configure this unit's information.
//                             </p>
//                           </CardContent>
//                         </Card>
//                       )}
//                     </CardContent>
//                   </Card>
//                 )}
//               </TabsContent>

//               <TabsContent value="details" className="space-y-6">
//                 {selectedUnit && (
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center space-x-2">
//                         <Ruler className="w-5 h-5" />
//                         <span>
//                           {selectedUnit.type} Unit {selectedUnit.index + 1} Details
//                         </span>
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-6">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="space-y-2">
//                           <Label>Length (meters)</Label>
//                           <Input
//                             type="number"
//                             placeholder="Length"
//                             value={getUnitDetails(selectedUnit.type, selectedUnit.index).length || ""}
//                             onChange={(e) => handleUnitDetailsChange(e, "length")}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Width (meters)</Label>
//                           <Input
//                             type="number"
//                             placeholder="Width"
//                             value={getUnitDetails(selectedUnit.type, selectedUnit.index).breadth || ""}
//                             onChange={(e) => handleUnitDetailsChange(e, "breadth")}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Height (meters)</Label>
//                           <Input
//                             type="number"
//                             placeholder="Height"
//                             value={getUnitDetails(selectedUnit.type, selectedUnit.index).height || ""}
//                             onChange={(e) => handleUnitDetailsChange(e, "height")}
//                           />
//                         </div>
//                       </div>

//                       <Separator />

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label>Owner Name</Label>
//                           <Input
//                             placeholder="Enter owner name"
//                             value={getUnitDetails(selectedUnit.type, selectedUnit.index).name || ""}
//                             onChange={(e) => handleUnitDetailsChange(e, "name")}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Property Name</Label>
//                           <Input
//                             placeholder="Enter property name"
//                             value={getUnitDetails(selectedUnit.type, selectedUnit.index).property_name || ""}
//                             onChange={(e) => handleUnitDetailsChange(e, "property_name")}
//                           />
//                         </div>
//                       </div>

//                       <div className="flex justify-center pt-4">
//                         <Button onClick={handleSaveFloorData} size="lg" className="flex items-center space-x-2">
//                           <Save className="w-4 h-4" />
//                           <span>Save Floor Configuration</span>
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}
//               </TabsContent>
//             </Tabs>
//           </ScrollArea>
//         </DialogContent>
//       </Dialog>

//       <DataModal
//         isVisible={isDataModalVisible}
//         onClose={() => setIsDataModalVisible(false)}
//         savedFloors={savedFloors}
//         selectedFloor={selectedFloor}
//         onSaveEdit={(editedFloor) => {
//           const newSavedFloors = [...savedFloors]
//           const index = newSavedFloors.findIndex((floor) => floor.floor === editedFloor.floor)
//           if (index !== -1) {
//             newSavedFloors[index] = editedFloor
//             setSavedFloors(newSavedFloors)
//           }
//         }}
//       />
//     </>
//   )
// }
