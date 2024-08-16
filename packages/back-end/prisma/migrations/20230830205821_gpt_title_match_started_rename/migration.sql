/*
  Warnings:

  - You are about to drop the column `gptStarted` on the `ScraperStatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScraperStatus" DROP COLUMN "gptStarted",
ADD COLUMN     "gptTitleMatchStarted" BOOLEAN NOT NULL DEFAULT false;
