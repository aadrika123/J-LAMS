/*
  Warnings:

  - Made the column `address` on table `location` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "location_location_key";

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "address" SET NOT NULL;
