/*
  Warnings:

  - You are about to drop the column `amazonHistorical` on the `AmazonInfo` table. All the data in the column will be lost.
  - You are about to drop the column `newHistorical` on the `AmazonInfo` table. All the data in the column will be lost.
  - You are about to drop the column `salesRankHistorical` on the `AmazonInfo` table. All the data in the column will be lost.
  - You are about to drop the column `usedHistorical` on the `AmazonInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AmazonInfo" DROP COLUMN "amazonHistorical",
DROP COLUMN "newHistorical",
DROP COLUMN "salesRankHistorical",
DROP COLUMN "usedHistorical";
