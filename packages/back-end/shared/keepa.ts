import axios from "axios";
import moment from "moment";
import { ChartData, ChartDataPoint } from "../../types/Product";
import {
  Prisma,
  PrismaClient,
  RetailerHistoricalData,
} from "../prisma/generated/client";
import { KeepaProduct, KeepaProductResponse } from "../../types/Keepa";

enum KeepaCsvIndexes {
  AMAZON = 0,
  NEW = 1,
  USED = 2,
  SALES_RANKS = 3,
  LIST_PRICE = 4,
  COLLECTIBLE = 5,
  REFURBISHED = 6,
  NEW_FBM = 7,
  LIGHTNING_DEAL = 8,
  WAREHOUSE = 9,
  NEW_FBA = 10,
  OFFER_COUNT_NEW = 11,
  OFFER_COUNT_USED = 12,
  OFFER_COUNT_REFURBISHED = 13,
  OFFER_COUNT_COLLECTIBLE = 14,
  EXTRA_INFO_UPDATES = 15,
  RATING = 16,
  REVIEW_COUNT = 17,
  NEW_BUY_BOX_SHIPPING = 18,
  LIKE_NEW_SHIPPING = 19,
  VERY_GOOD_SHIPPING = 20,
  GOOD_SHIPPING = 21,
  ACCEPTABLE_SHIPPING = 22,
  COLLECTIBLE_LIKE_NEW_SHIPPING = 23,
  COLLECTIBLE_VERY_GOOD_SHIPPING = 24,
  COLLECTIBLE_GOOD_SHIPPING = 25,
  COLLECTIBLE_ACCEPTABLE_SHIPPING = 26,
  REFURBISHED_SHIPPING = 27,
  EBAY_NEW_SHIPPING = 28,
  EBAY_USED_SHIPPING = 29,
  TRADE_IN = 30,
  RENTAL = 31,
  BUY_BOX_USED_SHIPPING = 32,
  PRIME_EXCL = 33,
}

function toChartDataPoints(
  data: Array<number> | null,
  divisor: number = 100,
  addLast: boolean = true
): Array<ChartDataPoint> {
  if (!data) return [];
  const chartDataPoints: Array<ChartDataPoint> = [];
  const msTime180DaysAgo = moment().subtract(180, "days").valueOf();

  //even indexes are timestamps, odd indexes are values
  for (let i = 0; i < data.length - 1; i += 2) {
    //Keepa keeps track of time on a different scale than JS
    const keepaTimestamp = data[i];
    const epochMsTimestamp = (keepaTimestamp + 21564000) * 60000;

    //we only graph 180 days of data and this catches when keepa makes mistakes
    if (epochMsTimestamp < msTime180DaysAgo) continue;

    const value = data[i + 1] / divisor;

    chartDataPoints.push({
      x: epochMsTimestamp,
      y: value,
    });
  }

  if (!chartDataPoints.length) return [];

  const last = chartDataPoints.sort((a, b) => a.x - b.x)[
    chartDataPoints.length - 1
  ];
  if (addLast) chartDataPoints.push({ x: moment().valueOf(), y: last.y });

  return chartDataPoints.sort((a, b) => a.x - b.x);
}

function toChartDataPointsIncludesShipping(
  data: Array<number> | null,
  divisor: number = 100,
  addLast: boolean = true
): Array<ChartDataPoint> {
  if (!data) return [];
  const chartDataPoints: Array<ChartDataPoint> = [];
  const msTime180DaysAgo = moment().subtract(180, "days").valueOf();

  //even indexes are timestamps, odd indexes are values
  for (let i = 0; i < data.length - 1; i += 3) {
    //Keepa keeps track of time on a different scale than JS
    const keepaTimestamp = data[i];
    const epochMsTimestamp = (keepaTimestamp + 21564000) * 60000;

    //we only graph 180 days of data and this catches when keepa makes mistakes
    if (epochMsTimestamp < msTime180DaysAgo) continue;

    const value = data[i + 1] / divisor;
    const shipping = data[i + 2] / divisor;

    chartDataPoints.push({
      x: epochMsTimestamp,
      y: value + shipping,
    });
  }

  if (!chartDataPoints.length) return [];

  const last = chartDataPoints.sort((a, b) => a.x - b.x)[
    chartDataPoints.length - 1
  ];
  if (addLast) chartDataPoints.push({ x: moment().valueOf(), y: last.y });

  return chartDataPoints.sort((a, b) => a.x - b.x);
}

