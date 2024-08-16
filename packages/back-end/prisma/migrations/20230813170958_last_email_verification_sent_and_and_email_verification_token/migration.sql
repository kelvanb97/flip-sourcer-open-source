-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "lastEmailVerificationSent" TIMESTAMP(3);
