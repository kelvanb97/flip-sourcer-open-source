/*
  Warnings:

  - You are about to drop the column `lastUpdaterCallAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `locked` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `lockedBy` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updaterErrorCount` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "lastUpdaterCallAt",
DROP COLUMN "locked",
DROP COLUMN "lockedBy",
DROP COLUMN "updaterErrorCount";

-- AlterTable
ALTER TABLE "RetailerProductIndex" ADD COLUMN     "scraperApiResult" JSONB NOT NULL DEFAULT '{}';