//Adjust chart data to match the shape of Keepa's chart for points
function formatPointData(amazonChartData: ChartDataPoint[]): ChartDataPoint[] {
  const tmpAmazonChartData = amazonChartData.sort((a, b) => a.x - b.x).slice();
  return tmpAmazonChartData.filter((point) => point.y !== null && point.y > 0);
}

//Adjust chart data to match the shape of Keepa's chart for lines
//It more resembles a bar chart than a line chart but it is still a line chart. Ask Kelvan
function formatLineData(amazonChartData: ChartDataPoint[]): ChartDataPoint[] {
  const tmpAmazonChartData = amazonChartData.sort((a, b) => a.x - b.x).slice();

  if (tmpAmazonChartData.length < 2) return tmpAmazonChartData;

  for (let i = 0; i < tmpAmazonChartData.length - 1; i++) {
    const cur = tmpAmazonChartData[i].y;
    // const curTimestamp = tmpAmazonChartData[i].x;
    const next = tmpAmazonChartData[i + 1].y;
    const nextTimestamp = tmpAmazonChartData[i + 1].x;

    if (cur === null || next === null) continue;

    let x = 0;
    let y = 0;
    //add or subtract 1000 ms to the timestamp to order the data correctly
    if (cur === null || cur < 0) {
      x = nextTimestamp - 1000;
      y = -0.01;
    } else if (next === null || next < 0) {
      x = nextTimestamp - 1000;
      y = cur;
    } else if (cur < next) {
      x = nextTimestamp - 1000;
      y = cur;
    } else if (next < cur) {
      x = nextTimestamp - 1000;
      y = cur;
    } else if (cur === next) {
      continue;
    } else {
      //nulls
      continue;
    }

    amazonChartData.push({ x, y });
  }

  for (let i = 0; i < amazonChartData.length; i++) {
    const point = amazonChartData[i].y;
    if (!point || point < 0) amazonChartData[i].y = null;
  }

  return amazonChartData.sort((a, b) => a.x - b.x);
}

function getAvg(
  data: Array<ChartDataPoint>,
  days: number,
  retType: "int" | "float"
): number | null {
  const msTimeXDaysAgo = moment().subtract(days, "days").valueOf();
  const filteredData = data.filter(
    (point) => point.x > msTimeXDaysAgo && point.y !== null
  );

  let sum = 0;
  let avgDivisor = 0;
  for (let i = 0; i < filteredData.length; i++) {
    const value = filteredData[i].y;
    if (value === null || value < 0) continue;
    sum += value;
    avgDivisor++;
  }

  const avg = avgDivisor === 0 ? null : sum / avgDivisor;

  if (avg === null) return avg;
  else if (retType === "int") return Math.round(avg) || 0;
  else return Math.round(avg * 100) / 100 || 0;
}

function getBuyBoxCurrent(product: KeepaProduct): number | null {
  const buyBoxPrice = product.stats.buyBoxPrice;
  const buyBoxShipping = product.stats.buyBoxShipping;

  if (buyBoxPrice === null || buyBoxShipping === null) return null;
  if (isNaN(buyBoxPrice) || isNaN(buyBoxShipping)) return null;

  return (buyBoxPrice + buyBoxShipping) / 100;
}

function getLastPositiveChartDataPointValue(
  data: Array<ChartDataPoint>
): number | null {
  return (
    data.reverse().find((point) => point.y !== null && point.y > 0)?.y ?? null
  );
}

function getLastPositiveNumber(
  data: Array<number>,
  divisor: number
): number | null {
  for (let i = data.length - 1; i >= 0; i--) {
    const value = data[i];
    if (value === null) continue;
    else if (value < 0) continue;
    else {
      return value / divisor;
    }
  }
  return null;
}

function getOos(chartDataPoints: ChartDataPoint[], days: number): number {
  const msTimeXDaysAgo = moment().subtract(days, "days").valueOf();
  const filteredData = chartDataPoints.filter(
    (point) => point.x > msTimeXDaysAgo
  );

  if (!filteredData.length) return 100;

  let oosCount = 0;
  let inStockCount = 0;

  for (let i = 0; i < filteredData.length; i++) {
    const point = filteredData[i];
    if (point.y === null || point.y <= 0) oosCount++;
    else inStockCount++;
  }

  const percentOfTimeOos = (oosCount / (oosCount + inStockCount)) * 100;
  return percentOfTimeOos || 100;
}

