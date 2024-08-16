-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "sessionExpiration" TIMESTAMP(3) NOT NULL,
    "referrer" TEXT,
    "planName" TEXT NOT NULL,
    "stripeInfoId" INTEGER NOT NULL,
    "amazonSpApiId" INTEGER NOT NULL,
    "generalSettingsId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeInfo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "defaultPaymentMethodId" TEXT NOT NULL,
    "checkAgainDate" TIMESTAMP(3) NOT NULL,
    "freeTrialEndDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmazonSpApi" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sellerId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,

    CONSTRAINT "AmazonSpApi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralSettings" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "defaultFbaFee" DOUBLE PRECISION NOT NULL,
    "measurementSystem" TEXT NOT NULL,
    "perUnitCostsId" INTEGER NOT NULL,
    "shippingCostsId" INTEGER NOT NULL,
    "cashbackId" INTEGER NOT NULL,

    CONSTRAINT "GeneralSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerUnitCosts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "flat" DOUBLE PRECISION NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "generalSettingsId" INTEGER,

    CONSTRAINT "PerUnitCosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingCosts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "perPound" DOUBLE PRECISION NOT NULL,
    "perOunce" DOUBLE PRECISION NOT NULL,
    "perKilogram" DOUBLE PRECISION NOT NULL,
    "perGram" DOUBLE PRECISION NOT NULL,
    "perUnit" DOUBLE PRECISION NOT NULL,
    "generalSettingsId" INTEGER,

    CONSTRAINT "ShippingCosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cashback" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "flat" DOUBLE PRECISION NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "generalSettingsId" INTEGER,

    CONSTRAINT "Cashback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchType" TEXT NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL,
    "retailerInfoId" INTEGER NOT NULL,
    "amazonInfoId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValueByCondition" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condition" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "ValueByCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmazonInfo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "asin" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productLink" TEXT NOT NULL,
    "productImageLink" TEXT NOT NULL,
    "hasBuyBox" BOOLEAN NOT NULL,
    "buyBoxPrice" DOUBLE PRECISION,
    "numSellers" INTEGER NOT NULL,
    "numSellersFba" INTEGER NOT NULL,
    "numSellersFbm" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "offers" JSONB NOT NULL,
    "amazonOnListing" BOOLEAN NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION,
    "salesRankFlat" INTEGER,
    "salesRankPercent" DOUBLE PRECISION,
    "dimensions" JSONB NOT NULL,
    "weight" JSONB NOT NULL,
    "lastKeepaPollTime" TIMESTAMP(3),
    "lastSPAPIPollTime" TIMESTAMP(3),
    "productId" INTEGER,
    "keepaDataId" INTEGER,

    CONSTRAINT "AmazonInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeepaProductData" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "avg30" DOUBLE PRECISION,
    "avg90" DOUBLE PRECISION,
    "avg180" DOUBLE PRECISION,
    "salesRankDrops30" INTEGER,
    "salesRankDrops90" INTEGER,
    "salesRankDrops180" INTEGER,
    "amazonHistorical" JSONB,
    "newHistorical" JSONB,
    "usedHistorical" JSONB,
    "salesRankHistorical" JSONB,
    "chartHistoricalDatum" JSONB,
    "amazonInfoId" INTEGER,

    CONSTRAINT "KeepaProductData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeepaNumProductsInCategory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "numProduct" INTEGER NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "KeepaNumProductsInCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetailerInfo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteName" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productUpc" TEXT,
    "productCost" DOUBLE PRECISION NOT NULL,
    "productLink" TEXT NOT NULL,
    "productImageLink" TEXT NOT NULL,
    "productInStock" BOOLEAN,
    "productStock" TEXT,
    "retailerProductIndexId" INTEGER,

    CONSTRAINT "RetailerInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetailerProductIndex" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "retailerInfoId" INTEGER,
    "productLink" TEXT NOT NULL,
    "productImageLink" TEXT NOT NULL,
    "retailer" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RetailerProductIndex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetailerProductDiscoveryBookmark" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "endingUrl" TEXT NOT NULL,
    "retailer" TEXT NOT NULL,

    CONSTRAINT "RetailerProductDiscoveryBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetailerHistoricalData" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timestamp" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "retailerInfoId" INTEGER NOT NULL,

    CONSTRAINT "RetailerHistoricalData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeInfoId_key" ON "User"("stripeInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_amazonSpApiId_key" ON "User"("amazonSpApiId");

-- CreateIndex
CREATE UNIQUE INDEX "User_generalSettingsId_key" ON "User"("generalSettingsId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralSettings_perUnitCostsId_key" ON "GeneralSettings"("perUnitCostsId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralSettings_shippingCostsId_key" ON "GeneralSettings"("shippingCostsId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralSettings_cashbackId_key" ON "GeneralSettings"("cashbackId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_retailerInfoId_key" ON "Product"("retailerInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_amazonInfoId_key" ON "Product"("amazonInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "AmazonInfo_asin_key" ON "AmazonInfo"("asin");

-- CreateIndex
CREATE UNIQUE INDEX "AmazonInfo_productId_key" ON "AmazonInfo"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "AmazonInfo_keepaDataId_key" ON "AmazonInfo"("keepaDataId");

-- CreateIndex
CREATE UNIQUE INDEX "KeepaProductData_amazonInfoId_key" ON "KeepaProductData"("amazonInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "RetailerInfo_productLink_key" ON "RetailerInfo"("productLink");

-- CreateIndex
CREATE UNIQUE INDEX "RetailerInfo_retailerProductIndexId_key" ON "RetailerInfo"("retailerProductIndexId");

-- CreateIndex
CREATE UNIQUE INDEX "RetailerProductIndex_retailerInfoId_key" ON "RetailerProductIndex"("retailerInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "RetailerProductIndex_productLink_key" ON "RetailerProductIndex"("productLink");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_stripeInfoId_fkey" FOREIGN KEY ("stripeInfoId") REFERENCES "StripeInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_amazonSpApiId_fkey" FOREIGN KEY ("amazonSpApiId") REFERENCES "AmazonSpApi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_generalSettingsId_fkey" FOREIGN KEY ("generalSettingsId") REFERENCES "GeneralSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralSettings" ADD CONSTRAINT "GeneralSettings_perUnitCostsId_fkey" FOREIGN KEY ("perUnitCostsId") REFERENCES "PerUnitCosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralSettings" ADD CONSTRAINT "GeneralSettings_shippingCostsId_fkey" FOREIGN KEY ("shippingCostsId") REFERENCES "ShippingCosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralSettings" ADD CONSTRAINT "GeneralSettings_cashbackId_fkey" FOREIGN KEY ("cashbackId") REFERENCES "Cashback"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_retailerInfoId_fkey" FOREIGN KEY ("retailerInfoId") REFERENCES "RetailerInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_amazonInfoId_fkey" FOREIGN KEY ("amazonInfoId") REFERENCES "AmazonInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValueByCondition" ADD CONSTRAINT "ValueByCondition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmazonInfo" ADD CONSTRAINT "AmazonInfo_keepaDataId_fkey" FOREIGN KEY ("keepaDataId") REFERENCES "KeepaProductData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailerInfo" ADD CONSTRAINT "RetailerInfo_retailerProductIndexId_fkey" FOREIGN KEY ("retailerProductIndexId") REFERENCES "RetailerProductIndex"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailerHistoricalData" ADD CONSTRAINT "RetailerHistoricalData_retailerInfoId_fkey" FOREIGN KEY ("retailerInfoId") REFERENCES "RetailerInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
