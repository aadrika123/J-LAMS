/*
  Warnings:

  - You are about to drop the column `acquisition` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `apreciation_method` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `area` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `asset_sub_category_name` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `assets_category_type` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `blue_print` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `depreciation_method` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `from_whom_acquired` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `khata_no` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `mode_of_acquisition` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `order_date` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `order_no` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `ownership_doc` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `plot_no` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `type_of_assets` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `type_of_land` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.
  - You are about to drop the column `ward_no` on the `asset_fieldOfficer_req` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "asset_fieldOfficer_req" DROP COLUMN "acquisition",
DROP COLUMN "address",
DROP COLUMN "apreciation_method",
DROP COLUMN "area",
DROP COLUMN "asset_sub_category_name",
DROP COLUMN "assets_category_type",
DROP COLUMN "blue_print",
DROP COLUMN "depreciation_method",
DROP COLUMN "from_whom_acquired",
DROP COLUMN "khata_no",
DROP COLUMN "mode_of_acquisition",
DROP COLUMN "order_date",
DROP COLUMN "order_no",
DROP COLUMN "ownership_doc",
DROP COLUMN "plot_no",
DROP COLUMN "type_of_assets",
DROP COLUMN "type_of_land",
DROP COLUMN "ward_no";
