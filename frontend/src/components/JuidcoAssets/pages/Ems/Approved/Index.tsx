"use client"

import { useState, useEffect } from "react"
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
  CheckCircle,
  Clock,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { toast } from "react-hot-toast"
import AssetTypeSelector from "@/components/Modals/asset-type-selector"

interface Asset {
  id: number
  assets_id: string
  asset_type: string
  khata_no: string | null
  plot_no: string | null
  ward_no: string | null
  building_name: string | null
  location: string | null
  ulb_id: number
  blue_print: string | null
  ownership_doc: string | null
  type_of_land: string | null
  area: string | null
  acquired_from: string | null
  mode_of_acquisition: string | null
  cost_of_acquisition: number | null
  ownership_type: string | null
  survey_no: string | null
  date_of_acquisition: string | null
  improvement_done: boolean | null
  improvement_date: string | null
  total_cost: number | null
  current_usage: string | null
  current_market_value: number | null
  remarks: string | null
  contractor_name: string | null
  road_name: string | null
  road_type: string | null
  financial_year: string | null
  status: number
  is_drafted: boolean
  created_at: string
  updated_at: string
  floor_data: any[]
}

interface ApiResponse {
  status: boolean
  message: string
  "meta-data": {
    apiId: string
    action: string
    version: string
  }
  data: {
    totalPages: number
    count: number
    status1Items: number
    statusMinus1Items: number
    statusPendingAssets: number
    page: number
    data: Asset[]
  }
}

interface AssetDashboardProps {
  onAddNewAsset: (assetType: string) => void
}

export default function AssetDashboard({ onAddNewAsset }: AssetDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAssetTypeModal, setShowAssetTypeModal] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [apiData, setApiData] = useState<ApiResponse["data"] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [count, setCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10) // You can make this configurable

  // Fetch assets from API
  useEffect(() => {
    fetchAssets(currentPage)
  }, [currentPage])

  const fetchAssets = async (page = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`https://jharkhandegovernance.com/auth/api/lams/v1/asset/get-all?page=${page}`)

      if (response.ok) {
        const result: ApiResponse = await response.json()
        setAssets(result.data.data)
        setApiData(result.data)
        setCurrentPage(result.data.page)
        setTotalPages(result.data.totalPages)
        setCount(result.data.count)
        toast.success("Assets loaded successfully")
      } else {
        throw new Error("Failed to fetch assets")
      }
    } catch (error) {
      console.error("Error fetching assets:", error)
      toast.error("Failed to load assets")
    } finally {
      setLoading(false)
    }
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "BUILDING":
        return <Building className="h-4 w-4 text-blue-600" />
      case "LAND":
        return <MapPin className="h-4 w-4 text-green-600" />
      case "PUBLIC_LIGHTING":
        return <Lightbulb className="h-4 w-4 text-yellow-600" />
      case "HERITAGE":
        return <Landmark className="h-4 w-4 text-purple-600" />
      case "LAKES_PONDS":
        return <Waves className="h-4 w-4 text-cyan-600" />
      case "PLANT_MACHINERY":
        return <Cog className="h-4 w-4 text-red-600" />
      default:
        return <Building className="h-4 w-4 text-gray-600" />
    }
  }

const getStatusBadge = (statusValue: number) => {
  switch (statusValue) {
    case 2:
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white h-8 min-w-[180px] justify-center">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved by Admin
        </Badge>
      )
    case 1:
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600 text-white h-8 min-w-[180px] justify-center">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved by Field Officer
        </Badge>
      )
    case 0:
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600 text-white h-8 min-w-[180px] justify-center">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    case -1:
      return (
        <Badge className="bg-red-500 hover:bg-red-600 text-white h-8 min-w-[180px] justify-center">
          <X className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      )
    case 3:
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white h-8 min-w-[180px] justify-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          Sent back by Field Officer
        </Badge>
      )
    default:
      return <Badge variant="secondary" className="h-8 min-w-[180px] justify-center">Unknown Status</Badge>
  }
}


  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.assets_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.asset_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.location && asset.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (asset.khata_no && asset.khata_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (asset.building_name && asset.building_name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = filterType === "all" || asset.asset_type === filterType
    const matchesStatus = filterStatus === "all" || asset.status.toString() === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const totalAssets = assets.length
  const activeAssets = assets.filter((asset) => asset.status === 2).length
  const pendingAssets = assets.filter((asset) => asset.status === 0).length
  const draftAssets = assets.filter((asset) => asset.is_drafted).length
  const totalValue = assets.reduce((sum, asset) => sum + (asset.total_cost || asset.cost_of_acquisition || 0), 0)

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

  const formatAssetType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getSubCategory = (asset: Asset) => {
    if (asset.asset_type === "BUILDING") {
      return asset.building_name || "Building"
    } else if (asset.asset_type === "LAND") {
      return asset.type_of_land || "Land"
    }
    return formatAssetType(asset.asset_type)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading assets...</p>
        </div>
      </div>
    )
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
                onClick={() => fetchAssets(currentPage)}
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
                <Loader2 className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
              <Button
                onClick={handleAddNewAssetClick}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2 text-white"
              >
                <Plus className="h-4 w-4" />
                <span className="text-white">Add New Asset</span>
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
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">Registered assets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAssets}</div>
              <p className="text-xs text-muted-foreground">Admin approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAssets}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Assets</CardTitle>
              <Edit className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftAssets}</div>
              <p className="text-xs text-muted-foreground">Incomplete</p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(totalValue / 10000000).toFixed(1)}Cr</div>
              <p className="text-xs text-muted-foreground">Asset portfolio value</p>
            </CardContent>
          </Card> */}
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
                  <SelectItem value="BUILDING">Building</SelectItem>
                  <SelectItem value="LAND">Land</SelectItem>
                  <SelectItem value="PUBLIC_LIGHTING">Public Lighting</SelectItem>
                  <SelectItem value="HERITAGE">Heritage</SelectItem>
                  <SelectItem value="LAKES_PONDS">Lakes & Ponds</SelectItem>
                  <SelectItem value="PLANT_MACHINERY">Plant & Machinery</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="2">Approved by Admin</SelectItem>
                  <SelectItem value="1">Approved by Field Officer</SelectItem>
                  <SelectItem value="0">Pending</SelectItem>
                  <SelectItem value="-1">Rejected</SelectItem>
                  <SelectItem value="3">Sent back by Field Officer</SelectItem>
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
              <span>
                Asset Registry
              </span>
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
                          {getAssetIcon(asset.asset_type)}
                          <span>{asset.assets_id}</span>
                          {asset.is_drafted && (
                            <Badge variant="outline" className="text-xs">
                              Draft
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatAssetType(asset.asset_type)}</TableCell>
                      <TableCell>{getSubCategory(asset)}</TableCell>
                      <TableCell>{asset.location || asset.road_name || "N/A"}</TableCell>
                      <TableCell>
                        {asset.ward_no ? <Badge variant="outline">Ward {asset.ward_no}</Badge> : "N/A"}
                      </TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell>
                        {asset.date_of_acquisition ? new Date(asset.date_of_acquisition).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>₹{(asset.total_cost || asset.cost_of_acquisition || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewAsset(asset.assets_id)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAsset(asset.assets_id)}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing page {currentPage} of {totalPages} ({apiData?.count || 0} total assets)
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {filteredAssets.length === 0 && !loading && (
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
