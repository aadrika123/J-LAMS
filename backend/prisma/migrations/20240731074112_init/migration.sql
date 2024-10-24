-- CreateTable
CREATE TABLE "assets_list" (
    "id" SERIAL NOT NULL,
    "type_of_assets" TEXT,
    "asset_sub_category_name" TEXT,
    "assets_category_type" TEXT,
    "khata_no" TEXT,
    "plot_no" TEXT,
    "ward_no" TEXT,
    "address" TEXT,
    "building_name" TEXT,
    "depreciation_method" TEXT,
    "apreciation_method" TEXT,
    "blue_print" TEXT,
    "ownership_doc" TEXT,
    "type_of_land" TEXT,
    "area" TEXT,
    "order_no" TEXT,
    "order_date" TEXT,
    "acquisition" TEXT,
    "from_whom_acquired" TEXT,
    "mode_of_acquisition" TEXT,
    "role" TEXT,
    "no_of_floors" INTEGER,
    "status" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "floorData" (
    "id" SERIAL NOT NULL,
    "floor" INTEGER,
    "plotCount" INTEGER,
    "type" TEXT,
    "assetsListId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "floorData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "details" (
    "id" SERIAL NOT NULL,
    "index" INTEGER,
    "type" TEXT,
    "length" TEXT,
    "breadth" TEXT,
    "height" TEXT,
    "name" TEXT,
    "property_name" TEXT,
    "type_of_plot" TEXT,
    "floorDataId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets_list_change_log" (
    "id" SERIAL NOT NULL,
    "type_of_assets" TEXT,
    "asset_sub_category_name" TEXT,
    "assets_category_type" TEXT,
    "khata_no" TEXT,
    "plot_no" TEXT,
    "ward_no" TEXT,
    "address" TEXT,
    "depreciation_method" TEXT,
    "apreciation_method" TEXT,
    "blue_print" TEXT,
    "ownership_doc" TEXT,
    "type_of_land" TEXT,
    "area" TEXT,
    "order_no" TEXT,
    "order_date" TEXT,
    "acquisition" TEXT,
    "from_whom_acquired" TEXT,
    "mode_of_acquisition" TEXT,
    "role" TEXT,
    "status" INTEGER DEFAULT 0,
    "assetId" INTEGER NOT NULL,
    "floorDataId" INTEGER NOT NULL,
    "detailsId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_list_change_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_checker_req" (
    "id" SERIAL NOT NULL,
    "assetId" INTEGER NOT NULL,
    "checker_remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_checker_req_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_fieldOfficer_req" (
    "id" SERIAL NOT NULL,
    "long" TEXT,
    "lat" TEXT,
    "remarks" TEXT,
    "image" TEXT,
    "assetId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_fieldOfficer_req_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assets_list_order_no_key" ON "assets_list"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "asset_checker_req_assetId_key" ON "asset_checker_req"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "asset_fieldOfficer_req_assetId_key" ON "asset_fieldOfficer_req"("assetId");

-- AddForeignKey
ALTER TABLE "floorData" ADD CONSTRAINT "floorData_assetsListId_fkey" FOREIGN KEY ("assetsListId") REFERENCES "assets_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "details" ADD CONSTRAINT "details_floorDataId_fkey" FOREIGN KEY ("floorDataId") REFERENCES "floorData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets_list_change_log" ADD CONSTRAINT "assets_list_change_log_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets_list_change_log" ADD CONSTRAINT "assets_list_change_log_floorDataId_fkey" FOREIGN KEY ("floorDataId") REFERENCES "floorData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets_list_change_log" ADD CONSTRAINT "assets_list_change_log_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_checker_req" ADD CONSTRAINT "asset_checker_req_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset_fieldOfficer_req"("assetId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_fieldOfficer_req" ADD CONSTRAINT "asset_fieldOfficer_req_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
