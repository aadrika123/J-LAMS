"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Landmark, DollarSign, Save, Send } from "lucide-react"
import { toast } from "react-hot-toast"

export default function HeritageForm() {
  const handleSaveDraft = () => {
    toast.success("Statues & Heritage form saved as draft")
  }

  const handleSubmitForReview = () => {
    toast.success("Statues & Heritage form submitted for review")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <Landmark className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Statues & Heritage Registration</h2>
      </div>

      <form className="space-y-8">
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
              <Textarea id="description" placeholder="Enter detailed description" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" placeholder="Enter location" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="head">Head</Label>
              <Input id="head" placeholder="Enter head" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costOfAcquisition">Cost of Acquisition</Label>
              <Input id="costOfAcquisition" type="number" placeholder="Enter cost" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCost">Total Cost</Label>
              <Input id="totalCost" type="number" placeholder="Enter total cost" />
            </div>
          </CardContent>
        </Card>

        {/* Depreciation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span>Valuation Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="accumulatedDepreciation">Accumulated Depreciation</Label>
              <Input id="accumulatedDepreciation" type="number" placeholder="Enter depreciation" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wdv20240401">WDV as on 01/04/2024</Label>
              <Input id="wdv20240401" type="number" placeholder="Enter WDV" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depreciation202425">Depreciation 2024-25</Label>
              <Input id="depreciation202425" type="number" placeholder="Enter depreciation" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wdv20250331">WDV as on 31/03/2025</Label>
              <Input id="wdv20250331" type="number" placeholder="Auto-calculated" disabled className="bg-gray-100" />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button type="submit" onClick={handleSubmitForReview} className="bg-purple-600 hover:bg-purple-700">
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        </div>
      </form>
    </div>
  )
}
