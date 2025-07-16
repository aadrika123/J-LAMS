-- CreateTable
CREATE TABLE "Market" (
    "id" SERIAL NOT NULL,
    "circle_id" INTEGER NOT NULL,
    "market_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "shop_counter" INTEGER NOT NULL,
    "toll_counter" INTEGER NOT NULL,
    "ulb_id" INTEGER NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Circle" (
    "id" SERIAL NOT NULL,
    "circle_name" TEXT NOT NULL,
    "ulb_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Circle_pkey" PRIMARY KEY ("id")
);
