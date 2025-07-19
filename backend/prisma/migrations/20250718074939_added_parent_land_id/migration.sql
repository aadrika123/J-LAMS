-- AlterTable
ALTER TABLE "assets_list" ADD COLUMN     "parent_land_id" INTEGER;

-- AddForeignKey
ALTER TABLE "assets_list" ADD CONSTRAINT "assets_list_parent_land_id_fkey" FOREIGN KEY ("parent_land_id") REFERENCES "assets_list"("id") ON DELETE SET NULL ON UPDATE CASCADE;
