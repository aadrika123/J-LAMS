/*
  Warnings:

  - A unique constraint covering the columns `[location]` on the table `circle` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "circle_location_key" ON "circle"("location");
