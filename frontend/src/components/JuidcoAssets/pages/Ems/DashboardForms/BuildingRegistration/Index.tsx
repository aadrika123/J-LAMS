"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Toaster } from "react-hot-toast"
// import BuildingDetailsForm from "../../../../../AssetsForms/building-details-form"
import BuildingDetailsForm from "@/components/AssetsForms/building-details-form"
import { useRouter } from "next/navigation"

export default function BuildingRegistrationPage() {

      const router = useRouter()
    
      const handleBack = () => {
        router.push("/apply/approve-application")
      }
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-9xl mx-auto  sm:px-6 ">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Building Asset Registration</h1>
              <p className="text-sm text-gray-600">Register buildings with floor configuration and unit details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-9xl mx-auto  sm:px-6 py-8">
        <BuildingDetailsForm />
      </div>
    </div>
  )
}
