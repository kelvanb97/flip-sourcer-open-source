-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mailchimpAudiences" TEXT[] DEFAULT ARRAY[]::TEXT[];
