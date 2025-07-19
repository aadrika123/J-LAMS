"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Landmark, DollarSign, Save, Send } from "lucide-react"
import { toast } from "react-hot-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ASSETS } from '@/utils/api/urls'

export default function HeritageForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    asset_type: "STATUTES_HERITAGE",
    description: "",
    location: "",
    head: "",
    cost_of_acquisition: "",
    total_cost: "",
    financial_year: "",
    accumulated_depreciation: "",
    wdv_start: "",
    wdv_end: "",
    depreciation_for_year: "",
    ulb_id: 2,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-calculate WDV end when other values change
    if (field === "wdv_start" || field === "depreciation_for_year") {
      const wdvStart = field === "wdv_start" ? Number(value) : Number(formData.wdv_start)
      const depreciation = field === "depreciation_for_year" ? Number(value) : Number(formData.depreciation_for_year)

      if (wdvStart && depreciation) {
        setFormData((prev) => ({
          ...prev,
          wdv_end: (wdvStart - depreciation).toString(),
        }))
      }
    }
  }

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        cost_of_acquisition: Number(formData.cost_of_acquisition) || 0,
        total_cost: Number(formData.total_cost) || 0,
        accumulated_depreciation: Number(formData.accumulated_depreciation) || 0,
        wdv_start: Number(formData.wdv_start) || 0,
        wdv_end: Number(formData.wdv_end) || 0,
        depreciation_for_year: Number(formData.depreciation_for_year) || 0,
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
        toast.success("Heritage asset saved as draft successfully!")
        console.log("API Response:", result)
      } else {
        throw new Error("Failed to save draft")
      }
    } catch (error) {
      console.error("Save draft error:", error)
      toast.error("Failed to save heritage asset as draft")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitForReview = async () => {
    // Validate required fields
    if (!formData.description || !formData.location || !formData.financial_year) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        cost_of_acquisition: Number(formData.cost_of_acquisition) || 0,
        total_cost: Number(formData.total_cost) || 0,
        accumulated_depreciation: Number(formData.accumulated_depreciation) || 0,
        wdv_start: Number(formData.wdv_start) || 0,
        wdv_end: Number(formData.wdv_end) || 0,
        depreciation_for_year: Number(formData.depreciation_for_year) || 0,
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
        toast.success("Heritage asset submitted for review successfully!")
        console.log("API Response:", result)

        // Reset form after successful submission
        setFormData({
          asset_type: "STATUTES_HERITAGE",
          description: "",
          location: "",
          head: "",
          cost_of_acquisition: "",
          total_cost: "",
          financial_year: "",
          accumulated_depreciation: "",
          wdv_start: "",
          wdv_end: "",
          depreciation_for_year: "",
          ulb_id: 2,
        })
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast.error("Failed to submit heritage asset for review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const [startYear, endYear] = formData.financial_year.split("-")

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <Landmark className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Statues & Heritage Registration</h2>
      </div>

      <form className="space-y-8">
        {/* Heritage Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Landmark className="h-5 w-5 text-purple-600" />
              <span>Heritage Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter detailed description"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
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
              <Label htmlFor="head">Head</Label>
              <Input
                id="head"
                placeholder="Enter head"
                value={formData.head}
                onChange={(e) => handleInputChange("head", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costOfAcquisition">Cost of Acquisition</Label>
              <Input
                id="costOfAcquisition"
                type="number"
                placeholder="Enter cost"
                value={formData.cost_of_acquisition}
                onChange={(e) => handleInputChange("cost_of_acquisition", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCost">Total Cost</Label>
              <Input
                id="totalCost"
                type="number"
                placeholder="Enter total cost"
                value={formData.total_cost}
                onChange={(e) => handleInputChange("total_cost", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Valuation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span>Valuation Details</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Financial Year Select */}
            <div className="space-y-2">
              <Label htmlFor="financialYear">Financial Year *</Label>
              <Select
                value={formData.financial_year}
                onValueChange={(value) => handleInputChange("financial_year", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Financial Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Accumulated Depreciation */}
            <div className="space-y-2">
              <Label htmlFor="accumulatedDepreciation">Accumulated Depreciation</Label>
              <Input
                id="accumulatedDepreciation"
                type="number"
                placeholder="Enter depreciation"
                value={formData.accumulated_depreciation}
                onChange={(e) => handleInputChange("accumulated_depreciation", e.target.value)}
              />
            </div>

            {/* WDV Start of FY */}
            <div className="space-y-2">
              <Label htmlFor="wdvStart">
                WDV as on start of FY {startYear && <span className="text-muted-foreground">({startYear}-04-01)</span>}
              </Label>
              <Input
                id="wdvStart"
                type="number"
                placeholder={`Enter WDV as on ${startYear || "____"}-04-01`}
                value={formData.wdv_start}
                onChange={(e) => handleInputChange("wdv_start", e.target.value)}
              />
            </div>

            {/* Depreciation for selected FY */}
            <div className="space-y-2">
              <Label htmlFor="depreciationYear">Depreciation {formData.financial_year || "____"}</Label>
              <Input
                id="depreciationYear"
                type="number"
                placeholder="Enter depreciation"
                value={formData.depreciation_for_year}
                onChange={(e) => handleInputChange("depreciation_for_year", e.target.value)}
              />
            </div>

            {/* WDV End of FY */}
            <div className="space-y-2">
              <Label htmlFor="wdvEnd">
                WDV as on end of FY {endYear && <span className="text-muted-foreground">({endYear}-03-31)</span>}
              </Label>
              <Input
                id="wdvEnd"
                type="number"
                placeholder="Auto-calculated"
                value={formData.wdv_end}
                disabled
                className="bg-gray-100"
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
            type="button"
            onClick={handleSubmitForReview}
            className="bg-purple-600 hover:bg-purple-700"
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
