"use client";

import Approved from "@/components/JuidcoAssets/pages/Ems/Approved/Index";
import PageLayout from "@/components/Layouts/PageLayout";
import React from "react";
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  const handleAddNewAsset = (assetType: string) => {
    router.push(`/add-assets/${assetType}`)
  }

  return (
    <PageLayout>
      <Approved onAddNewAsset={handleAddNewAsset} />
    </PageLayout>
  )
}