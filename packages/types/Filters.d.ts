import { Category, Condition } from "./Product";

export interface Discount {
  enabled: boolean;
  type: "flat" | "percent";
  flat: number;
  percent: number;
}

export type DiscountsInterface = {
  name:
    | "flat"
    | "percent"
    | "buy 1 get 1 free"
    | "buy 2 get 1 free"
    | "buy 1 get 1 half off"
    | "buy 2 get 1 half off";
} & Discount;

export type MatchConfidence = "low" | "medium" | "high";

export interface FiltersInterface {
  enabledMap: {
    profit: boolean;
    roi: boolean;
    salesRank: boolean;
    amazonOnListing: boolean;
    hasBuyBox: boolean;
    condition: boolean;
    numSellersFba: boolean;
    numSellersFbm: boolean;
    salesDropsPerMonth: boolean;
    category: boolean;
    keywords: boolean;
    excludedKeywords: boolean;
    retailerList: boolean;
    match: boolean;
  };
  profit: number;
  roi: number;
  category: Category | "All";
  condition: Condition | "all";
  salesRank: {
    type: "flat" | "percent";
    flat: number;
    percent: number;
  };
  amazonOnListing: boolean;
  hasBuyBox: boolean;
  numSellersFba: number;
  numSellersFbm: number;
  keywords: string[];
  excludedKeywords: string[];
  retailerList: string[];
  match: {
    type: "all" | "upc";
    confidence: MatchConfidence;
  };
}

export interface SortersInterface {
  sortType: "lowToHigh" | "highToLow";
  sorter: "profit" | "roi" | "salesRank" | "lastUpdated";
}

export interface FiltersSortersDiscountsInterface {
  filters: FiltersInterface;
  sorters: SortersInterface;
  discounts: DiscountsInterface;
}
