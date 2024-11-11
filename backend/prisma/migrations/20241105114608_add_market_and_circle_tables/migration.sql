/*
  Warnings:

  - You are about to drop the column `circle_name` on the `circle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "circle" DROP COLUMN "circle_name",
ADD COLUMN     "location" TEXT;
