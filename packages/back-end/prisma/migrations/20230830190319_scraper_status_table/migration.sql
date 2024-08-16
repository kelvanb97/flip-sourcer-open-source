-- CreateTable
CREATE TABLE "ScraperStatus" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdpStarted" BOOLEAN NOT NULL DEFAULT false,
    "gptStarted" BOOLEAN NOT NULL DEFAULT false,
    "keepaStarted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ScraperStatus_pkey" PRIMARY KEY ("id")
);
