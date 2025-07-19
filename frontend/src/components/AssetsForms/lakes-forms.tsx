"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Waves, DollarSign, Save, Send } from "lucide-react"
import { toast } from "react-hot-toast"
import { ASSETS } from '@/utils/api/urls'

export default function LakesForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lakesImproved, setLakesImproved] = useState(false)
  const [formData, setFormData] = useState({
    asset_type: "LAKE_POND",
    description: "",
    location: "",
    survey_no: "",
    area: "",
    date_of_acquisition: "",
    cost_of_acquisition: "",
    improvement_done: false,
    improvement_date: "",
    improvement_cost: "",
    total_cost: "",
    acquired_from: "",
    mode_of_acquisition: "",
    remarks: "",
    ulb_id: 2,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-calculate total cost when cost of acquisition or improvement cost changes
    if (field === "cost_of_acquisition" || field === "improvement_cost") {
      const costOfAcquisition = field === "cost_of_acquisition" ? Number(value) : Number(formData.cost_of_acquisition)
      const improvementCost = field === "improvement_cost" ? Number(value) : Number(formData.improvement_cost)

      if (lakesImproved && improvementCost > 0) {
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

  const handleLakesImprovedChange = (checked: boolean) => {
    setLakesImproved(checked)
    handleInputChange("improvement_done", checked)

    if (!checked) {
      // Reset improvement-related fields
      handleInputChange("improvement_date", "")
      handleInputChange("improvement_cost", "")
      setFormData((prev) => ({
        ...prev,
        total_cost: prev.cost_of_acquisition,
      }))
    }
  }

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        cost_of_acquisition: Number(formData.cost_of_acquisition) || 0,
        improvement_cost: lakesImproved ? Number(formData.improvement_cost) || 0 : undefined,
        total_cost: Number(formData.total_cost) || Number(formData.cost_of_acquisition) || 0,
        improvement_date: lakesImproved ? formData.improvement_date : null,
        is_drafted: true,
      }

      // Remove improvement_cost from payload if not improved
      if (!lakesImproved) {
        delete payload.improvement_cost
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
        toast.success("Lakes & Ponds asset saved as draft successfully!")
        console.log("API Response:", result)
      } else {
        throw new Error("Failed to save draft")
      }
    } catch (error) {
      console.error("Save draft error:", error)
      toast.error("Failed to save lakes asset as draft")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitForReview = async () => {
    // Validate required fields
    if (
      !formData.description ||
      !formData.location ||
      !formData.area ||
      !formData.date_of_acquisition ||
      !formData.cost_of_acquisition
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate improvement fields if improved
    if (lakesImproved && (!formData.improvement_date || !formData.improvement_cost)) {
      toast.error("Please fill in improvement date and cost")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        cost_of_acquisition: Number(formData.cost_of_acquisition) || 0,
        improvement_cost: lakesImproved ? Number(formData.improvement_cost) || 0 : undefined,
        total_cost: Number(formData.total_cost) || Number(formData.cost_of_acquisition) || 0,
        improvement_date: lakesImproved ? formData.improvement_date : null,
        is_drafted: false,
      }

      // Remove improvement_cost from payload if not improved
      if (!lakesImproved) {
        delete payload.improvement_cost
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
        toast.success("Lakes & Ponds asset submitted for review successfully!")
        console.log("API Response:", result)

        // Reset form after successful submission
        setFormData({
          asset_type: "LAKE_POND",
          description: "",
          location: "",
          survey_no: "",
          area: "",
          date_of_acquisition: "",
          cost_of_acquisition: "",
          improvement_done: false,
          improvement_date: "",
          improvement_cost: "",
          total_cost: "",
          acquired_from: "",
          mode_of_acquisition: "",
          remarks: "",
          ulb_id: 2,
        })
        setLakesImproved(false)
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast.error("Failed to submit lakes asset for review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <Waves className="h-6 w-6 text-cyan-600" />
        <h2 className="text-2xl font-bold text-gray-900">Lakes & Ponds Registration</h2>
      </div>

      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Waves className="h-5 w-5 text-cyan-600" />
              <span>Water Body Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Label htmlFor="surveyNo">Survey No.</Label>
              <Input
                id="surveyNo"
                placeholder="Enter survey number"
                value={formData.survey_no}
                onChange={(e) => handleInputChange("survey_no", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area (acre / sq.m) *</Label>
              <Input
                id="area"
                placeholder="Enter area"
                value={formData.area}
                onChange={(e) => handleInputChange("area", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="constructionDate">Construction/Acquisition Date *</Label>
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
          </CardContent>
        </Card>

        {/* Improvement Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-cyan-600" />
              <span>Improvement Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-3">
              <Switch id="lakesImproved" checked={lakesImproved} onCheckedChange={handleLakesImprovedChange} />
              <Label htmlFor="lakesImproved" className="text-sm font-medium">
                Improved?
              </Label>
            </div>

            {lakesImproved && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
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
                    value={formData.improvement_cost}
                    onChange={(e) => handleInputChange("improvement_cost", e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <p className="text-xs text-gray-500">Auto-calculated (Cost of Acquisition + Improvement Cost)</p>
              </div>

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
                    <SelectItem value="ACQUIRED">Acquired</SelectItem>
                    <SelectItem value="DONATION">Donation</SelectItem>
                    <SelectItem value="OTHERS">Others</SelectItem>
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
            className="bg-cyan-600 hover:bg-cyan-700"
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
