/*
  Warnings:

  - You are about to drop the `asset_update_req` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "asset_update_req" DROP CONSTRAINT "asset_update_req_assetId_fkey";

-- DropTable
DROP TABLE "asset_update_req";

-- CreateTable
CREATE TABLE "asset_checker_req" (
    "id" SERIAL NOT NULL,
    "assetId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_checker_req_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "asset_checker_req_assetId_key" ON "asset_checker_req"("assetId");

-- AddForeignKey
ALTER TABLE "asset_checker_req" ADD CONSTRAINT "asset_checker_req_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset_fieldOfficer_req"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
