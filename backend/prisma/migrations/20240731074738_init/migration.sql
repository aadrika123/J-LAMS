/*
  Warnings:

  - You are about to drop the column `detailsId` on the `assets_list_change_log` table. All the data in the column will be lost.
  - You are about to drop the column `no_of_floors` on the `assets_list_change_log` table. All the data in the column will be lost.
  - You are about to drop the `_assets_list_change_logTofloorData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_assets_list_change_logTofloorData" DROP CONSTRAINT "_assets_list_change_logTofloorData_A_fkey";

-- DropForeignKey
ALTER TABLE "_assets_list_change_logTofloorData" DROP CONSTRAINT "_assets_list_change_logTofloorData_B_fkey";

-- DropForeignKey
ALTER TABLE "assets_list_change_log" DROP CONSTRAINT "assets_list_change_log_detailsId_fkey";

-- AlterTable
ALTER TABLE "assets_list_change_log" DROP COLUMN "detailsId",
DROP COLUMN "no_of_floors";

-- DropTable
DROP TABLE "_assets_list_change_logTofloorData";
