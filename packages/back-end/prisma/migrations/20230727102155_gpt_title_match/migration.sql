-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "gptTitleMatchIterations" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gptTitleMatchScore" DOUBLE PRECISION NOT NULL DEFAULT 0;
