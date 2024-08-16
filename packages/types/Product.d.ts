import {
  AmazonInfo as DbAmazonInfo,
  RetailerHistoricalData as DbRetailerHistoricalData,
  Product as DbProduct,
  RetailerInfo as DbRetailerInfo,
  ValueByCondition as DbValueByCondition,
} from "../back-end/prisma/generated/client";

export interface ChartDataPoint {
  x: number;
  y: number | null;
}

export type Category =
  | "Alexa Skills"
  | "Appliances"
  | "Apps & Games"
  | "Arts, Crafts & Sewing"
  | "Audible Books & Originals"
  | "Automotive"
  | "Baby Products"
  | "Beauty & Personal Care"
  | "Books"
  | "CDs & Vinyl"
  | "Cell Phones & Accessories"
  | "Clothing, Shoes & Jewelry"
  | "Collectibles & Fine Art"
  | "Digital Music"
  | "Electronics"
  | "Everything Else"
  | "Gift Cards"
  | "Grocery & Gourmet Food"
  | "Handmade Products"
  | "Health & Household"
  | "Home & Kitchen"
  | "Industrial & Scientific"
  | "Kindle Store"
  | "Magazine Subscriptions"
  | "Movies & TV"
  | "Musical Instruments"
  | "Office Products"
  | "Patio, Lawn & Garden"
  | "Pet Supplies"
  | "Software"
  | "Sports & Outdoors"
  | "Tools & Home Improvement"
  | "Toys & Games"
  | "Video Games"
  | "Video Shorts";

export type Condition =
  | "fbaNew"
  | "fbaLikeNew"
  | "fbaVeryGood"
  | "fbaGood"
  | "fbaAcceptable"
  | "fbmAny";

export type Fee = {
  from: "flipsourcer" | "amazon";
  name: string;
  value: number;
};

export interface Offer {
  isBuyBox: boolean;
  sellerName: string;
  sellerLink: string;
  condition: string;
  rating: number | undefined;
  numReviews: number | undefined;
  price: number;
  stock: number | undefined;
  channel: "fba" | "fbm";
}

export interface Weight {
  lbs: number | undefined;
  oz: number | undefined;
  kg: number | undefined;
  g: number | undefined;
}

export interface Dimensions {
  wIn: number | undefined;
  lIn: number | undefined;
  hIn: number | undefined;
  wCm: number | undefined;
  lCm: number | undefined;
  hCm: number | undefined;
}

export interface SalesRanks {
  flat: number | null;
  percent: number | null;
}

export type RetailerName =
  | "6pm"
  | "acehardware"
  | "barnesandnoble"
  | "bestbuy"
  | "bloomingkoco"
  | "boscovs"
  | "boxlunch"
  | "chewy"
  | "gamestop"
  | "hottopic"
  | "kohls"
  | "lookfantastic"
  | "macys"
  | "marshalls"
  | "newegg"
  | "scheels"
  | "sportsmans"
  | "tjmaxx"
  | "vitacost"
  | "walgreens"
  | "zappos";

export type RetailerInfoFromPdp = Omit<
  RetailerInfo,
  "productLink" | "productImageLink"
>;

export interface RetailerInfo {
  siteName: RetailerName;
  productName: string;
  productUpc: string | null;
  productCost: number;
  productCostUsed: number | null;
  productLink: string;
  productImageLink: string;
  productInStock: boolean;
  productStock: string | null;
}

export type MatchType = "upc" | "name+image";

export type AmazonInfoFromCatalog = {
  productLink: string;
  productImageLink: string;
  featuredPrice: number;
  matchType: MatchType;
  matchScoreBreakdown: Record<string, number>;
  matchScore: number;
};

export type AmazonInfoFromPdp = Omit<
  AmazonInfo,
  | "fees"
  | "productLink"
  | "productImageLink"
  | "lowestOfferByCondition"
  | "infoFromKeepa"
>;

export interface AmazonInfoFromCatalogAndPdp {
  amazonInfoFromCatalog: AmazonInfoFromCatalog;
  amazonInfoFromPdp: AmazonInfoFromPdp;
}

export interface AmazonInfo {
  asin: string;
  productName: string;
  productLink: string;
  productImageLink: string;
  hasBuyBox: boolean;
  buyBoxPrice: number | null;
  category: Category;
  lowestOfferByCondition: Record<Condition, number | undefined>;
  offers: Array<Offer>;
  amazonOnListing: boolean;
  reviewCount: number | null;
  rating: number | null;
  dimensions: Dimensions;
  weight: Weight;
  fees: Record<Condition, Array<Fee>>;

  //Keepa data
  salesRank: SalesRanks;
  infoFromKeepa: AmazonInfoFromKeepa;
}

export interface AmazonInfoFromKeepa {
  lastKeepaPollTime: Date | null;

  salesRank30DayAvg: number | null;
  salesRank60DayAvg: number | null;
  salesRank90DayAvg: number | null;
  salesRank180DayAvg: number | null;

  salesRankDrops30: number | null;
  salesRankDrops90: number | null;
  salesRankDrops180: number | null;

  reviewCount90DayAvg: number | null;
  reviewCount180DayAvg: number | null;

  buyBoxCurrent: number | null;
  buyBox90DayAvg: number | null;
  buyBox180DayAvg: number | null;
  buyBox90DayOos: number | null;

  amazon90DayOos: number | null;

  newCurrent: number | null;
  new90DayAvg: number | null;
  new180DayAvg: number | null;
  new90DayOos: number | null;

  new3rdPartyFbaCurrent: number | null;
  new3rdPartyFba90DayAvg: number | null;
  new3rdPartyFba180DayAvg: number | null;

  new3rdPartyFbmCurrent: number | null;
  new3rdPartyFbm90DayAvg: number | null;
  new3rdPartyFbm180DayAvg: number | null;

  used90DayOos: number | null;

  newOfferCount: number | null;
  newOfferCount30DayAvg: number | null;
  newOfferCount90DayAvg: number | null;
  newOfferCount180DayAvg: number | null;

  countOfRetrievedLiveOffersFba: number | null;
  countOfRetrievedLiveOffersFbm: number | null;
}

export interface ChartData {
  buyBox: ChartDataPoint[];
  amazon: ChartDataPoint[];
  new: ChartDataPoint[];
  new3rdPartyFba: ChartDataPoint[];
  new3rdPartyFbm: ChartDataPoint[];
  buyBoxUsed: ChartDataPoint[];
  used: ChartDataPoint[];
  usedLikeNew: ChartDataPoint[];
  usedVeryGood: ChartDataPoint[];
  usedGood: ChartDataPoint[];
  usedAcceptable: ChartDataPoint[];
  warehouseDeals: ChartDataPoint[];
  collectible: ChartDataPoint[];
  listPrice: ChartDataPoint[];
  salesRank: ChartDataPoint[];
  newOfferCount: ChartDataPoint[];
  usedOfferCount: ChartDataPoint[];
  collectibleOfferCount: ChartDataPoint[];
  reviewCount: ChartDataPoint[];
  rating: ChartDataPoint[];
  retailer: ChartDataPoint[];
}

export interface ProductInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  matchType: MatchType;
  matchScore: number;
  matchScoreBreakdown: Record<string, number>;
  gptTitleMatchScore: number;
  retailerInfo: RetailerInfo;
  amazonInfo: AmazonInfo;
  chartData: ChartData;
}

export type DbProductModel = DbProduct & {
  retailerInfo: DbRetailerInfo & {
    retailerHistoricalData: DbRetailerHistoricalData[];
  };
  amazonInfo: DbAmazonInfo;
  valueByCondition: DbValueByCondition[];
};
