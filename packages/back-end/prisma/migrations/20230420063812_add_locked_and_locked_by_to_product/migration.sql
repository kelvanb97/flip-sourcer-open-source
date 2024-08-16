-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lockedBy" TEXT NOT NULL DEFAULT '';
