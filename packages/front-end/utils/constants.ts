import { UseToastOptions } from "@chakra-ui/react";
import { Category, Condition, RetailerName } from "../../types/Product";
import { Referrer } from "../../types/User";

export const amazonApplicationId = process.env.AMAZON_APPLICATION_ID;
export const genericToastError: UseToastOptions = {
  title: "Error",
  description:
    "Something went wrong. Please contact support and we will resolve the issue as soon as possible.",
  status: "error",
  duration: 5000,
  isClosable: true,
};

export const conditions: Condition[] = [
  "fbaNew",
  "fbaLikeNew",
  "fbaVeryGood",
  "fbaGood",
  "fbaAcceptable",
  "fbmAny",
];
export const conditionMap: Record<
  Condition,
  {
    short: string;
    long: string;
  }
> = {
  fbaNew: { short: "N", long: "FBA - New" },
  fbaLikeNew: { short: "LN", long: "FBA - Like New" },
  fbaVeryGood: { short: "VG", long: "FBA - Very Good" },
  fbaGood: { short: "G", long: "FBA - Good" },
  fbaAcceptable: { short: "A", long: "FBA - Acceptable" },
  fbmAny: { short: "FBM", long: "FBM" },
};

export const categories: Array<Category | "All"> = [
  "All",
  "Alexa Skills",
  "Appliances",
  "Apps & Games",
  "Arts, Crafts & Sewing",
  "Audible Books & Originals",
  "Automotive",
  "Baby Products",
  "Beauty & Personal Care",
  "Books",
  "CDs & Vinyl",
  "Cell Phones & Accessories",
  "Clothing, Shoes & Jewelry",
  "Collectibles & Fine Art",
  "Digital Music",
  "Electronics",
  "Everything Else",
  "Gift Cards",
  "Grocery & Gourmet Food",
  "Handmade Products",
  "Health & Household",
  "Home & Kitchen",
  "Industrial & Scientific",
  "Kindle Store",
  "Magazine Subscriptions",
  "Movies & TV",
  "Musical Instruments",
  "Office Products",
  "Patio, Lawn & Garden",
  "Pet Supplies",
  "Software",
  "Sports & Outdoors",
  "Tools & Home Improvement",
  "Toys & Games",
  "Video Games",
  "Video Shorts",
];

export const truckEmoji = "\u{1F69A}";

export const retailerMap: Record<RetailerName, string> = {
  "6pm": "6pm",
  acehardware: "Ace Hardware",
  barnesandnoble: "Barnes & Noble",
  bestbuy: "Best Buy",
  bloomingkoco: "Blooming Koco",
  boscovs: "Boscov's",
  boxlunch: "BoxLunch",
  chewy: "Chewy",
  gamestop: "GameStop",
  hottopic: "Hot Topic",
  kohls: "Kohl's",
  lookfantastic: "Look Fantastic",
  macys: "Macy's",
  marshalls: "Marshalls",
  newegg: "Newegg",
  scheels: "Scheels",
  sportsmans: "Sportsman's Warehouse",
  tjmaxx: "TJ Maxx",
  vitacost: "Vitacost",
  walgreens: "Walgreens",
  zappos: "Zappos",
};

export const retailerLogoMap: Record<RetailerName, string> = {
  "6pm": "/images/logos/6pm.jpg",
  acehardware: "/images/logos/acehardware.jpg",
  barnesandnoble: "/images/logos/barnesandnoble.jpg",
  bestbuy: "/images/logos/bestbuy.jpg",
  bloomingkoco: "/images/logos/bloomingkoco.png",
  boscovs: "/images/logos/boscovs.jpg",
  boxlunch: "/images/logos/boxlunch.svg",
  chewy: "/images/logos/chewy.png",
  gamestop: "/images/logos/gamestop.jpg",
  hottopic: "/images/logos/hottopic.jpg",
  kohls: "/images/logos/kohls.png",
  lookfantastic: "/images/logos/lookfantastic.png",
  macys: "/images/logos/macys.jpg",
  marshalls: "/images/logos/marshalls.svg",
  newegg: "/images/logos/newegg.svg",
  scheels: "/images/logos/scheels.jpg",
  sportsmans: "/images/logos/sportsmans.svg",
  tjmaxx: "/images/logos/tjmaxx.svg",
  vitacost: "/images/logos/vitacost.jpg",
  walgreens: "/images/logos/walgreens.jpg",
  zappos: "/images/logos/zappos.svg",
};

export const reffererList: Referrer[] = [
  "reezy",
  "catrp",
  "phoenix-resale",
  "the-buy-box",
  "chad",
];

export const referrerLogoMap: Record<Referrer, string> = {
  reezy: "/images/affiliates/reezy.jpg",
  catrp: "/images/affiliates/catrp.webp",
  "phoenix-resale": "/images/affiliates/phoenix-resale.webp",
  "the-buy-box": "/images/affiliates/the-buy-box.jpg",
  chad: "/images/affiliates/the-buy-box.jpg",
};

export const referrerMessageMap: Record<
  Referrer,
  {
    title: string;
    message: string;
  }
> = {
  reezy: {
    title: "Welcome Reezy Resells Community!",
    message:
      "We are excited to have you here! We are a community of resellers who are passionate about finding the best deals and sharing them with each other.",
  },
  catrp: {
    title: "Welcome CATRP Crew!",
    message:
      "We are excited to have you here! We are a community of resellers who are passionate about finding the best deals and sharing them with each other.",
  },
  "phoenix-resale": {
    title: "Welcome Phoenix Resale Comminity!",
    message:
      "We are excited to have you here! We are a community of resellers who are passionate about finding the best deals and sharing them with each other.",
  },
  "the-buy-box": {
    title: "Welcome The Buy Box Community!",
    message:
      "We are excited to have you here! We are a community of resellers who are passionate about finding the best deals and sharing them with each other.",
  },
  chad: {
    title: "Welcome The Buy Box Community! -Chad",
    message:
      "We are excited to have you here! We are a community of resellers who are passionate about finding the best deals and sharing them with each other.",
  },
};

export const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
