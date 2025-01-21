-- AlterTable
ALTER TABLE "assets_list" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_drafted" BOOLEAN NOT NULL DEFAULT false;
