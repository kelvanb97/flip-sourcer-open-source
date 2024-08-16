import {
  AmazonInfoFromCatalog,
  AmazonInfoFromCatalogAndPdp,
  AmazonInfoFromPdp,
  Condition,
  Fee,
  Offer,
} from "../../../../../types/Product";
import { RetailerInfoFromPdp } from "../../../../../types/Product";
import { getMyFeesEstimateForASIN } from "./amazon/fees";
import {
  PrismaClient,
  Product,
  RetailerInfo,
} from "../../../../prisma/generated/client";
import { MIN_LEADING_ROI } from "../../../../shared/constants";
import { deleteProduct } from "../../../../shared/general";

async function writeRetailerInfoToDb(
  productLink: string,
  productImageLink: string,
  retailerProductDetails: RetailerInfoFromPdp,
  prisma: PrismaClient
) {
  const retailerInfoPayload = {
    productCost: retailerProductDetails.productCost,
    productCostUsed: retailerProductDetails.productCostUsed,
    productName: retailerProductDetails.productName,
    productUpc: retailerProductDetails.productUpc,
    productStock: retailerProductDetails.productStock,
    productInStock: retailerProductDetails.productInStock,
    productImageLink,
    productLink,
    siteName: retailerProductDetails.siteName,
  };

  const retailerInfo = await prisma.retailerInfo.upsert({
    where: { productLink },
    update: retailerInfoPayload,
    create: retailerInfoPayload,
  });
  await prisma.retailerHistoricalData.create({
    data: {
      timestamp: new Date().toISOString(),
      value: retailerProductDetails.productCost,
      type: "retailer-price",
      retailerInfoId: retailerInfo.id,
    },
  });

  return retailerInfo;
}

async function writeAmazonInfoToDb(
  amazonInfoFromCatalog: AmazonInfoFromCatalog,
  amazonInfoFromPdp: AmazonInfoFromPdp,
  prisma: PrismaClient
) {
  const amazonInfoPayload = {
    asin: amazonInfoFromPdp.asin,
    productName: amazonInfoFromPdp.productName,
    productLink: amazonInfoFromCatalog.productLink,
    productImageLink: amazonInfoFromCatalog.productImageLink,
    hasBuyBox: amazonInfoFromPdp.hasBuyBox,
    buyBoxPrice: amazonInfoFromPdp.buyBoxPrice,
    category: amazonInfoFromPdp.category,
    offers: JSON.stringify(amazonInfoFromPdp.offers),
    amazonOnListing: amazonInfoFromPdp.amazonOnListing,
    reviewCount: amazonInfoFromPdp.reviewCount,
    rating: amazonInfoFromPdp.rating,
    dimensions: JSON.stringify(amazonInfoFromPdp.dimensions),
    weight: JSON.stringify(amazonInfoFromPdp.weight),
    salesRankFlat: amazonInfoFromPdp.salesRank.flat,
    salesRankPercent: amazonInfoFromPdp.salesRank.percent,
  };
  const amazonInfo = await prisma.amazonInfo.upsert({
    where: { asin: amazonInfoPayload.asin },
    update: amazonInfoPayload,
    create: amazonInfoPayload,
  });

  return amazonInfo;
}

interface ConditionMap {
  flipSourcerName: Condition;
  amazonName: string;
  channel: "fba" | "fbm";
}

const conditionMapList: Array<ConditionMap> = [
  {
    flipSourcerName: "fbaNew",
    amazonName: "New",
    channel: "fba",
  },
  {
    flipSourcerName: "fbaLikeNew",
    amazonName: "LikeNew",
    channel: "fba",
  },
  {
    flipSourcerName: "fbaVeryGood",
    amazonName: "VeryGood",
    channel: "fba",
  },
  {
    flipSourcerName: "fbaGood",
    amazonName: "Good",
    channel: "fba",
  },
  {
    flipSourcerName: "fbaAcceptable",
    amazonName: "Acceptable",
    channel: "fba",
  },
  {
    flipSourcerName: "fbmAny",
    amazonName: "fbm",
    channel: "fbm",
  },
];

