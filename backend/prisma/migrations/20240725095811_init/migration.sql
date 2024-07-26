-- CreateTable
CREATE TABLE "floorData" (
    "id" SERIAL NOT NULL,
    "floor" INTEGER NOT NULL,
    "plotCount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "assetsListId" INTEGER NOT NULL,

    CONSTRAINT "floorData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "details" (
    "id" SERIAL NOT NULL,
    "index" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "length" TEXT NOT NULL,
    "breadth" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "floorDataId" INTEGER NOT NULL,

    CONSTRAINT "details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "floorData" ADD CONSTRAINT "floorData_assetsListId_fkey" FOREIGN KEY ("assetsListId") REFERENCES "assets_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "details" ADD CONSTRAINT "details_floorDataId_fkey" FOREIGN KEY ("floorDataId") REFERENCES "floorData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
