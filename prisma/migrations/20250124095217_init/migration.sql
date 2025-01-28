/*
  Warnings:

  - Added the required column `description` to the `Requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Requests" ADD COLUMN     "description" TEXT NOT NULL;
