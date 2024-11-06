/*
  Warnings:

  - You are about to drop the `circle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "circle";

-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "ulb_id" INTEGER NOT NULL,
    "building_name" TEXT NOT NULL,
    "address" TEXT,
    "is_active" BOOLEAN,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "location_location_key" ON "location"("location");
