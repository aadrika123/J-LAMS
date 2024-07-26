-- CreateTable
CREATE TABLE "asset_fieldOfficer_req" (
    "id" SERIAL NOT NULL,
    "assetId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_fieldOfficer_req_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "asset_fieldOfficer_req" ADD CONSTRAINT "asset_fieldOfficer_req_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
