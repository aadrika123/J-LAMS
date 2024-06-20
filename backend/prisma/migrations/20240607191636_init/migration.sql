/*
  Warnings:

  - A unique constraint covering the columns `[application_no]` on the table `assets_list` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "assets_list" ADD COLUMN     "application_no" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "assets_list_application_no_key" ON "assets_list"("application_no");
