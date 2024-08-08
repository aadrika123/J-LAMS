/*
  Warnings:

  - You are about to drop the column `floorDataId` on the `assets_list_change_log` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "assets_list_change_log" DROP CONSTRAINT "assets_list_change_log_floorDataId_fkey";

-- AlterTable
ALTER TABLE "assets_list_change_log" DROP COLUMN "floorDataId",
ADD COLUMN     "no_of_floors" INTEGER;

-- CreateTable
CREATE TABLE "_assets_list_change_logTofloorData" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_assets_list_change_logTofloorData_AB_unique" ON "_assets_list_change_logTofloorData"("A", "B");

-- CreateIndex
CREATE INDEX "_assets_list_change_logTofloorData_B_index" ON "_assets_list_change_logTofloorData"("B");

-- AddForeignKey
ALTER TABLE "_assets_list_change_logTofloorData" ADD CONSTRAINT "_assets_list_change_logTofloorData_A_fkey" FOREIGN KEY ("A") REFERENCES "assets_list_change_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_assets_list_change_logTofloorData" ADD CONSTRAINT "_assets_list_change_logTofloorData_B_fkey" FOREIGN KEY ("B") REFERENCES "floorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
