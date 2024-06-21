/*
  Warnings:

  - A unique constraint covering the columns `[khata_no]` on the table `assets_list` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "assets_list_khata_no_key" ON "assets_list"("khata_no");
