-- DropForeignKey
ALTER TABLE "asset_fieldOfficer_req" DROP CONSTRAINT "asset_fieldOfficer_req_assetId_fkey";

-- AddForeignKey
ALTER TABLE "asset_fieldOfficer_req" ADD CONSTRAINT "asset_fieldOfficer_req_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
