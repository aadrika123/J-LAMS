"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Cog, DollarSign, Save, Send } from "lucide-react"
import { toast } from "react-hot-toast"

export default function MachineryForm() {
  const handleSaveDraft = () => {
    toast.success("Plant & Machinery form saved as draft")
  }

  const handleSubmitForReview = () => {
    toast.success("Plant & Machinery form submitted for review")
  }

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
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select contractor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contractor1">Heavy Machinery Ltd.</SelectItem>
                  <SelectItem value="contractor2">Industrial Equipment Co.</SelectItem>
                  <SelectItem value="contractor3">Municipal Works Dept.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description (include make) *</Label>
              <Textarea id="description" placeholder="Enter detailed description including make and model" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="head">Head</Label>
              <Input id="head" placeholder="Enter head" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="acquisitionDate">Date of Acquisition *</Label>
              <Input id="acquisitionDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costOfAcquisition">Cost of Acquisition *</Label>
              <Input id="costOfAcquisition" type="number" placeholder="Enter cost" />
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
          <Button type="submit" onClick={handleSubmitForReview} className="bg-red-600 hover:bg-red-700">
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        </div>
      </form>
    </div>
  )
}
