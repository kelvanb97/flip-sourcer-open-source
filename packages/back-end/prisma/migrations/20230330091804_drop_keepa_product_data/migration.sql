/*
  Warnings:

  - You are about to drop the column `keepaDataId` on the `AmazonInfo` table. All the data in the column will be lost.
  - You are about to drop the `KeepaProductData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AmazonInfo" DROP CONSTRAINT "AmazonInfo_keepaDataId_fkey";

-- DropIndex
DROP INDEX "AmazonInfo_keepaDataId_key";

-- AlterTable
ALTER TABLE "AmazonInfo" DROP COLUMN "keepaDataId",
ADD COLUMN     "amazonHistorical" JSONB,
ADD COLUMN     "avg180" DOUBLE PRECISION,
ADD COLUMN     "avg30" DOUBLE PRECISION,
ADD COLUMN     "avg90" DOUBLE PRECISION,
ADD COLUMN     "chartHistoricalDatum" JSONB,
ADD COLUMN     "newHistorical" JSONB,
ADD COLUMN     "salesRankDrops180" INTEGER,
ADD COLUMN     "salesRankDrops30" INTEGER,
ADD COLUMN     "salesRankDrops90" INTEGER,
ADD COLUMN     "salesRankHistorical" JSONB,
ADD COLUMN     "usedHistorical" JSONB;

-- DropTable
DROP TABLE "KeepaProductData";
