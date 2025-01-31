interface KeepaStats {
  current: Array<number>;
  avg: Array<number>;
  avg30: Array<number>;
  avg90: Array<number>;
  avg180: Array<number>;
  atIntervalStart: Array<number>;
  min: Array<Array<number>>;
  max: Array<Array<number>>;
  minInInterval: Array<Array<number>>;
  maxInInterval: Array<Array<number>>;
  outOfStockPercentageInInterval: Array<number>;
  outOfStockPercentage30: Array<number>;
  outOfStockPercentage90: Array<number>;
  lastOffersUpdate: number;
  salesRankDrops30: number;
  salesRankDrops90: number;
  salesRankDrops180: number;
  totalOfferCount: number;
  lightningDealInfo: Array<number>;

  // following fields are only set if the offers or buybox parameter was used
  buyBoxSellerId: string;
  buyBoxPrice: number;
  buyBoxShipping: number;
  buyBoxIsUnqualified: boolean;
  buyBoxIsShippable: boolean;
  buyBoxIsPreorder: boolean;
  buyBoxIsBackorder: boolean;
  buyBoxIsFBA: boolean;
  buyBoxIsAmazon: boolean;
  buyBoxIsMAP: boolean;
  buyBoxMinOrderQuantity: boolean;
  buyBoxMaxOrderQuantity: boolean;
  buyBoxAvailabilityMessage: string;
  buyBoxShippingCountry: string;
  buyBoxIsPrimeExclusive: boolean;
  buyBoxIsPrimeEligible: boolean;
  buyBoxIsPrimePantry: boolean;
  buyBoxStats: object;
  buyBoxUsedStats: object;
  buyBoxUsedPrice: number;
  buyBoxUsedShipping: number;
  buyBoxUsedSellerId: string;
  buyBoxUsedIsFBA: boolean;
  buyBoxUsedCondition: number;

  // the following fields are only set if the offers parameter was used
  retrievedOfferCount: number;
  isAddonItem: boolean;
  sellerIdsLowestFBA: Array<string>;
  sellerIdsLowestFBM: Array<string>;
  offerCountFBA: number;
  offerCountFBM: number;
}

export interface KeepaProduct {
  productType: number;
  asin: string;
  domainId: number;
  title: string;
  trackingSince: number;
  listedSince: number;
  lastUpdate: number;
  lastRatingUpdate: number;
  lastPriceChange: number;
  lastEbayUpdate: number;
  imagesCSV: string;
  rootCategory: number;
  categories: Array<number>;
  categoryTree: Array<Record<string, unknown>>;
  parentAsin: string;
  variationCSV: string;
  frequentlyBoughtTogether: Array<string>;
  eanList: Array<string>;
  upcList: Array<string>;
  manufacturer: string;
  brand: string;
  productGroup: string;
  partNumber: string;
  binding: string;
  numberOfItems: number;
  numberOfPages: number;
  publicationDate: number;
  releaseDate: number;
  contributors: Array<Array<string>>;
  languages: Array<Array<string>>;
  model: string;
  color: string;
  size: string;
  edition: string;
  format: string;
  features: Array<string>;
  description: string;
  packageHeight: number;
  packageLength: number;
  packageWidth: number;
  packageWeight: number;
  packageQuantity: number;
  itemHeight: number;
  itemLength: number;
  itemWidth: number;
  itemWeight: number;
  availabilityAmazon: number;
  availabilityAmazonDelay: Array<number>;
  ebayListingIds: Array<number>;
  isAdultProduct: boolean;
  launchpad: boolean;
  audienceRating: string;
  newPriceIsMAP: boolean;
  isEligibleForTradeIn: boolean;
  isEligibleForSuperSaverShipping: boolean;
  fbaFees: Record<string, unknown>;
  variations: Array<Record<string, unknown>>;
  coupon: Array<number>;
  promotions: Array<Record<string, unknown>>;
  stats: KeepaStats;
  salesRankReference: number;
  salesRankReferenceHistory: Array<number>;
  salesRanks: Record<string, unknown>;
  rentalDetails: string;
  rentalSellerId: string;
  rentalPrices: Record<string, unknown>;
  offers: Array<Record<string, unknown>>;
  liveOffersOrder: Array<number>;
  buyBoxSellerIdHistory: Array<string>;
  buyBoxUsedHistory: Array<string>;
  isRedirectASIN: boolean;
  isSNS: boolean;
  offersSuccessful: boolean;
  csv: Array<Array<number>>;
}

export interface KeepaProductResponse {
  timestamp: number;
  tokensLeft: number;
  refillIn: number;
  refillRate: number;
  tokenFlowReduction: number;
  tokensConsumed: number;
  processingTimeInMs: number;
  products: Array<KeepaProduct>;
}