function getWaitTime(json: KeepaProductResponse) {
  const tokensLeft = json.tokensLeft;
  const tokensRefilledPerMinute = json.refillRate;

  const desiredTokenCount = 50;
  const timeMsForFullTokenRestock =
    (desiredTokenCount / tokensRefilledPerMinute) * 60 * 1000;

  if (tokensLeft < desiredTokenCount) {
    return timeMsForFullTokenRestock;
  }

  return 0;
}

function retailerHistoricalDataToChartDataPoints(
  retailerHistoricalData: RetailerHistoricalData[]
): ChartDataPoint[] {
  return retailerHistoricalData.map((point) => ({
    x: point.createdAt.valueOf(),
    y: point.value,
  }));
}

export async function getKeepaData(
  keepaApiKey: string,
  asin: string,
  retailerInfoId: number,
  prisma: PrismaClient
): Promise<{
  keepaDataPayload: Prisma.AmazonInfoUpdateInput | null;
  waitTime: number;
}> {
  const res = await axios.get(
    `https://api.keepa.com/product?key=${keepaApiKey}&asin=${asin}&domain=1&stats=180&days=180&offers=20`
  );

  const json = res.data as KeepaProductResponse;
  console.log("tokens consumed: ", json.tokensConsumed);
  const waitTime = getWaitTime(json);
  if (!json || !json.products || !json.products.length) {
    console.log("Invalid keepa response");
    return {
      keepaDataPayload: null,
      waitTime,
    };
  }
  const product = json.products[0];

  const retailerHistoricalData = await prisma.retailerHistoricalData.findMany({
    where: { retailerInfoId },
  });

  const buyBox = toChartDataPointsIncludesShipping(
    product.csv[KeepaCsvIndexes.NEW_BUY_BOX_SHIPPING]
  );
  const amazon = toChartDataPoints(product.csv[KeepaCsvIndexes.AMAZON]);
  const allNew = toChartDataPoints(product.csv[KeepaCsvIndexes.NEW]);
  const new3rdPartyFba = toChartDataPoints(
    product.csv[KeepaCsvIndexes.NEW_FBA],
    100,
    false
  );
  const new3rdPartyFbm = toChartDataPointsIncludesShipping(
    product.csv[KeepaCsvIndexes.NEW_FBM],
    100,
    false
  );
  const buyBoxUsed = toChartDataPointsIncludesShipping(
    product.csv[KeepaCsvIndexes.BUY_BOX_USED_SHIPPING],
    100,
    false
  );
  const allUsed = toChartDataPoints(product.csv[KeepaCsvIndexes.USED]);
  const usedLikeNew = toChartDataPointsIncludesShipping(
    product.csv[KeepaCsvIndexes.LIKE_NEW_SHIPPING],
    100,
    false
  );
  const usedVeryGood = toChartDataPointsIncludesShipping(
    product.csv[KeepaCsvIndexes.VERY_GOOD_SHIPPING],
    100,
    false
  );
  const usedGood = toChartDataPointsIncludesShipping(
    product.csv[KeepaCsvIndexes.GOOD_SHIPPING],
    100,
    false
  );
  const usedAcceptable = toChartDataPointsIncludesShipping(
    product.csv[KeepaCsvIndexes.ACCEPTABLE_SHIPPING],
    100,
    false
  );
  const warehouseDeals = toChartDataPoints(
    product.csv[KeepaCsvIndexes.WAREHOUSE],
    100,
    false
  );
  const collectible = toChartDataPoints(
    product.csv[KeepaCsvIndexes.COLLECTIBLE]
  );
  const listPrice = toChartDataPoints(product.csv[KeepaCsvIndexes.LIST_PRICE]);
  const salesRanks = toChartDataPoints(
    product.csv[KeepaCsvIndexes.SALES_RANKS],
    1
  );
  const newOfferCount = toChartDataPoints(
    product.csv[KeepaCsvIndexes.OFFER_COUNT_NEW],
    1
  );
  const usedOfferCount = toChartDataPoints(
    product.csv[KeepaCsvIndexes.OFFER_COUNT_USED],
    1
  );
  const collectibleOfferCount = toChartDataPoints(
    product.csv[KeepaCsvIndexes.OFFER_COUNT_COLLECTIBLE],
    1
  );
  const reviewCount = toChartDataPoints(
    product.csv[KeepaCsvIndexes.REVIEW_COUNT],
    1
  );
  const rating = toChartDataPoints(product.csv[KeepaCsvIndexes.RATING], 10);
  const retailer = retailerHistoricalDataToChartDataPoints(
    retailerHistoricalData
  );

  const historicalChartData: ChartData = {
    buyBox: formatLineData(buyBox.slice()),
    amazon: formatLineData(amazon.slice()),
    new: formatLineData(allNew.slice()),
    new3rdPartyFba: formatPointData(new3rdPartyFba.slice()),
    new3rdPartyFbm: formatPointData(new3rdPartyFbm.slice()),
    buyBoxUsed: formatPointData(buyBoxUsed.slice()),
    used: formatLineData(allUsed.slice()),
    usedLikeNew: formatPointData(usedLikeNew.slice()),
    usedVeryGood: formatPointData(usedVeryGood.slice()),
    usedGood: formatPointData(usedGood.slice()),
    usedAcceptable: formatPointData(usedAcceptable.slice()),
    warehouseDeals: formatPointData(warehouseDeals.slice()),
    collectible: formatLineData(collectible.slice()),
    listPrice: formatLineData(listPrice.slice()),
    salesRank: formatPointData(salesRanks.slice()),
    newOfferCount: formatLineData(newOfferCount.slice()),
    usedOfferCount: formatLineData(usedOfferCount.slice()),
    collectibleOfferCount: formatLineData(collectibleOfferCount.slice()),
    reviewCount: formatLineData(reviewCount.slice()),
    rating: formatLineData(rating.slice()),
    retailer,
  };

  const keepaDataPayload: Prisma.AmazonInfoUpdateInput = {
    lastKeepaPollTime: new Date(),
    chartHistoricalDatum: JSON.stringify(historicalChartData),

    salesRank30DayAvg: getAvg(salesRanks, 30, "int"),
    salesRank60DayAvg: getAvg(salesRanks, 60, "int"),
    salesRank90DayAvg: getAvg(salesRanks, 90, "int"),
    salesRank180DayAvg: getAvg(salesRanks, 180, "int"),

    salesRankDrops30: product.stats.salesRankDrops30,
    salesRankDrops90: product.stats.salesRankDrops90,
    salesRankDrops180: product.stats.salesRankDrops180,

    reviewCount90DayAvg: getAvg(reviewCount, 90, "int"),
    reviewCount180DayAvg: getAvg(reviewCount, 180, "int"),

    buyBoxCurrent: getBuyBoxCurrent(product),
    buyBox90DayAvg: getLastPositiveNumber(product.stats.avg90, 100),
    buyBox180DayAvg: getLastPositiveNumber(product.stats.avg180, 100),
    buyBoxStock: 0,
    buyBox90DayOos: getLastPositiveNumber(
      product.stats.outOfStockPercentage90,
      1
    ),

    amazon90DayOos: getOos(amazon, 90),

    newCurrent: getLastPositiveChartDataPointValue(allNew),
    new90DayAvg: getAvg(allNew, 90, "float"),
    new180DayAvg: getAvg(allNew, 180, "float"),

    new90DayOos: getOos(allNew, 90),

    new3rdPartyFbaCurrent: getLastPositiveChartDataPointValue(new3rdPartyFba),
    new3rdPartyFba90DayAvg: getAvg(new3rdPartyFba, 90, "float"),
    new3rdPartyFba180DayAvg: getAvg(new3rdPartyFba, 180, "float"),

    new3rdPartyFbmCurrent: getLastPositiveChartDataPointValue(new3rdPartyFbm),
    new3rdPartyFbm90DayAvg: getAvg(new3rdPartyFbm, 90, "float"),
    new3rdPartyFbm180DayAvg: getAvg(new3rdPartyFbm, 180, "float"),

    used90DayOos: getOos(allUsed, 90),

    newOfferCount: getLastPositiveChartDataPointValue(newOfferCount),
    newOfferCount30DayAvg: getAvg(newOfferCount, 30, "int"),
    newOfferCount90DayAvg: getAvg(newOfferCount, 90, "int"),
    newOfferCount180DayAvg: getAvg(newOfferCount, 180, "int"),

    countOfRetrievedLiveOffersFba: product.stats.offerCountFBA,
    countOfRetrievedLiveOffersFbm: product.stats.offerCountFBM,
  };

  return { keepaDataPayload, waitTime };
}
