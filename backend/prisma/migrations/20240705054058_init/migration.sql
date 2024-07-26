-- DropForeignKey
ALTER TABLE "asset_checker_req" DROP CONSTRAINT "asset_checker_req_assetId_fkey";

-- AddForeignKey
ALTER TABLE "asset_checker_req" ADD CONSTRAINT "asset_checker_req_id_fkey" FOREIGN KEY ("id") REFERENCES "asset_fieldOfficer_req"("assetId") ON DELETE RESTRICT ON UPDATE CASCADE;
