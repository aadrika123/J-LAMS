"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Toaster } from "react-hot-toast"
import LandDetailsForm from "@/components/AssetsForms/land-details-forms"
import { useRouter } from "next/navigation"

export default function LandRegistrationPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/apply/approve-application")
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
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Land Asset Registration</h1>
              <p className="text-sm text-gray-600">Register land assets and property details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LandDetailsForm />
      </div>
    </div>
  )
}
