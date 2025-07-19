"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { MapPin, FileText, DollarSign, Save, Send, Upload } from "lucide-react"
import { toast } from "react-hot-toast"
import { ASSETS } from "@/utils/api/urls"

export default function LandDetailsForm() {
  const [landImproved, setLandImproved] = useState(false)

  // Form Data State
  const [formData, setFormData] = useState({
    asset_type: "LAND",
    ulb_id: 2,
    ownership_type: "",
    location: "",
    survey_no: "",
    area: "",
    date_of_acquisition: "",
    cost_of_acquisition: "",
    improvement_done: false,
    improvement_date: "",
    total_cost: "",
    khata_no: "",
    plot_no: "",
    type_of_land: "",
    ward_no: "",
    acquired_from: "",
    mode_of_acquisition: "",
    current_usage: "",
    current_market_value: "",
    financial_year: "",
    remarks: "",
  })

  // File Upload States
  const [blueprintFile, setBlueprintFile] = useState<File | null>(null)
  const [ownershipFile, setOwnershipFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-calculate total cost when cost of acquisition or improvement cost changes
    if (field === "cost_of_acquisition" || field === "improvement_cost") {
      const costOfAcquisition = field === "cost_of_acquisition" ? Number(value) : Number(formData.cost_of_acquisition)
      const improvementCost =
        field === "improvement_cost"
          ? Number(value)
          : Number(formData.total_cost) - Number(formData.cost_of_acquisition)

      if (landImproved && improvementCost > 0) {
        setFormData((prev) => ({
          ...prev,
          total_cost: (costOfAcquisition + improvementCost).toString(),
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          total_cost: costOfAcquisition.toString(),
        }))
      }
    }
  }

  const handleFileUpload = async (file: File, endpoint = `${ASSETS.LIST.validate}`) => {
    if (!file) return null

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        return result.data || result.filename
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
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

  const handleLandImprovedChange = (checked: boolean) => {
    setLandImproved(checked)
    handleInputChange("improvement_done", checked)

    if (!checked) {
      // Reset improvement-related fields
      handleInputChange("improvement_date", "")
      setFormData((prev) => ({
        ...prev,
        total_cost: prev.cost_of_acquisition,
      }))
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
        asset_type: "LAND",
        ulb_id: 2,
        ownership_type: formData.ownership_type || "FREEHOLD",
        location: formData.location || "Main Road, Sector 5",
        survey_no: formData.survey_no || "SRV-2025-0012",
        area: formData.area || "5000",
        date_of_acquisition: formData.date_of_acquisition,
        cost_of_acquisition: Number(formData.cost_of_acquisition) || 1500000.0,
        improvement_done: landImproved,
        improvement_date: landImproved ? formData.improvement_date : null,
        total_cost: Number(formData.total_cost) || Number(formData.cost_of_acquisition) || 1650000.0,
        khata_no: formData.khata_no || "KH-789",
        plot_no: formData.plot_no || "PL-456",
        type_of_land: formData.type_of_land || "Residential",
        ward_no: formData.ward_no || "12B",
        ownership_doc: ownershipUrl || "doc123.pdf",
        blue_print: blueprintUrl || "blueprint456.pdf",
        acquired_from: formData.acquired_from || "Mr. Ramesh Sharma",
        mode_of_acquisition: formData.mode_of_acquisition || "PURCHASE",
        current_usage: formData.current_usage || "Park",
        current_market_value: Number(formData.current_market_value) || 1800000.0,
        financial_year: formData.financial_year || "2024-2025",
        remarks: formData.remarks || "Well maintained and fenced",
        is_drafted: true,
      }

      const response = await fetch("https://jharkhandegovernance.com/auth/api/lams/v1/asset/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success("Land Details form saved as draft")
        console.log("API Response:", result)
      } else {
        throw new Error("Failed to save draft")
      }
    } catch (error) {
      console.error("Save draft error:", error)
      toast.error("Failed to save land as draft")
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
        asset_type: "LAND",
        ulb_id: 2,
        ownership_type: formData.ownership_type || "FREEHOLD",
        location: formData.location || "Main Road, Sector 5",
        survey_no: formData.survey_no || "SRV-2025-0012",
        area: formData.area || "5000",
        date_of_acquisition: formData.date_of_acquisition,
        cost_of_acquisition: Number(formData.cost_of_acquisition) || 1500000.0,
        improvement_done: landImproved,
        improvement_date: landImproved ? formData.improvement_date : null,
        total_cost: Number(formData.total_cost) || Number(formData.cost_of_acquisition) || 1650000.0,
        khata_no: formData.khata_no || "KH-789",
        plot_no: formData.plot_no || "PL-456",
        type_of_land: formData.type_of_land || "Residential",
        ward_no: formData.ward_no || "12B",
        ownership_doc: ownershipUrl || "doc123.pdf",
        blue_print: blueprintUrl || "blueprint456.pdf",
        acquired_from: formData.acquired_from || "Mr. Ramesh Sharma",
        mode_of_acquisition: formData.mode_of_acquisition || "PURCHASE",
        current_usage: formData.current_usage || "Park",
        current_market_value: Number(formData.current_market_value) || 1800000.0,
        financial_year: formData.financial_year || "2024-2025",
        remarks: formData.remarks || "Well maintained and fenced",
        is_drafted: false,
      }

      const response = await fetch("https://jharkhandegovernance.com/auth/api/lams/v1/asset/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success("Land Details form submitted for review")
        console.log("API Response:", result)

        // Reset form after successful submission
        setFormData({
          asset_type: "LAND",
          ulb_id: 2,
          ownership_type: "",
          location: "",
          survey_no: "",
          area: "",
          date_of_acquisition: "",
          cost_of_acquisition: "",
          improvement_done: false,
          improvement_date: "",
          total_cost: "",
          khata_no: "",
          plot_no: "",
          type_of_land: "",
          ward_no: "",
          acquired_from: "",
          mode_of_acquisition: "",
          current_usage: "",
          current_market_value: "",
          financial_year: "",
          remarks: "",
        })
        setLandImproved(false)
        setBlueprintFile(null)
        setOwnershipFile(null)
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast.error("Failed to submit land for review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <MapPin className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">Land Details Registration</h2>
      </div>

      <form className="space-y-8">
        {/* Basic Land Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="surveyNo">Survey No. *</Label>
              <Input
                id="surveyNo"
                placeholder="Enter survey number"
                value={formData.survey_no}
                onChange={(e) => handleInputChange("survey_no", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area (acre/sq.m) *</Label>
              <Input
                id="area"
                type="number"
                placeholder="Enter area"
                value={formData.area}
                onChange={(e) => handleInputChange("area", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="acquisitionDate">Date of Acquisition *</Label>
              <Input
                id="acquisitionDate"
                type="date"
                value={formData.date_of_acquisition}
                onChange={(e) => handleInputChange("date_of_acquisition", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="acquisitionCost">Cost of Acquisition *</Label>
              <Input
                id="acquisitionCost"
                type="number"
                placeholder="Enter cost"
                value={formData.cost_of_acquisition}
                onChange={(e) => handleInputChange("cost_of_acquisition", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Land Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span>Land Improvement</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-3">
              <Switch id="landImproved" checked={landImproved} onCheckedChange={handleLandImprovedChange} />
              <Label htmlFor="landImproved" className="text-sm font-medium">
                Land Improved?
              </Label>
            </div>

            {landImproved && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="space-y-2">
                  <Label htmlFor="improvementDate">Improvement Date *</Label>
                  <Input
                    id="improvementDate"
                    type="date"
                    value={formData.improvement_date}
                    onChange={(e) => handleInputChange("improvement_date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="improvementCost">Improvement Cost *</Label>
                  <Input
                    id="improvementCost"
                    type="number"
                    placeholder="Enter improvement cost"
                    onChange={(e) => {
                      const improvementCost = Number(e.target.value)
                      const costOfAcquisition = Number(formData.cost_of_acquisition) || 0
                      setFormData((prev) => ({
                        ...prev,
                        total_cost: (costOfAcquisition + improvementCost).toString(),
                      }))
                    }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="totalCost">Total Cost</Label>
              <Input
                id="totalCost"
                type="number"
                placeholder="Auto-calculated"
                value={formData.total_cost}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">
                This will be automatically calculated (Cost of Acquisition + Improvement Cost)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Property Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="khataNo">Khata No *</Label>
              <Input
                id="khataNo"
                placeholder="Enter khata number"
                value={formData.khata_no}
                onChange={(e) => handleInputChange("khata_no", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plotNo">Plot No *</Label>
              <Input
                id="plotNo"
                placeholder="Enter plot number"
                value={formData.plot_no}
                onChange={(e) => handleInputChange("plot_no", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeOfLand">Type of Land *</Label>
              <Select onValueChange={(value) => handleInputChange("type_of_land", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select land type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wardNo">Ward No. *</Label>
              <Select onValueChange={(value) => handleInputChange("ward_no", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ward number" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => (
                    <SelectItem key={i + 1} value={`${i + 1}`}>
                      {i + 1}
                    </SelectItem>
                  ))}
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

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Additional Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fromWhomAcquired">From Whom Acquired</Label>
              <Input
                id="fromWhomAcquired"
                placeholder="Enter details"
                value={formData.acquired_from}
                onChange={(e) => handleInputChange("acquired_from", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modeOfAcquisition">Mode of Acquisition</Label>
              <Select onValueChange={(value) => handleInputChange("mode_of_acquisition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PURCHASE">Purchase</SelectItem>
                  <SelectItem value="DONATION">Donation</SelectItem>
                  <SelectItem value="ACQUIRED">Acquired</SelectItem>
                  <SelectItem value="OTHERS">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentUse">Current Use</Label>
              <Input
                id="currentUse"
                placeholder="Enter current use"
                value={formData.current_usage}
                onChange={(e) => handleInputChange("current_usage", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marketValue">Market Value</Label>
              <Input
                id="marketValue"
                type="number"
                placeholder="Enter market value"
                value={formData.current_market_value}
                onChange={(e) => handleInputChange("current_market_value", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="financialYear">Financial Year</Label>
              <Select onValueChange={(value) => handleInputChange("financial_year", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select financial year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Enter any additional remarks"
                rows={3}
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
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
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </form>
    </div>
  )
}
