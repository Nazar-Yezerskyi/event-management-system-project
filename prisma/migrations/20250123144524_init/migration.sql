/*
  Warnings:

  - Added the required column `description` to the `PromoCodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromoCodes" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "minOrderPrice" INTEGER;
