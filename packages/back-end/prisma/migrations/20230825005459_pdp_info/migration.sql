/*
  Warnings:

  - You are about to drop the column `scraperApiResult` on the `RetailerProductIndex` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RetailerProductIndex" DROP COLUMN "scraperApiResult",
ADD COLUMN     "pdpInfo" JSONB NOT NULL DEFAULT '{}';
