import { PrismaClient } from "../../../../prisma/generated/client";
import {
  ProductInterface,
  DbProductModel,
  Category,
  Condition,
  Fee,
  MatchType,
  RetailerName,
} from "../../../../../types/Product";
const prisma = new PrismaClient();

export async function readProduct(
  productId: number
): Promise<DbProductModel | null> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      amazonInfo: true,
      valueByCondition: true,
      retailerInfo: {
        include: {
          retailerHistoricalData: true,
        },
      },
    },
  });

  if (!product) return null;

  const retailerHistoricalData = await prisma.retailerHistoricalData.findMany({
    where: {
      retailerInfoId: product?.retailerInfo.id,
    },
  });

  product.retailerInfo.retailerHistoricalData = retailerHistoricalData;

  return product;
}

function getFeesByCondition(
  infoByConditionMap: Record<string, number>,
  condition: Condition
): Fee[] {
  const fees: Fee[] = [];
  for (const [key, value] of Object.entries(infoByConditionMap)) {
    if (key.includes(`${condition}+fee`)) {
      fees.push({
        from: "amazon",
        name: key.split("+")[1].split("-")[1],
        value,
      });
    }
  }
  return fees;
}

export async function transformDbProduct(
  dbProduct: DbProductModel
): Promise<ProductInterface> {
  let product: ProductInterface = {} as ProductInterface;

  // const retailerHistoricalData = await prisma.retailerHistoricalData.findMany({
  //   where: {
  //     retailerInfoId: dbProduct?.retailerInfo.id,
  //   },
  // });

  const infoByConditionMap = dbProduct.valueByCondition.reduce((map, obj) => {
    const key = `${obj.condition}+${obj.type}`;
    map[key] = obj.value;
    return map;
  }, {} as Record<string, number>);

  const dimensions = JSON.parse(dbProduct.amazonInfo.dimensions as string);
  const weight = JSON.parse(dbProduct.amazonInfo.weight as string);

  const chartData = JSON.parse(
    dbProduct.amazonInfo.chartHistoricalDatum as string
  );

  product = {
    id: dbProduct.id.toString(),
    createdAt: dbProduct.createdAt,
    updatedAt: dbProduct.updatedAt,
    matchType: dbProduct.matchType as MatchType,
    matchScore: dbProduct.matchScore,
    matchScoreBreakdown: dbProduct.matchScoreBreakdown as Record<
      string,
      number
    >,
    gptTitleMatchScore: dbProduct.gptTitleMatchScore,
    retailerInfo: {
      productCost: dbProduct.retailerInfo.productCost,
      productCostUsed: dbProduct.retailerInfo.productCostUsed,
      productImageLink: dbProduct.retailerInfo.productImageLink,
      productLink: dbProduct.retailerInfo.productLink,
      productName: dbProduct.retailerInfo.productName,
      siteName: dbProduct.retailerInfo.siteName as RetailerName,
      productInStock: dbProduct.retailerInfo.productInStock ?? false,
      productStock: dbProduct.retailerInfo.productStock,
      productUpc: dbProduct.retailerInfo.productUpc,
    },
    amazonInfo: {
      asin: dbProduct.amazonInfo.asin,
      productName: dbProduct.amazonInfo.productName,
      productLink: dbProduct.amazonInfo.productLink,
      productImageLink: dbProduct.amazonInfo.productImageLink,
      hasBuyBox: dbProduct.amazonInfo.hasBuyBox,
      buyBoxPrice: dbProduct.amazonInfo.buyBoxPrice,
      category: dbProduct.amazonInfo.category as Category,
      lowestOfferByCondition: {
        fbaNew: infoByConditionMap["fbaNew+lowest-offer-by-condition"],
        fbaLikeNew: infoByConditionMap["fbaLikeNew+lowest-offer-by-condition"],
        fbaVeryGood:
          infoByConditionMap["fbaVeryGood+lowest-offer-by-condition"],
        fbaGood: infoByConditionMap["fbaGood+lowest-offer-by-condition"],
        fbaAcceptable:
          infoByConditionMap["fbaAcceptable+lowest-offer-by-condition"],
        fbmAny: infoByConditionMap["fbmAny+lowest-offer-by-condition"],
      },
      offers: dbProduct.amazonInfo.offers
        ? JSON.parse(dbProduct.amazonInfo.offers as string)
        : [],
      amazonOnListing: dbProduct.amazonInfo.amazonOnListing,
      reviewCount: dbProduct.amazonInfo.reviewCount,
      rating: dbProduct.amazonInfo.rating,
      salesRank: {
        flat: dbProduct.amazonInfo.salesRankFlat,
        percent: dbProduct.amazonInfo.salesRankPercent,
      },
      dimensions: {
        wIn: dimensions["wIn"],
        lIn: dimensions["lIn"],
        hIn: dimensions["hIn"],
        wCm: dimensions["wCm"],
        lCm: dimensions["lCm"],
        hCm: dimensions["hCm"],
      },
      weight: {
        lbs: weight["lbs"],
        oz: weight["oz"],
        kg: weight["kg"],
        g: weight["g"],
      },
      fees: {
        fbaNew: getFeesByCondition(infoByConditionMap, "fbaNew"),
        fbaLikeNew: getFeesByCondition(infoByConditionMap, "fbaLikeNew"),
        fbaVeryGood: getFeesByCondition(infoByConditionMap, "fbaVeryGood"),
        fbaGood: getFeesByCondition(infoByConditionMap, "fbaGood"),
        fbaAcceptable: getFeesByCondition(infoByConditionMap, "fbaAcceptable"),
        fbmAny: getFeesByCondition(infoByConditionMap, "fbmAny"),
      },
      infoFromKeepa: {
        lastKeepaPollTime: dbProduct.amazonInfo.lastKeepaPollTime,

        salesRank30DayAvg: dbProduct.amazonInfo.salesRank30DayAvg,
        salesRank60DayAvg: dbProduct.amazonInfo.salesRank60DayAvg,
        salesRank90DayAvg: dbProduct.amazonInfo.salesRank90DayAvg,
        salesRank180DayAvg: dbProduct.amazonInfo.salesRank180DayAvg,

        salesRankDrops30: dbProduct.amazonInfo.salesRankDrops30,
        salesRankDrops90: dbProduct.amazonInfo.salesRankDrops90,
        salesRankDrops180: dbProduct.amazonInfo.salesRankDrops180,

        reviewCount90DayAvg: dbProduct.amazonInfo.reviewCount90DayAvg,
        reviewCount180DayAvg: dbProduct.amazonInfo.reviewCount180DayAvg,

        buyBoxCurrent: dbProduct.amazonInfo.buyBoxCurrent,
        buyBox90DayAvg: dbProduct.amazonInfo.buyBox90DayAvg,
        buyBox180DayAvg: dbProduct.amazonInfo.buyBox180DayAvg,
        buyBox90DayOos: dbProduct.amazonInfo.buyBox90DayOos,

        amazon90DayOos: dbProduct.amazonInfo.amazon90DayOos,

        newCurrent: dbProduct.amazonInfo.newCurrent,
        new90DayAvg: dbProduct.amazonInfo.new90DayAvg,
        new180DayAvg: dbProduct.amazonInfo.new180DayAvg,
        new90DayOos: dbProduct.amazonInfo.new90DayOos,

        new3rdPartyFbaCurrent: dbProduct.amazonInfo.new3rdPartyFbaCurrent,
        new3rdPartyFba90DayAvg: dbProduct.amazonInfo.new3rdPartyFba90DayAvg,
        new3rdPartyFba180DayAvg: dbProduct.amazonInfo.new3rdPartyFba180DayAvg,

        new3rdPartyFbmCurrent: dbProduct.amazonInfo.new3rdPartyFbmCurrent,
        new3rdPartyFbm90DayAvg: dbProduct.amazonInfo.new3rdPartyFbm90DayAvg,
        new3rdPartyFbm180DayAvg: dbProduct.amazonInfo.new3rdPartyFbm180DayAvg,

        used90DayOos: dbProduct.amazonInfo.used90DayOos,

        newOfferCount: dbProduct.amazonInfo.newOfferCount,
        newOfferCount30DayAvg: dbProduct.amazonInfo.newOfferCount30DayAvg,
        newOfferCount90DayAvg: dbProduct.amazonInfo.newOfferCount90DayAvg,
        newOfferCount180DayAvg: dbProduct.amazonInfo.newOfferCount180DayAvg,

        countOfRetrievedLiveOffersFba:
          dbProduct.amazonInfo.countOfRetrievedLiveOffersFba,
        countOfRetrievedLiveOffersFbm:
          dbProduct.amazonInfo.countOfRetrievedLiveOffersFbm,
      },
    },
    chartData: chartData ?? {
      buyBox: [],
      amazon: [],
      new: [],
      used: [],
      salesRank: [],
      newOfferCount: [],
      usedOfferCount: [],
      reviewCount: [],
      rating: [],
      retailer: [],
    },
  };

  return product;
}