export function getOffersForCondition(
  offers: Offer[],
  conditionMap: ConditionMap
) {
  const offersForCondition = offers.filter((amazonOffer) => {
    const amznFormattedCondtion = amazonOffer.condition
      .replace(/\s/g, "")
      .toLowerCase();

    //condtion is good
    if (
      amznFormattedCondtion.includes("good") &&
      !amznFormattedCondtion.includes("very") &&
      conditionMap.amazonName === "Good"
    )
      return true;

    //condtion is new
    if (
      amznFormattedCondtion.includes("new") &&
      !amznFormattedCondtion.includes("like") &&
      conditionMap.amazonName === "New"
    )
      return true;

    //condtion is everything else
    return (
      amazonOffer.channel === conditionMap.channel &&
      amznFormattedCondtion.includes(
        conditionMap.amazonName.replace(/\s/g, "").toLowerCase()
      )
    );
  });

  return offersForCondition;
}

async function getFees(
  amazonInfoFromPdp: AmazonInfoFromPdp,
  lowestOfferForCondition: Offer,
  prisma: PrismaClient
): Promise<{ fees: Fee[]; feeSum: number }> {
  const feesRes = await getMyFeesEstimateForASIN({
    asin: amazonInfoFromPdp.asin,
    price: lowestOfferForCondition.price,
    prisma,
  });
  const amazonfees =
    feesRes?.FeesEstimateResult?.FeesEstimate?.FeeDetailList || [];

  // convert amazon fees into our fee format
  const fees: Array<Fee> = amazonfees.map((fee) => ({
    from: "amazon",
    name: fee.FeeType,
    value: fee.FeeAmount.Amount,
  }));

  //If there is no FBA fee, add the default
  if (!fees.find((fee) => fee.name === "FBAFees")) {
    fees.push({
      from: "amazon",
      name: "FBAFees",
      value: 3.39, //default fba fee
    });
  }

  const feeSum = fees.reduce((sum, fee) => sum + fee.value, 0);

  return { fees, feeSum };
}

interface CreateValueByConditionEntriesProps {
  conditionMap: ConditionMap;
  lowestOfferForCondition: Offer;
  profitForCondition: number;
  roiForCondition: number;
  fees: Fee[];
  productResult: Product;
  prisma: PrismaClient;
}

async function createValueByConditionEntries({
  conditionMap,
  lowestOfferForCondition,
  profitForCondition,
  roiForCondition,
  fees,
  productResult,
  prisma,
}: CreateValueByConditionEntriesProps) {
  try {
    await prisma.valueByCondition.create({
      data: {
        condition: conditionMap.flipSourcerName,
        type: "lowest-offer-by-condition",
        value: lowestOfferForCondition.price,
        productId: productResult.id,
      },
    });
    await prisma.valueByCondition.create({
      data: {
        condition: conditionMap.flipSourcerName,
        type: "profit-by-condition",
        value: profitForCondition,
        productId: productResult.id,
      },
    });
    await prisma.valueByCondition.create({
      data: {
        condition: conditionMap.flipSourcerName,
        type: "roi-by-condition",
        value: roiForCondition,
        productId: productResult.id,
      },
    });
    for (const fee of fees) {
      await prisma.valueByCondition.create({
        data: {
          condition: conditionMap.flipSourcerName,
          type: `fee-${fee.name}`,
          value: fee.value,
          productId: productResult.id,
        },
      });
    }
  } catch (e) {
    console.log("Error writing product info to db");
    console.log(e);
  }
}

async function dropExistingValueByConditionEntries(
  productResult: Product,
  prisma: PrismaClient
) {
  await prisma.valueByCondition.deleteMany({
    where: { productId: productResult.id },
  });
}

