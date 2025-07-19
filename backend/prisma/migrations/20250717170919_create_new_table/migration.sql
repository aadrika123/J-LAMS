/*
  Warnings:

  - You are about to drop the column `acquisition` on the `assets_list` table. All the data in the column will be lost.
  - You are about to drop the column `apreciation_method` on the `assets_list` table. All the data in the column will be lost.
  - You are about to drop the column `asset_sub_category_name` on the `assets_list` table. All the data in the column will be lost.
  - You are about to drop the column `assets_category_type` on the `assets_list` table. All the data in the column will be lost.
  - You are about to drop the column `from_whom_acquired` on the `assets_list` table. All the data in the column will be lost.
  - You are about to drop the column `no_of_floors` on the `assets_list` table. All the data in the column will be lost.
  - You are about to drop the column `type_of_assets` on the `assets_list` table. All the data in the column will be lost.
  - The `mode_of_acquisition` column on the `assets_list` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `name` on the `details` table. All the data in the column will be lost.
  - Added the required column `asset_type` to the `assets_list` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('LAND', 'BUILDING', 'STATUTES_HERITAGE', 'PUBLIC_LIGHTING', 'LAKE_POND', 'PLANT_MACHINERY');

-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('LEASEHOLD', 'FREEHOLD');

-- CreateEnum
CREATE TYPE "RoadType" AS ENUM ('EARTHEN', 'TAR', 'CONCRETE');

-- CreateEnum
CREATE TYPE "ModeOfAcquisition" AS ENUM ('ACQUIRED', 'DONATION', 'PURCHASE', 'OTHERS');

-- AlterTable
ALTER TABLE "assets_list" DROP COLUMN "acquisition",
DROP COLUMN "apreciation_method",
DROP COLUMN "asset_sub_category_name",
DROP COLUMN "assets_category_type",
DROP COLUMN "from_whom_acquired",
DROP COLUMN "no_of_floors",
DROP COLUMN "type_of_assets",
ADD COLUMN     "accumulated_depreciation" DOUBLE PRECISION,
ADD COLUMN     "acquired_from" TEXT,
ADD COLUMN     "addition_during_year" DOUBLE PRECISION,
ADD COLUMN     "appreciation_method" TEXT,
ADD COLUMN     "asset_type" "AssetType" NOT NULL,
ADD COLUMN     "contractor_name" TEXT,
ADD COLUMN     "cost_of_acquisition" DOUBLE PRECISION,
ADD COLUMN     "current_market_value" DOUBLE PRECISION,
ADD COLUMN     "current_usage" TEXT,
ADD COLUMN     "date_of_acquisition" TIMESTAMP(3),
ADD COLUMN     "depreciation_for_year" DOUBLE PRECISION,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "financial_year" TEXT,
ADD COLUMN     "head" TEXT,
ADD COLUMN     "improvement_cost" DOUBLE PRECISION,
ADD COLUMN     "improvement_date" TIMESTAMP(3),
ADD COLUMN     "improvement_done" BOOLEAN,
ADD COLUMN     "make" TEXT,
ADD COLUMN     "number_of_lamp_posts" INTEGER,
ADD COLUMN     "ownership_type" "OwnershipType",
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "road_name" TEXT,
ADD COLUMN     "road_type" "RoadType",
ADD COLUMN     "survey_no" TEXT,
ADD COLUMN     "title_document_ref" TEXT,
ADD COLUMN     "total_cost" DOUBLE PRECISION,
ADD COLUMN     "wdv_end" DOUBLE PRECISION,
ADD COLUMN     "wdv_start" DOUBLE PRECISION,
DROP COLUMN "mode_of_acquisition",
ADD COLUMN     "mode_of_acquisition" "ModeOfAcquisition";

-- AlterTable
ALTER TABLE "details" DROP COLUMN "name",
ADD COLUMN     "property_no" TEXT;
