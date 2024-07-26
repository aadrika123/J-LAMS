/*
  Warnings:

  - A unique constraint covering the columns `[order_no]` on the table `assets_list` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "assets_list_order_no_key" ON "assets_list"("order_no");
