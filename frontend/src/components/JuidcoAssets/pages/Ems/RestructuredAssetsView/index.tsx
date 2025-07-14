"use client"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useQuery } from "@tanstack/react-query"
import { useReactToPrint } from "react-to-print"
import axios from "@/lib/axiosConfig"
import { ASSETS } from "@/utils/api/urls"
import { ArrowLeft, Download, Building, Calendar, Home, CheckCircle, AlertCircle, Clock, X, Ruler } from "lucide-react"

const RestructuredAssetsView = ({ id }: { id: number }) => {
  const [ulbId, setUlbId] = useState<string>("")
  const [ulbName, setUlbName] = useState<string>("")
  const [role, setRole] = useState("")
  const [datas, setData] = useState<any>()
  const [datass, setDatas] = useState<any>()

  const componentRef = useRef<HTMLDivElement | null>(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @media print {
        @page {
          size: A4;
          margin: 10mm;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 5px;
          font-size: 10px;
        }
        tr {
          page-break-inside: avoid;
        }
        h1, h2, h3, h4, h5, h6 {
          font-size: 14px;
        }
      }
    `,
  })

  const getStatusBadge = (statusValue: number) => {
    switch (statusValue) {
      case 2:
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white py-2">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved by Admin
          </Badge>
        )
      case 1:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white py-2">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved by Field Officer
          </Badge>
        )
      case 0:
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white py-2">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case -1:
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white py-2">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      case 3:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white py-2">
            <AlertCircle className="w-3 h-3 mr-1" />
            Sent back by Field Officer
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown Status</Badge>
    }
  }

  const fetchData = async () => {
    try {
      const res = await axios({
        url: `${ASSETS.LIST.getById}?id=${id}`,
        method: "GET",
      })
      return res.data?.data || {}
    } catch (error) {
      console.error("Error fetching data:", error)
      return {}
    }
  }

  const fetchFieldOfficerData = async () => {
    try {
      const res = await axios({
        url: `${ASSETS.LIST.getAllData}&id=${id}`,
        method: "GET",
      })
      setData(res.data?.data)
      return res.data?.data
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const fetchAdminData = async () => {
    try {
      const res = await axios({
        url: `${ASSETS.LIST.updateMany}&id=${id}`,
        method: "GET",
      })
      setDatas(res.data?.data)
      return res.data?.data
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    fetchFieldOfficerData()
    fetchAdminData()
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user_details")
      const user_details = JSON.parse(data as string)
      setRole(user_details?.user_type)
      setUlbId(user_details?.ulb_id || "")
    }
  }, [])

  useEffect(() => {
    const fetchUlbData = async (ulbId: any) => {
      try {
        const res = await axios({
          url: `${ASSETS.LIST.getAll}?id=${ulbId}`,
          method: "GET",
        })
        const ulbName = res.data?.data?.data[0]?.ulb_name || "not found"
        setUlbName(ulbName)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    if (ulbId) {
      fetchUlbData(ulbId)
    }
  }, [ulbId])

  const {
    isLoading,
    error,
    data = {},
  } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchData,
    staleTime: 1000,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) return <div className="text-red-500 text-center">Error: {error.message}</div>

  const renderDocument = (docUrl: string, altText: string) => {
    if (!docUrl) {
      return <p className="text-gray-500 text-sm">No document found</p>
    }

    if (docUrl.endsWith(".pdf")) {
      return <iframe src={docUrl} className="w-full h-32 border rounded" title={altText} />
    } else {
      return <img src={docUrl || "/placeholder.svg"} alt={altText} className="w-24 h-24 object-cover rounded border" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.history.back()} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
                <p className="text-sm text-gray-500">View asset information</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handlePrint} className="flex items-center space-x-2 bg-transparent">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </Button>

              {data?.data?.status !== undefined && (
                <div className="flex items-center space-x-3">{getStatusBadge(data?.data?.status)}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="overflow-y-auto max-h-[calc(135vh-200px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={componentRef}>
          <div className="space-y-8">
            {/* Asset & Land Address Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  <span>Asset & Land Address Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">ULB Name</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">{ulbName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Ward No.</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">{data?.data?.ward_no || "No data found"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Asset Type</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.type_of_assets || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">{data?.data?.address || "No data found"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span>Asset Order Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Order Number</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.order_no || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Order Date</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.order_date || "No data found"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  <span>Asset Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Asset Category Name</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.type_of_assets || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Asset Sub-Category Name</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.asset_sub_category_name || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Asset Category Type</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.assets_category_type || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Area</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">{data?.data?.area || "No data found"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Khata No.</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.khata_no || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Plot No.</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">{data?.data?.plot_no || "No data found"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Type of Land</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.type_of_land || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Date of Acquisition</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.acquisition || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Mode of Acquisition</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.mode_of_acquisition || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">From Whom Acquired</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.from_whom_acquired || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Location</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.location || "No data found"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Building Approval Plan No.</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {data?.data?.building_approval_plan || "No data found"}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2 border-dashed">
                    <CardHeader>
                      <CardTitle className="text-sm">Ownership Document</CardTitle>
                    </CardHeader>
                    <CardContent>{renderDocument(data?.data?.ownership_doc, "Ownership Document")}</CardContent>
                  </Card>

                  <Card className="border-2 border-dashed">
                    <CardHeader>
                      <CardTitle className="text-sm">Blueprint</CardTitle>
                    </CardHeader>
                    <CardContent>{renderDocument(data?.data?.blue_print, "Blueprint")}</CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Floor Details */}
            {data?.data?.type_of_assets === "Building" && data?.data?.floorData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-indigo-600" />
                    <span>Floor Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data?.data?.floorData?.map((floor: any) =>
                      floor.details?.map((detail: any) => (
                        <Card key={detail.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary">Floor {floor.floor}</Badge>
                              <Badge variant={detail.type === "Commercial" ? "default" : "outline"}>
                                {detail.type}
                              </Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Type of Plot:</span>
                                <span className="font-medium">{detail.type_of_plot || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Plot:</span>
                                <span className="font-medium">{detail.index || "N/A"}</span>
                              </div>
                              <div className="bg-white/70 rounded-lg p-2">
                                <div className="flex items-center space-x-1 mb-1">
                                  <Ruler className="w-3 h-3 text-blue-600" />
                                  <span className="text-xs font-medium text-blue-600">Dimensions</span>
                                </div>
                                <div className="text-xs">
                                  {detail.length || "N/A"}×{detail.breadth || "N/A"}×{detail.height || "N/A"} m
                                </div>
                              </div>
                              <div className="pt-2 border-t">
                                <div className="text-gray-600 text-xs">Owner:</div>
                                <div className="font-medium">{detail.name || "N/A"}</div>
                              </div>
                              <div>
                                <div className="text-gray-600 text-xs">Property:</div>
                                <div className="font-medium">{detail.property_name || "N/A"}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Role-based Review Sections */}
            {(role === "Municipal" || role === "Admin") && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <span className="text-orange-600">Field Officer Review</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Latitude</Label>
                      <p className="text-lg font-semibold text-blue-600 mt-1">
                        {datas?.data?.[0]?.lat || "Location Not Provided"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Longitude</Label>
                      <p className="text-lg font-semibold text-blue-600 mt-1">
                        {datas?.data?.[0]?.long || "Location Not Provided"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Remarks</Label>
                      <p className="text-lg font-semibold text-blue-600 mt-1">
                        {datas?.data?.[0]?.remarks || "No Remarks"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500 mb-4 block">Uploaded Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {[
                        { key: "image_one", label: "Image 1" },
                        { key: "image_two", label: "Image 2" },
                        { key: "image_three", label: "Image 3" },
                        { key: "image_four", label: "Image 4" },
                        { key: "image_five", label: "Image 5" },
                      ].map(({ key, label }) => (
                        <Card key={key} className="border-2 border-dashed">
                          <CardContent className="p-3">
                            <Label className="text-xs text-gray-500 mb-2 block">{label}</Label>
                            {renderDocument(datas?.data?.[0]?.[key], label)}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {(role === "Municipal" || role === "Admin") && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">Admin Review</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Remarks</Label>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {datass?.data?.[0]?.checker_remarks || "Pending for Verification"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {role === "Field Officer" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <span className="text-orange-600">Field Officer Review</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Latitude</Label>
                      <p className="text-lg font-semibold text-blue-600 mt-1">
                        {datas?.data?.[0]?.lat || "Pending for Verification"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Longitude</Label>
                      <p className="text-lg font-semibold text-blue-600 mt-1">
                        {datas?.data?.[0]?.long || "Pending for Verification"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Remarks</Label>
                      <p className="text-lg font-semibold text-blue-600 mt-1">
                        {datas?.data?.[0]?.remarks || "No Review Given"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500 mb-4 block">Uploaded Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {[
                        { key: "image_one", label: "Image 1" },
                        { key: "image_two", label: "Image 2" },
                        { key: "image_three", label: "Image 3" },
                        { key: "image_four", label: "Image 4" },
                        { key: "image_five", label: "Image 5" },
                      ].map(({ key, label }) => (
                        <Card key={key} className="border-2 border-dashed">
                          <CardContent className="p-3">
                            <Label className="text-xs text-gray-500 mb-2 block">{label}</Label>
                            {renderDocument(datas?.data?.[0]?.[key], label)}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestructuredAssetsView
