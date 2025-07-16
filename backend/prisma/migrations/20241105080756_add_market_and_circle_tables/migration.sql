/*
  Warnings:

  - You are about to drop the `Circle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Market` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Circle";

-- DropTable
DROP TABLE "Market";

-- CreateTable
CREATE TABLE "market" (
    "id" SERIAL NOT NULL,
    "circle_id" INTEGER NOT NULL,
    "market_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "shop_counter" INTEGER NOT NULL,
    "toll_counter" INTEGER NOT NULL,
    "ulb_id" INTEGER NOT NULL,

    CONSTRAINT "market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circle" (
    "id" SERIAL NOT NULL,
    "circle_name" TEXT NOT NULL,
    "ulb_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "circle_pkey" PRIMARY KEY ("id")
);
