/*
  Warnings:

  - You are about to drop the column `numSellers` on the `AmazonInfo` table. All the data in the column will be lost.
  - You are about to drop the column `numSellersFba` on the `AmazonInfo` table. All the data in the column will be lost.
  - You are about to drop the column `numSellersFbm` on the `AmazonInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AmazonInfo" DROP COLUMN "numSellers",
DROP COLUMN "numSellersFba",
DROP COLUMN "numSellersFbm";
