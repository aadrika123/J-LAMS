/*
  Warnings:

  - You are about to drop the column `application_no` on the `assets_list` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "assets_list_application_no_key";

-- AlterTable
ALTER TABLE "assets_list" DROP COLUMN "application_no";
