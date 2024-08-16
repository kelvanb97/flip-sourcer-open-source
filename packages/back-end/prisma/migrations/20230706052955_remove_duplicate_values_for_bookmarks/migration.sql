/*
  Warnings:

  - A unique constraint covering the columns `[baseUrl]` on the table `RetailerProductDiscoveryBookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[endingUrl]` on the table `RetailerProductDiscoveryBookmark` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RetailerProductDiscoveryBookmark_baseUrl_key" ON "RetailerProductDiscoveryBookmark"("baseUrl");

-- CreateIndex
CREATE UNIQUE INDEX "RetailerProductDiscoveryBookmark_endingUrl_key" ON "RetailerProductDiscoveryBookmark"("endingUrl");
