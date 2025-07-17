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

export default function LakesForm() {
  const [lakesImproved, setLakesImproved] = useState(false)

  const handleSaveDraft = () => {
    toast.success("Lakes & Ponds form saved as draft")
  }

  const handleSubmitForReview = () => {
    toast.success("Lakes & Ponds form submitted for review")
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
              <Textarea id="description" placeholder="Enter detailed description" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" placeholder="Enter location" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="surveyNo">Survey No.</Label>
              <Input id="surveyNo" placeholder="Enter survey number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area (acre / sq.m) *</Label>
              <Input id="area" type="number" placeholder="Enter area" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="constructionDate">Construction/Acquisition Date *</Label>
              <Input id="constructionDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costOfAcquisition">Cost of Acquisition *</Label>
              <Input id="costOfAcquisition" type="number" placeholder="Enter cost" />
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
              <Switch id="lakesImproved" checked={lakesImproved} onCheckedChange={setLakesImproved} />
              <Label htmlFor="lakesImproved" className="text-sm font-medium">
                Improved?
              </Label>
            </div>

            {lakesImproved && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <div className="space-y-2">
                  <Label htmlFor="improvementDate">Improvement Date *</Label>
                  <Input id="improvementDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="improvementCost">Improvement Cost *</Label>
                  <Input id="improvementCost" type="number" placeholder="Enter improvement cost" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="totalCost">Total Cost</Label>
                <Input id="totalCost" type="number" placeholder="Auto-calculated" disabled className="bg-gray-100" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromWhomAcquired">From Whom Acquired</Label>
                <Input id="fromWhomAcquired" placeholder="Enter details" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modeOfAcquisition">Mode of Acquisition</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="acquisition">Acquisition</SelectItem>
                    <SelectItem value="donation">Donation</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titleDocument">Title Document Reference</Label>
                <Input id="titleDocument" placeholder="Enter reference" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea id="remarks" placeholder="Enter any additional remarks" rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button type="submit" onClick={handleSubmitForReview} className="bg-cyan-600 hover:bg-cyan-700">
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        </div>
      </form>
    </div>
  )
}
