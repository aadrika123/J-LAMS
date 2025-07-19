"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lightbulb, DollarSign, Save, Send } from "lucide-react"
import { toast } from "react-hot-toast"
import { ASSETS } from "@/utils/api/urls"

export default function LightingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    asset_type: "PUBLIC_LIGHTING",
    contractor_name: "",
    road_name: "",
    head: "",
    number_of_lamp_posts: "",
    date_of_acquisition: "",
    cost_of_acquisition: "",
    total_cost: "",
    financial_year: "",
    accumulated_depreciation: "",
    addition_during_year: "",
    wdv_start: "",
    depreciation_for_year: "",
    wdv_end: "",
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
        number_of_lamp_posts: Number(formData.number_of_lamp_posts) || 0,
        accumulated_depreciation: Number(formData.accumulated_depreciation) || 0,
        addition_during_year: Number(formData.addition_during_year) || 0,
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
        toast.success("Public lighting asset saved as draft successfully!")
        console.log("API Response:", result)
      } else {
        throw new Error("Failed to save draft")
      }
    } catch (error) {
      console.error("Save draft error:", error)
      toast.error("Failed to save lighting asset as draft")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitForReview = async () => {
    // Validate required fields
    if (
      !formData.road_name ||
      !formData.number_of_lamp_posts ||
      !formData.date_of_acquisition ||
      !formData.cost_of_acquisition ||
      !formData.financial_year
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        cost_of_acquisition: Number(formData.cost_of_acquisition) || 0,
        total_cost: Number(formData.total_cost) || 0,
        number_of_lamp_posts: Number(formData.number_of_lamp_posts) || 0,
        accumulated_depreciation: Number(formData.accumulated_depreciation) || 0,
        addition_during_year: Number(formData.addition_during_year) || 0,
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
        toast.success("Public lighting asset submitted for review successfully!")
        console.log("API Response:", result)

        // Reset form after successful submission
        setFormData({
          asset_type: "PUBLIC_LIGHTING",
          contractor_name: "",
          road_name: "",
          head: "",
          number_of_lamp_posts: "",
          date_of_acquisition: "",
          cost_of_acquisition: "",
          total_cost: "",
          financial_year: "",
          accumulated_depreciation: "",
          addition_during_year: "",
          wdv_start: "",
          depreciation_for_year: "",
          wdv_end: "",
          ulb_id: 2,
        })
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast.error("Failed to submit lighting asset for review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const startYear = formData.financial_year ? formData.financial_year.split("-")[0] : null
  const endYear = formData.financial_year ? formData.financial_year.split("-")[1] : null

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <Lightbulb className="h-6 w-6 text-yellow-600" />
        <h2 className="text-2xl font-bold text-gray-900">Public Lighting Registration</h2>
      </div>

      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <span>Lighting Infrastructure</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contractorName">Name of Contractor</Label>
              <Select onValueChange={(value) => handleInputChange("contractor_name", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contractor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electric Works Ltd.">Electric Works Ltd.</SelectItem>
                  <SelectItem value="Power Solutions Inc.">Power Solutions Inc.</SelectItem>
                  <SelectItem value="Municipal Electric Dept.">Municipal Electric Dept.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roadLocation">Road / Location *</Label>
              <Input
                id="roadLocation"
                placeholder="Enter road/location"
                value={formData.road_name}
                onChange={(e) => handleInputChange("road_name", e.target.value)}
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
              <Label htmlFor="lampPosts">No. of Lamp Posts *</Label>
              <Input
                id="lampPosts"
                type="number"
                placeholder="Enter number of lamp posts"
                value={formData.number_of_lamp_posts}
                onChange={(e) => handleInputChange("number_of_lamp_posts", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="constructionDate">Construction Date *</Label>
              <Input
                id="constructionDate"
                type="date"
                value={formData.date_of_acquisition}
                onChange={(e) => handleInputChange("date_of_acquisition", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costOfAcquisition">Cost of Acquisition *</Label>
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

        {/* Financial Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <span>Financial Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="financialYear">Financial Year *</Label>
              <Select
                value={formData.financial_year}
                onValueChange={(value) => handleInputChange("financial_year", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select financial year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="addition">Addition During {formData.financial_year || "FY"}</Label>
              <Input
                id="addition"
                type="number"
                placeholder="Enter addition"
                value={formData.addition_during_year}
                onChange={(e) => handleInputChange("addition_during_year", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wdvStart">
                WDV as on start of FY {startYear && <span className="text-muted-foreground">({startYear}-04-01)</span>}
              </Label>
              <Input
                id="wdvStart"
                type="number"
                placeholder="Enter WDV"
                value={formData.wdv_start}
                onChange={(e) => handleInputChange("wdv_start", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depreciation">Depreciation {formData.financial_year || ""}</Label>
              <Input
                id="depreciation"
                type="number"
                placeholder="Enter depreciation"
                value={formData.depreciation_for_year}
                onChange={(e) => handleInputChange("depreciation_for_year", e.target.value)}
              />
            </div>

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
            className="bg-yellow-600 hover:bg-yellow-700"
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
