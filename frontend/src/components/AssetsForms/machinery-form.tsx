"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Cog, DollarSign, Save, Send } from "lucide-react"
import { toast } from "react-hot-toast"
import { ASSETS } from "@/utils/api/urls"

export default function MachineryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    asset_type: "PLANT_MACHINERY",
    contractor_name: "",
    description: "",
    head: "",
    date_of_acquisition: "",
    cost_of_acquisition: "",
    accumulated_depreciation: "",
    financial_year: "",
    addition_during_year: "",
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

  const handleFinancialYearChange = (value: string) => {
    handleInputChange("financial_year", value)
  }

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        cost_of_acquisition: Number(formData.cost_of_acquisition) || 0,
        accumulated_depreciation: Number(formData.accumulated_depreciation) || 0,
        addition_during_year: Number(formData.addition_during_year) || 0,
        wdv_start: Number(formData.wdv_start) || 0,
        wdv_end: Number(formData.wdv_end) || 0,
        depreciation_for_year: Number(formData.depreciation_for_year) || 0,
        is_drafted: true,
      }

      const response = await fetch("https://jharkhandegovernance.com/auth/api/lams/v1/asset/createpayload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success("Plant & Machinery asset saved as draft successfully!")
        console.log("API Response:", result)
      } else {
        throw new Error("Failed to save draft")
      }
    } catch (error) {
      console.error("Save draft error:", error)
      toast.error("Failed to save machinery asset as draft")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitForReview = async () => {
    // Validate required fields
    if (
      !formData.description ||
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
        toast.success("Plant & Machinery asset submitted for review successfully!")
        console.log("API Response:", result)

        // Reset form after successful submission
        setFormData({
          asset_type: "PLANT_MACHINERY",
          contractor_name: "",
          description: "",
          head: "",
          date_of_acquisition: "",
          cost_of_acquisition: "",
          accumulated_depreciation: "",
          financial_year: "",
          addition_during_year: "",
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
      toast.error("Failed to submit machinery asset for review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const [startYear, endYear] = formData.financial_year.split("-")

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <Cog className="h-6 w-6 text-red-600" />
        <h2 className="text-2xl font-bold text-gray-900">Plant & Machinery Registration</h2>
      </div>

      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cog className="h-5 w-5 text-red-600" />
              <span>Machinery Information</span>
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
                  <SelectItem value="Heavy Machinery Ltd.">Heavy Machinery Ltd.</SelectItem>
                  <SelectItem value="Industrial Equipment Co.">Industrial Equipment Co.</SelectItem>
                  <SelectItem value="Municipal Works Dept.">Municipal Works Dept.</SelectItem>
                  <SelectItem value="Mitra Engineering Ltd.">Mitra Engineering Ltd.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description (include make) *</Label>
              <Textarea
                id="description"
                placeholder="Enter detailed description including make and model"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
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
              <Label htmlFor="acquisitionDate">Date of Acquisition *</Label>
              <Input
                id="acquisitionDate"
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
          </CardContent>
        </Card>

        {/* Depreciation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              <span>Depreciation & Valuation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Financial Year Select */}
            <div className="space-y-2">
              <Label htmlFor="financialYear">Financial Year*</Label>
              <Select value={formData.financial_year} onValueChange={handleFinancialYearChange}>
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
              <Label htmlFor="additionDuringYear">Addition During {formData.financial_year || "FY"}</Label>
              <Input
                id="additionDuringYear"
                type="number"
                placeholder="Enter addition"
                value={formData.addition_during_year}
                onChange={(e) => handleInputChange("addition_during_year", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wdvStart">WDV as on start of FY {startYear && `(${startYear}-04-01)`}</Label>
              <Input
                id="wdvStart"
                type="number"
                placeholder="Enter WDV"
                value={formData.wdv_start}
                onChange={(e) => handleInputChange("wdv_start", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depreciationForYear">Depreciation {formData.financial_year || "FY"}</Label>
              <Input
                id="depreciationForYear"
                type="number"
                placeholder="Enter depreciation"
                value={formData.depreciation_for_year}
                onChange={(e) => handleInputChange("depreciation_for_year", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wdvEnd">WDV as on end of FY {endYear && `(${endYear}-03-31)`}</Label>
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
            className="bg-red-600 hover:bg-red-700"
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
