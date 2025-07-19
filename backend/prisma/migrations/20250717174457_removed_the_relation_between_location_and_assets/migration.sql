/*
  Warnings:

  - You are about to drop the column `location_id` on the `assets_list` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "assets_list" DROP CONSTRAINT "assets_list_location_id_fkey";

-- AlterTable
ALTER TABLE "assets_list" DROP COLUMN "location_id";
