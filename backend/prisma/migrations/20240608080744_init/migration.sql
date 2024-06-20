-- AlterTable
ALTER TABLE "assets_list" ALTER COLUMN "order_date" DROP NOT NULL,
ALTER COLUMN "order_date" DROP DEFAULT,
ALTER COLUMN "order_date" SET DATA TYPE TEXT;
