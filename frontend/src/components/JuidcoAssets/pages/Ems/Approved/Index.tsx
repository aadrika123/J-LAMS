"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Building,
  MapPin,
  Lightbulb,
  Waves,
  Cog,
  Landmark,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Calendar,
  DollarSign,
} from "lucide-react"
import { toast } from "react-hot-toast"
import AssetTypeSelector from "@/components/Modals/asset-type-selector"

interface Asset {
  id: string
  assetId: string
  type: string
  subCategory: string
  location: string
  wardNo: string
  status: "Active" | "Draft" | "Under Review" | "Approved"
  acquisitionDate: string
  totalCost: number
  khataNo: string
  plotNo: string
  createdDate: string
}

interface AssetDashboardProps {
  onAddNewAsset: (assetType: string) => void
}

export default function Approved({ onAddNewAsset }: AssetDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAssetTypeModal, setShowAssetTypeModal] = useState(false)

  // Mock data for assets
  const mockAssets: Asset[] = [
    {
      id: "1",
      assetId: "AST001",
      type: "Building",
      subCategory: "Hospital",
      location: "Central Market",
      wardNo: "12",
      status: "Active",
      acquisitionDate: "2023-01-15",
      totalCost: 2500000,
      khataNo: "KH001",
      plotNo: "P001",
      createdDate: "2024-01-15",
    },
    {
      id: "2",
      assetId: "AST002",
      type: "Land",
      subCategory: "Vacant Land",
      location: "North Zone",
      wardNo: "8",
      status: "Draft",
      acquisitionDate: "2023-03-20",
      totalCost: 1800000,
      khataNo: "KH002",
      plotNo: "P002",
      createdDate: "2024-01-20",
    },
    {
      id: "3",
      assetId: "AST003",
      type: "Public Lighting",
      subCategory: "Street Lights",
      location: "Main Road",
      wardNo: "15",
      status: "Approved",
      acquisitionDate: "2023-05-10",
      totalCost: 450000,
      khataNo: "KH003",
      plotNo: "P003",
      createdDate: "2024-02-01",
    },
    {
      id: "4",
      assetId: "AST004",
      type: "Heritage",
      subCategory: "Monument",
      location: "City Center",
      wardNo: "5",
      status: "Under Review",
      acquisitionDate: "2023-07-25",
      totalCost: 3200000,
      khataNo: "KH004",
      plotNo: "P004",
      createdDate: "2024-02-10",
    },
    {
      id: "5",
      assetId: "AST005",
      type: "Lakes & Ponds",
      subCategory: "Public Lake",
      location: "East Park",
      wardNo: "22",
      status: "Active",
      acquisitionDate: "2023-09-12",
      totalCost: 1200000,
      khataNo: "KH005",
      plotNo: "P005",
      createdDate: "2024-02-15",
    },
    {
      id: "6",
      assetId: "AST006",
      type: "Plant & Machinery",
      subCategory: "Construction Equipment",
      location: "Municipal Depot",
      wardNo: "18",
      status: "Active",
      acquisitionDate: "2023-11-08",
      totalCost: 850000,
      khataNo: "KH006",
      plotNo: "P006",
      createdDate: "2024-02-20",
    },
  ]

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "Building":
        return <Building className="h-4 w-4 text-blue-600" />
      case "Land":
        return <MapPin className="h-4 w-4 text-green-600" />
      case "Public Lighting":
        return <Lightbulb className="h-4 w-4 text-yellow-600" />
      case "Heritage":
        return <Landmark className="h-4 w-4 text-purple-600" />
      case "Lakes & Ponds":
        return <Waves className="h-4 w-4 text-cyan-600" />
      case "Plant & Machinery":
        return <Cog className="h-4 w-4 text-red-600" />
      default:
        return <Building className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: "bg-green-100 text-green-800 border-green-200",
      Draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Under Review": "bg-blue-100 text-blue-800 border-blue-200",
      Approved: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return <Badge className={`${statusConfig[status as keyof typeof statusConfig]} border`}>{status}</Badge>
  }

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesSearch =
      asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.khataNo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || asset.type === filterType
    const matchesStatus = filterStatus === "all" || asset.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const totalAssets = mockAssets.length
  const activeAssets = mockAssets.filter((asset) => asset.status === "Active").length
  const draftAssets = mockAssets.filter((asset) => asset.status === "Draft").length
  const totalValue = mockAssets.reduce((sum, asset) => sum + asset.totalCost, 0)

  const handleViewAsset = (assetId: string) => {
    toast.success(`Viewing asset ${assetId}`)
  }

  const handleEditAsset = (assetId: string) => {
    toast.success(`Editing asset ${assetId}`)
  }

  const handleDownloadReport = () => {
    toast.success("Downloading asset report...")
  }

  const handleAddNewAssetClick = () => {
    setShowAssetTypeModal(true)
  }

  const handleCloseModal = () => {
    setShowAssetTypeModal(false)
  }

  const handleSelectAssetType = (assetType: string) => {
    setShowAssetTypeModal(false)
    onAddNewAsset(assetType)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Asset Management Dashboard</h1>
              <p className="text-sm text-gray-600">Municipal Asset Registration & Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleDownloadReport}
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </Button>
              <Button
                onClick={handleAddNewAssetClick}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2 text-white"
              >
                <Plus className="h-4 w-4" />
                <span className="text-white"> Add New Asset</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssets}</div>
              <p className="text-xs text-muted-foreground">Registered assets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
              <Badge className="bg-green-100 text-green-800 border-green-200 border h-4 w-4 p-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAssets}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Assets</CardTitle>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border h-4 w-4 p-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftAssets}</div>
              <p className="text-xs text-muted-foreground">Pending completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(totalValue / 10000000).toFixed(1)}Cr</div>
              <p className="text-xs text-muted-foreground">Asset portfolio value</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Building">Building</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Public Lighting">Public Lighting</SelectItem>
                  <SelectItem value="Heritage">Heritage</SelectItem>
                  <SelectItem value="Lakes & Ponds">Lakes & Ponds</SelectItem>
                  <SelectItem value="Plant & Machinery">Plant & Machinery</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("all")
                  setFilterStatus("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assets Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Asset Registry ({filteredAssets.length} assets)</span>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sub-Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Acquisition Date</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {getAssetIcon(asset.type)}
                          <span>{asset.assetId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{asset.type}</TableCell>
                      <TableCell>{asset.subCategory}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Ward {asset.wardNo}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell>{new Date(asset.acquisitionDate).toLocaleDateString()}</TableCell>
                      <TableCell>₹{asset.totalCost.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewAsset(asset.assetId)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAsset(asset.assetId)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredAssets.length === 0 && (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterType !== "all" || filterStatus !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : "Get started by adding your first asset."}
                </p>
                <Button onClick={handleAddNewAssetClick} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Asset
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <AssetTypeSelector
        isOpen={showAssetTypeModal}
        onClose={handleCloseModal}
        onSelectAssetType={handleSelectAssetType}
      />
    </div>
  )
}
