/*
  Warnings:

  - You are about to drop the column `avg180` on the `AmazonInfo` table. All the data in the column will be lost.
  - You are about to drop the column `avg30` on the `AmazonInfo` table. All the data in the column will be lost.
  - You are about to drop the column `avg90` on the `AmazonInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AmazonInfo" DROP COLUMN "avg180",
DROP COLUMN "avg30",
DROP COLUMN "avg90",
ADD COLUMN     "amazon90DayOos" DOUBLE PRECISION,
ADD COLUMN     "buyBox180DayAvg" DOUBLE PRECISION,
ADD COLUMN     "buyBox90DayAvg" DOUBLE PRECISION,
ADD COLUMN     "buyBox90DayOos" DOUBLE PRECISION,
ADD COLUMN     "buyBoxCurrent" DOUBLE PRECISION,
ADD COLUMN     "buyBoxStock" INTEGER,
ADD COLUMN     "countOfRetrievedLiveOffersFba" INTEGER,
ADD COLUMN     "countOfRetrievedLiveOffersFbm" INTEGER,
ADD COLUMN     "new180DayAvg" DOUBLE PRECISION,
ADD COLUMN     "new3rdPartyFba180DayAvg" DOUBLE PRECISION,
ADD COLUMN     "new3rdPartyFba90DayAvg" DOUBLE PRECISION,
ADD COLUMN     "new3rdPartyFbaCurrent" DOUBLE PRECISION,
ADD COLUMN     "new3rdPartyFbm180DayAvg" DOUBLE PRECISION,
ADD COLUMN     "new3rdPartyFbm90DayAvg" DOUBLE PRECISION,
ADD COLUMN     "new3rdPartyFbmCurrent" DOUBLE PRECISION,
ADD COLUMN     "new90DayAvg" DOUBLE PRECISION,
ADD COLUMN     "new90DayOos" DOUBLE PRECISION,
ADD COLUMN     "newCurrent" DOUBLE PRECISION,
ADD COLUMN     "newOfferCount" INTEGER,
ADD COLUMN     "newOfferCount180DayAvg" INTEGER,
ADD COLUMN     "newOfferCount30DayAvg" INTEGER,
ADD COLUMN     "newOfferCount90DayAvg" INTEGER,
ADD COLUMN     "reviewCount180DayAvg" INTEGER,
ADD COLUMN     "reviewCount90DayAvg" INTEGER,
ADD COLUMN     "salesRank180DayAvg" INTEGER,
ADD COLUMN     "salesRank30DayAvg" INTEGER,
ADD COLUMN     "salesRank60DayAvg" INTEGER,
ADD COLUMN     "salesRank90DayAvg" INTEGER,
ADD COLUMN     "used90DayOos" DOUBLE PRECISION;
