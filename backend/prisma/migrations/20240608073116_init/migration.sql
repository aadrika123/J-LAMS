-- AlterTable
ALTER TABLE "assets_list" ADD COLUMN     "area" TEXT,
ADD COLUMN     "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "order_no" TEXT,
ADD COLUMN     "type_of_land" TEXT;
