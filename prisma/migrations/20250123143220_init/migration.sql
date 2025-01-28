/*
  Warnings:

  - You are about to drop the `PromoCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PromoCode" DROP CONSTRAINT "PromoCode_companyId_fkey";

-- DropForeignKey
ALTER TABLE "PromoCode" DROP CONSTRAINT "PromoCode_eventId_fkey";

-- DropTable
DROP TABLE "PromoCode";

-- CreateTable
CREATE TABLE "PromoCodes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "discountPercent" DOUBLE PRECISION NOT NULL,
    "maxUsages" INTEGER,
    "usages" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "eventId" INTEGER,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "PromoCodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PromoCodes" ADD CONSTRAINT "PromoCodes_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoCodes" ADD CONSTRAINT "PromoCodes_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
