/*
  Warnings:

  - You are about to drop the column `image` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "asset_fieldOfficer_req" DROP COLUMN "image",
ADD COLUMN     "image_five" TEXT,
ADD COLUMN     "image_four" TEXT,
ADD COLUMN     "image_one" TEXT,
ADD COLUMN     "image_three" TEXT,
ADD COLUMN     "image_two" TEXT;
