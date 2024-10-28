/*
  Warnings:

  - The primary key for the `assets_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `assets_list` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `assetId` on the `asset_checker_req` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `assetId` on the `asset_fieldOfficer_req` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `assetId` on the `assets_list_change_log` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `assetsListId` on the `floorData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

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
ALTER TABLE "asset_checker_req" DROP COLUMN "assetId",
ADD COLUMN     "assetId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "asset_fieldOfficer_req" DROP COLUMN "assetId",
ADD COLUMN     "assetId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "assets_list" DROP CONSTRAINT "assets_list_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "assets_list_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "assets_list_change_log" DROP COLUMN "assetId",
ADD COLUMN     "assetId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "floorData" DROP COLUMN "assetsListId",
ADD COLUMN     "assetsListId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "asset_checker_req_assetId_key" ON "asset_checker_req"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "asset_fieldOfficer_req_assetId_key" ON "asset_fieldOfficer_req"("assetId");

-- AddForeignKey
ALTER TABLE "floorData" ADD CONSTRAINT "floorData_assetsListId_fkey" FOREIGN KEY ("assetsListId") REFERENCES "assets_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets_list_change_log" ADD CONSTRAINT "assets_list_change_log_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_checker_req" ADD CONSTRAINT "asset_checker_req_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset_fieldOfficer_req"("assetId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_fieldOfficer_req" ADD CONSTRAINT "asset_fieldOfficer_req_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
