/*
  Warnings:

  - You are about to drop the column `createtByCompanyId` on the `Survey` table. All the data in the column will be lost.
  - Added the required column `createdByCompanyId` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "createtByCompanyId",
ADD COLUMN     "createdByCompanyId" INTEGER NOT NULL;
