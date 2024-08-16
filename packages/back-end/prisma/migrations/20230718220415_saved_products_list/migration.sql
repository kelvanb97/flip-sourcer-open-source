/*
  Warnings:

  - A unique constraint covering the columns `[affiliateId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "affiliateId" TEXT,
ADD COLUMN     "savedProducts" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "User_affiliateId_key" ON "User"("affiliateId");
