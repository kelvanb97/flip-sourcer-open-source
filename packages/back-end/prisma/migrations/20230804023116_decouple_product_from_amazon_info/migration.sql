/*
  Warnings:

  - You are about to drop the column `productId` on the `AmazonInfo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_amazonInfoId_fkey";

-- DropIndex
DROP INDEX "AmazonInfo_productId_key";

-- DropIndex
DROP INDEX "Product_amazonInfoId_key";

-- AlterTable
ALTER TABLE "AmazonInfo" DROP COLUMN "productId";
