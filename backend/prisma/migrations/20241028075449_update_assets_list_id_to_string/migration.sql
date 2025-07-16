/*
  Warnings:

  - The primary key for the `assets_list` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "asset_checker_req" DROP CONSTRAINT "asset_checker_req_assetId_fkey";

-- DropForeignKey
ALTER TABLE "asset_fieldOfficer_req" DROP CONSTRAINT "asset_fieldOfficer_req_assetId_fkey";

-- DropForeignKey
ALTER TABLE "assets_list_change_log" DROP CONSTRAINT "assets_list_change_log_assetId_fkey";

-- DropForeignKey
ALTER TABLE "floorData" DROP CONSTRAINT "floorData_assetsListId_fkey";

-- AlterTable
ALTER TABLE "asset_checker_req" ALTER COLUMN "assetId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "asset_fieldOfficer_req" ALTER COLUMN "assetId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "assets_list" DROP CONSTRAINT "assets_list_pkey",
ADD COLUMN     "location" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "assets_list_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "assets_list_id_seq";

-- AlterTable
ALTER TABLE "assets_list_change_log" ALTER COLUMN "assetId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "floorData" ALTER COLUMN "assetsListId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "floorData" ADD CONSTRAINT "floorData_assetsListId_fkey" FOREIGN KEY ("assetsListId") REFERENCES "assets_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets_list_change_log" ADD CONSTRAINT "assets_list_change_log_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_checker_req" ADD CONSTRAINT "asset_checker_req_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset_fieldOfficer_req"("assetId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_fieldOfficer_req" ADD CONSTRAINT "asset_fieldOfficer_req_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