async function writeLowestOfferByConditionToValueByCondition(
  retailerInfo: RetailerInfo,
  amazonInfoFromPdp: AmazonInfoFromPdp,
  productResult: Product,
  prisma: PrismaClient
): Promise<void> {
  await dropExistingValueByConditionEntries(productResult, prisma);

  let highestRoiByCondition = -1000;
  let highestProfitByCondition = -1000;
  for (const conditionMap of conditionMapList) {
    const offersForCondition = getOffersForCondition(
      amazonInfoFromPdp.offers,
      conditionMap
    );
    if (offersForCondition.length === 0) continue;

    const lowestOfferForCondition = offersForCondition.sort(
      (a, b) => a.price - b.price
    )[0];

    const { fees, feeSum } = await getFees(
      amazonInfoFromPdp,
      lowestOfferForCondition,
      prisma
    );

    const profitForCondition =
      lowestOfferForCondition.price - feeSum - retailerInfo.productCost;
    if (profitForCondition > highestProfitByCondition)
      highestProfitByCondition = parseFloat(profitForCondition.toFixed(2));

    const roiForCondition =
      (profitForCondition / retailerInfo.productCost) * 100;
    if (roiForCondition > highestRoiByCondition)
      highestRoiByCondition = parseFloat(roiForCondition.toFixed(2));

    await createValueByConditionEntries({
      conditionMap,
      lowestOfferForCondition,
      profitForCondition,
      roiForCondition,
      fees,
      productResult,
      prisma,
    });
  }

  if (highestRoiByCondition < MIN_LEADING_ROI) {
    console.log(
      `product deleted roi constraint ${highestRoiByCondition} <${MIN_LEADING_ROI}`
    );
    await deleteProduct({
      productId: productResult.id,
      retailerInfoId: retailerInfo.id,
      prisma,
    });
    return;
  }
  if (!highestProfitByCondition || !highestRoiByCondition) {
    await deleteProduct({
      productId: productResult.id,
      retailerInfoId: retailerInfo.id,
      prisma,
    });
  } else {
    console.log("writeProductInfoToDb.ts success", productResult.id);
    await prisma.product.update({
      where: { id: productResult.id },
      data: {
        highestRoiByCondition,
        highestProfitByCondition,
      },
    });
    return;
  }
}

interface WriteProductInfoToDbProps {
  productLink: string;
  productImageLink: string;
  retailerProductDetails: RetailerInfoFromPdp;
  amazonInfoFromCatalogAndPdp: AmazonInfoFromCatalogAndPdp;
  prisma: PrismaClient;
}

export async function writeProductInfoToDb({
  productLink,
  productImageLink,
  retailerProductDetails,
  amazonInfoFromCatalogAndPdp,
  prisma,
}: WriteProductInfoToDbProps) {
  let productId = -1;
  let retailerInfoId = -1;
  try {
    const { amazonInfoFromCatalog, amazonInfoFromPdp } =
      amazonInfoFromCatalogAndPdp;

    const retailerInfo = await writeRetailerInfoToDb(
      productLink,
      productImageLink,
      retailerProductDetails,
      prisma
    );
    retailerInfoId = retailerInfo.id;

    const amazonInfo = await writeAmazonInfoToDb(
      amazonInfoFromCatalog,
      amazonInfoFromPdp,
      prisma
    );

    const productPayload = {
      matchType: amazonInfoFromCatalog.matchType,
      matchScore: amazonInfoFromCatalog.matchScore,
      matchScoreBreakdown: amazonInfoFromCatalog.matchScoreBreakdown,
      retailerInfoId: retailerInfo.id,
      amazonInfoId: amazonInfo.id,
    };
    const productResult = await prisma.product.upsert({
      where: { retailerInfoId: retailerInfo.id },
      update: productPayload,
      create: productPayload,
    });
    productId = productResult.id;

    await prisma.retailerInfo.update({
      data: { productId: productResult.id },
      where: { id: retailerInfo.id },
    });

    //also writes highest roi and profit by condition to product
    return await writeLowestOfferByConditionToValueByCondition(
      retailerInfo,
      amazonInfoFromPdp,
      productResult,
      prisma
    );
  } catch (e) {
    await deleteProduct({
      productId,
      retailerInfoId,
      prisma,
    });
    console.log("Error writing product info to db");
    console.log(e);
  }
}
