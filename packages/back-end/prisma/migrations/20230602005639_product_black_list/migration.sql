-- AlterTable
ALTER TABLE "User" ADD COLUMN     "productBlackList" TEXT[] DEFAULT ARRAY[]::TEXT[];
