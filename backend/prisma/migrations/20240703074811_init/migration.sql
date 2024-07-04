/*
  Warnings:

  - A unique constraint covering the columns `[order_no]` on the table `asset_update_req` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_no]` on the table `assets_list` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_no]` on the table `assets_list_change_log` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "asset_update_req_order_no_key" ON "asset_update_req"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "assets_list_order_no_key" ON "assets_list"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "assets_list_change_log_order_no_key" ON "assets_list_change_log"("order_no");
