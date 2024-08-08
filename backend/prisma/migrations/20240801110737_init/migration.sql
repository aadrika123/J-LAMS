-- DropForeignKey
ALTER TABLE "asset_checker_req" DROP CONSTRAINT "asset_checker_req_assetId_fkey";

-- DropForeignKey
ALTER TABLE "assets_list_change_log" DROP CONSTRAINT "assets_list_change_log_assetId_fkey";

-- AddForeignKey
ALTER TABLE "assets_list_change_log" ADD CONSTRAINT "assets_list_change_log_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_checker_req" ADD CONSTRAINT "asset_checker_req_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset_fieldOfficer_req"("assetId") ON DELETE CASCADE ON UPDATE CASCADE;
