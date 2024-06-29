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
    "status" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_list_pkey" PRIMARY KEY ("id")
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
    "status" INTEGER DEFAULT 0,
    "assetId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_list_change_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_update_req" (
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
    "status" INTEGER DEFAULT 0,
    "assetId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_update_req_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assets_list_change_log" ADD CONSTRAINT "assets_list_change_log_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_update_req" ADD CONSTRAINT "asset_update_req_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
