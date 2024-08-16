/*
  Warnings:

  - You are about to drop the column `retailerProductIndexId` on the `RetailerInfo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RetailerInfo" DROP CONSTRAINT "RetailerInfo_retailerProductIndexId_fkey";

-- DropIndex
DROP INDEX "RetailerInfo_retailerProductIndexId_key";

-- AlterTable
ALTER TABLE "RetailerInfo" DROP COLUMN "retailerProductIndexId";
