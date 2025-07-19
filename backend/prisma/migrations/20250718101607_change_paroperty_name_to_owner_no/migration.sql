/*
  Warnings:

  - You are about to drop the column `property_name` on the `details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "details" DROP COLUMN "property_name",
ADD COLUMN     "owner_name" TEXT;
