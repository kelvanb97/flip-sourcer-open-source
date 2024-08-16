/*
  Warnings:

  - You are about to drop the column `retailerInfoId` on the `RetailerProductIndex` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId]` on the table `RetailerInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RetailerProductIndex_retailerInfoId_key";

-- AlterTable
ALTER TABLE "RetailerInfo" ADD COLUMN     "productId" INTEGER;

-- AlterTable
ALTER TABLE "RetailerProductIndex" DROP COLUMN "retailerInfoId";

-- CreateIndex
CREATE UNIQUE INDEX "RetailerInfo_productId_key" ON "RetailerInfo"("productId");
