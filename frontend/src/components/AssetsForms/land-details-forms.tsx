"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { MapPin, FileText, DollarSign, Save, Send } from "lucide-react"
import { toast } from "react-hot-toast"

export default function LandDetailsForm() {
  const [landImproved, setLandImproved] = useState(false)

  const handleSaveDraft = () => {
    toast.success("Land Details form saved as draft")
  }

  const handleSubmitForReview = () => {
    toast.success("Land Details form submitted for review")
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
              <Label htmlFor="leaseType">Lease Type *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select lease type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freehold">Freehold</SelectItem>
                  <SelectItem value="leasehold">Leasehold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" placeholder="Enter location" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="surveyNo">Survey No. *</Label>
              <Input id="surveyNo" placeholder="Enter survey number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area (acre/sq.m) *</Label>
              <Input id="area" type="number" placeholder="Enter area" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="acquisitionDate">Date of Acquisition *</Label>
              <Input id="acquisitionDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="acquisitionCost">Cost of Acquisition *</Label>
              <Input id="acquisitionCost" type="number" placeholder="Enter cost" />
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
              <Switch id="landImproved" checked={landImproved} onCheckedChange={setLandImproved} />
              <Label htmlFor="landImproved" className="text-sm font-medium">
                Land Improved?
              </Label>
            </div>

            {landImproved && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-green-50 rounded-lg border border-green-200">
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

            <div className="space-y-2">
              <Label htmlFor="totalCost">Total Cost</Label>
              <Input id="totalCost" type="number" placeholder="Auto-calculated" disabled className="bg-gray-100" />
              <p className="text-xs text-gray-500">
                This will be automatically calculated (Cost of Acquisition + Improvement Cost)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                  <SelectItem value="acquisition">Acquisition</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentUse">Current Use</Label>
              <Input id="currentUse" placeholder="Enter current use" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titleDocuments">Title Documents Reference</Label>
              <Input id="titleDocuments" placeholder="Enter reference" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketValue">Market Value</Label>
              <Input id="marketValue" type="number" placeholder="Enter market value" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="financialYear">Financial Year</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select financial year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                  <SelectItem value="2022-23">2022-23</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" placeholder="Enter any additional remarks" rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button type="submit" onClick={handleSubmitForReview} className="bg-green-600 hover:bg-green-700">
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        </div>
      </form>
    </div>
  )
}
