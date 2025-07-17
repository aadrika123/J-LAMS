// "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Building, MapPin, Lightbulb, Waves, Cog, Landmark, X } from "lucide-react"

// interface AssetTypeSelectorProps {
//   isOpen: boolean
//   onClose: () => void
//   onSelectAssetType: (assetType: string) => void
// }

// export default function AssetTypeSelector({ isOpen, onClose, onSelectAssetType }: AssetTypeSelectorProps) {
//   if (!isOpen) return null

//   const assetTypes = [
//     {
//       id: "land",
//       title: "Land Details",
//       description: "Register land assets including vacant land, agricultural land, and commercial plots",
//       icon: MapPin,
//       color: "text-green-600",
//       bgColor: "bg-green-50",
//       borderColor: "border-green-200",
//       hoverColor: "hover:bg-green-100",
//     },
//     {
//       id: "building",
//       title: "Building Details",
//       description: "Register buildings with floor-wise configuration and unit management",
//       icon: Building,
//       color: "text-blue-600",
//       bgColor: "bg-blue-50",
//       borderColor: "border-blue-200",
//       hoverColor: "hover:bg-blue-100",
//     },
//     {
//       id: "heritage",
//       title: "Statues & Heritage",
//       description: "Register heritage assets, monuments, and cultural properties",
//       icon: Landmark,
//       color: "text-purple-600",
//       bgColor: "bg-purple-50",
//       borderColor: "border-purple-200",
//       hoverColor: "hover:bg-purple-100",
//     },
//     {
//       id: "lighting",
//       title: "Public Lighting",
//       description: "Register street lights, lamp posts, and public lighting infrastructure",
//       icon: Lightbulb,
//       color: "text-yellow-600",
//       bgColor: "bg-yellow-50",
//       borderColor: "border-yellow-200",
//       hoverColor: "hover:bg-yellow-100",
//     },
//     {
//       id: "lakes",
//       title: "Lakes & Ponds",
//       description: "Register water bodies including lakes, ponds, and water reservoirs",
//       icon: Waves,
//       color: "text-cyan-600",
//       bgColor: "bg-cyan-50",
//       borderColor: "border-cyan-200",
//       hoverColor: "hover:bg-cyan-100",
//     },
//     {
//       id: "machinery",
//       title: "Plant & Machinery",
//       description: "Register equipment, machinery, and industrial assets",
//       icon: Cog,
//       color: "text-red-600",
//       bgColor: "bg-red-50",
//       borderColor: "border-red-200",
//       hoverColor: "hover:bg-red-100",
//     },
//   ]

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
//         {/* Modal Header */}
//         <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Select Asset Type</h2>
//             <p className="text-sm text-gray-600 mt-1">Choose the type of asset you want to register</p>
//           </div>
//           <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-red-100 hover:text-red-600">
//             <X className="h-5 w-5" />
//           </Button>
//         </div>

//         {/* Modal Content */}
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {assetTypes.map((assetType) => {
//               const Icon = assetType.icon
//               return (
//                 <Card
//                   key={assetType.id}
//                   className={`cursor-pointer transition-all duration-200 ${assetType.borderColor} ${assetType.hoverColor} hover:shadow-lg hover:scale-105`}
//                   onClick={() => onSelectAssetType(assetType.id)}
//                 >
//                   <CardHeader className={`${assetType.bgColor} pb-4`}>
//                     <div className="flex items-center space-x-3">
//                       <div className={`p-2 rounded-lg bg-white shadow-sm`}>
//                         <Icon className={`h-6 w-6 ${assetType.color}`} />
//                       </div>
//                       <CardTitle className="text-lg font-semibold text-gray-900">{assetType.title}</CardTitle>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="pt-4">
//                     <CardDescription className="text-sm text-gray-600 leading-relaxed">
//                       {assetType.description}
//                     </CardDescription>
//                     <div className="mt-4">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className={`w-full ${assetType.color} border-current hover:bg-current hover:text-white`}
//                       >
//                         Register {assetType.title}
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </div>
//         </div>

//         {/* Modal Footer */}
//         <div className="border-t bg-gray-50 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <p className="text-sm text-gray-500">Select an asset type to begin the registration process</p>
//             <Button variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, MapPin, Lightbulb, Waves, Cog, Landmark, X, ArrowRight } from "lucide-react"

interface AssetTypeSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectAssetType: (assetType: string) => void
}

export default function AssetTypeSelector({ isOpen, onClose, onSelectAssetType }: AssetTypeSelectorProps) {
  if (!isOpen) return null

  const assetTypes = [
    {
      id: "land",
      title: "Land Details",
      icon: MapPin,
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
      shadowColor: "shadow-emerald-200",
    },
    {
      id: "building",
      title: "Building Details",
      icon: Building,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      shadowColor: "shadow-blue-200",
    },
    {
      id: "heritage",
      title: "Statues & Heritage",
      icon: Landmark,
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-50 to-violet-50",
      shadowColor: "shadow-purple-200",
    },
    {
      id: "lighting",
      title: "Public Lighting",
      icon: Lightbulb,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50",
      shadowColor: "shadow-amber-200",
    },
    {
      id: "lakes",
      title: "Lakes & Ponds",
      icon: Waves,
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-cyan-50 to-blue-50",
      shadowColor: "shadow-cyan-200",
    },
    {
      id: "machinery",
      title: "Plant & Machinery",
      icon: Cog,
      gradient: "from-red-500 to-rose-600",
      bgGradient: "from-red-50 to-rose-50",
      shadowColor: "shadow-red-200",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Modal Header */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 p-8">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Select Asset Type</h2>
                <p className="text-slate-300">Choose the type of asset you want to register</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="hover:bg-white/10 hover:text-white text-slate-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assetTypes.map((assetType) => {
              const Icon = assetType.icon
              return (
                <Card
                  key={assetType.id}
                  className={`group cursor-pointer transition-all duration-300 border-0 ${assetType.shadowColor} hover:shadow-xl hover:shadow-current/25 hover:-translate-y-1 bg-gradient-to-br ${assetType.bgGradient} backdrop-blur-sm`}
                  onClick={() => onSelectAssetType(assetType.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${assetType.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-6">
                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {assetType.title}
                    </CardTitle>
                    <div className="mt-6">
                      <div className={`w-full h-1 bg-gradient-to-r ${assetType.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-medium">Click on any asset type to begin registration</p>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="hover:bg-gray-100 border-gray-300 text-gray-700 font-medium px-6"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}