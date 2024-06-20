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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_list_pkey" PRIMARY KEY ("id")
);
