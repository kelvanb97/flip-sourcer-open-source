-- AlterTable
ALTER TABLE "RetailerProductIndex" ADD COLUMN     "errorCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockedBy" TEXT NOT NULL DEFAULT '';
