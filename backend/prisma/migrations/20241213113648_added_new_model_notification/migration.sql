-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL,
    "role" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);
