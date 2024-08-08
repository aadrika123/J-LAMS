-- DropForeignKey
ALTER TABLE "details" DROP CONSTRAINT "details_floorDataId_fkey";

-- DropForeignKey
ALTER TABLE "floorData" DROP CONSTRAINT "floorData_assetsListId_fkey";

-- AddForeignKey
ALTER TABLE "floorData" ADD CONSTRAINT "floorData_assetsListId_fkey" FOREIGN KEY ("assetsListId") REFERENCES "assets_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "details" ADD CONSTRAINT "details_floorDataId_fkey" FOREIGN KEY ("floorDataId") REFERENCES "floorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
