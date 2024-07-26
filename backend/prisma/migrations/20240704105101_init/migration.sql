/*
  Warnings:

  - You are about to drop the column `status` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assetId]` on the table `asset_fieldOfficer_req` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "asset_fieldOfficer_req" DROP COLUMN "status";

-- CreateIndex
CREATE UNIQUE INDEX "asset_fieldOfficer_req_assetId_key" ON "asset_fieldOfficer_req"("assetId");
