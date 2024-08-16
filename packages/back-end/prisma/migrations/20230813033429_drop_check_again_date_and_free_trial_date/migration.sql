/*
  Warnings:

  - You are about to drop the column `checkAgainDate` on the `StripeInfo` table. All the data in the column will be lost.
  - You are about to drop the column `freeTrialEndDate` on the `StripeInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StripeInfo" DROP COLUMN "checkAgainDate",
DROP COLUMN "freeTrialEndDate";
