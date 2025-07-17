"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lightbulb, DollarSign, Save, Send } from "lucide-react"
import { toast } from "react-hot-toast"

export default function LightingForm() {
  const handleSaveDraft = () => {
    toast.success("Public Lighting form saved as draft")
  }

  const handleSubmitForReview = () => {
    toast.success("Public Lighting form submitted for review")
  }

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
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select contractor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contractor1">Electric Works Ltd.</SelectItem>
                  <SelectItem value="contractor2">Power Solutions Inc.</SelectItem>
                  <SelectItem value="contractor3">Municipal Electric Dept.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roadLocation">Road / Location *</Label>
              <Input id="roadLocation" placeholder="Enter road/location" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="head">Head</Label>
              <Input id="head" placeholder="Enter head" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lampPosts">No. of Lamp Posts *</Label>
              <Input id="lampPosts" type="number" placeholder="Enter number of lamp posts" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="constructionDate">Construction Date *</Label>
              <Input id="constructionDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costOfAcquisition">Cost of Acquisition *</Label>
              <Input id="costOfAcquisition" type="number" placeholder="Enter cost" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCost">Total Cost</Label>
              <Input id="totalCost" type="number" placeholder="Enter total cost" />
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
              <Label htmlFor="accumulatedDepreciation">Accumulated Depreciation</Label>
              <Input id="accumulatedDepreciation" type="number" placeholder="Enter depreciation" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addition202425">Addition During 2024-25</Label>
              <Input id="addition202425" type="number" placeholder="Enter addition" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wdv20240401">WDV 01/04/2024</Label>
              <Input id="wdv20240401" type="number" placeholder="Enter WDV" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depreciation202425">Depreciation 2024-25</Label>
              <Input id="depreciation202425" type="number" placeholder="Enter depreciation" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wdv20250331">WDV 31/03/2025</Label>
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
          <Button type="submit" onClick={handleSubmitForReview} className="bg-yellow-600 hover:bg-yellow-700">
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        </div>
      </form>
    </div>
  )
}
