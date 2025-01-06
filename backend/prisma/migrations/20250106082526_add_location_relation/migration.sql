-- AlterTable
ALTER TABLE "assets_list" ADD COLUMN     "location_id" INTEGER NOT NULL DEFAULT 2;

-- AddForeignKey
ALTER TABLE "assets_list" ADD CONSTRAINT "assets_list_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
