import jsdom from "jsdom";
import {
  Offer,
  Weight,
  Dimensions,
  Category,
  AmazonInfoFromPdp,
  SalesRanks,
} from "../../../../../../types/Product";
import {
  isNumber,
  priceStrToNum,
  sleep,
  standardizeString,
} from "../../../shared/general";
import { getDom, getDomAutoParse } from "../../../shared/scraperApi";
import {
  CustomizationOptions,
  ScraperApiAmazonPdpJson,
} from "../../../../../../types/ScraperApi";
import { gpt_3_5_turbo } from "../../../../../shared/openAi";

//amazonPdp.test.ts give the following:
const productsInCategoryMap: Record<string, number> = {
  "Alexa Skills": 109672,
  Appliances: 1427805,
  "Apps & Games": 855552,
  "Arts, Crafts & Sewing": 14572741,
  "Audible Books & Originals": 743517,
  Automotive: 38529301,
  "Baby Products": 3929318,
  "Beauty & Personal Care": 13514529,
  Books: 97577866,
  "CDs & Vinyl": 8149156,
  "Cell Phones & Accessories": 22166715,
  "Clothing, Shoes & Jewelry": 222583486,
  "Collectibles & Fine Art": 8409025,
  "Digital Music": 60958381,
  Electronics: 22963718,
  "Everything Else": 14066732,
  "Gift Cards": 28595,
  "Grocery & Gourmet Food": 3719909,
  "Handmade Products": 2878246,
  "Health & Household": 10307475,
  "Home & Kitchen": 131440488,
  "Industrial & Scientific": 18502087,
  "Kindle Store": 6683512,
  "Magazine Subscriptions": 42971,
  "Movies & TV": 6906038,
  "Musical Instruments": 2505622,
  "Office Products": 10923205,
  "Patio, Lawn & Garden": 16980561,
  "Pet Supplies": 7985987,
  Software: 214113,
  "Sports & Outdoors": 37739891,
  "Tools & Home Improvement": 32573064,
  "Toys & Games": 8625010,
  "Video Games": 1261374,
  "Video Shorts": 169657,
};

function extractAsin(url: string): string | null {
  const asinMatch = url.match(/\/(?:dp|gp\/product)\/([^/]+)/i);

  if (!asinMatch || !asinMatch[1])
    throw new Error(`Failed to extract asin from url: ${url}`);

  return asinMatch[1];
}

function getChannel(offerDoc: Document): "fbm" | "fba" | undefined {
  const shipsFrom = offerDoc
    .getElementById("aod-offer-shipsFrom")
    ?.getElementsByClassName("a-fixed-left-grid-col a-col-right")[0]
    ?.children[0]?.textContent?.trim();
  if (!shipsFrom) return undefined;

  return shipsFrom.toLowerCase().includes("amazon") ? "fba" : "fbm";
}

function parseOffer(
  offerDoc: Document,
  isPinnedOffer: boolean = false
): Offer | undefined {
  const sellerName =
    offerDoc
      .getElementById("aod-offer-soldBy")
      ?.getElementsByTagName("a")[0]
      ?.textContent?.trim() ||
    offerDoc
      .getElementById("aod-offer-soldBy")
      ?.getElementsByClassName("a-col-right")[0]
      ?.textContent?.toLowerCase()
      .trim();

  if (!sellerName) return undefined;

  let sellerLink = offerDoc
    .getElementById("aod-offer-soldBy")
    ?.getElementsByTagName("a")[0]
    ?.getAttribute("href");
  sellerLink = sellerLink
    ? sellerLink?.includes("http")
      ? sellerLink
      : "https://www.amazon.com" + sellerLink
    : sellerName.includes("amazon")
    ? "https://www.amazon.com"
    : undefined;

  const condition = offerDoc
    .getElementById("aod-offer-heading")
    ?.children[0]?.textContent?.trim()
    .replace(/[^a-zA-Z]/g, "");

  const numReviews = offerDoc
    .getElementById("seller-rating-count-{iter}")
    ?.textContent?.trim()
    .split("ratings")[0]
    ?.split("(")[1];

  const rating = offerDoc
    .getElementById("seller-rating-count-{iter}")
    ?.textContent?.trim()
    .split("%")[0]
    ?.split(")")[1];

  const priceDollars = offerDoc
    .getElementsByClassName("a-price-whole")[0]
    ?.textContent?.trim()
    .replace(/[^0-9]/g, "");
  const priceCents = offerDoc
    .getElementsByClassName("a-price-fraction")[0]
    ?.textContent?.trim()
    .replace(/[^0-9]/g, "");
  const price = priceStrToNum(priceDollars + "." + priceCents);

  const stockElem = offerDoc.getElementsByClassName("a-declarative")[1];
  const stockAttr = stockElem
    ? stockElem.getAttribute("data-aod-atc-action")
    : undefined;
  const stockJson = stockAttr ? JSON.parse(stockAttr) : undefined;
  const stock = stockJson ? stockJson.maxQty : undefined;

  const channel = getChannel(offerDoc);

  if (!sellerName || !sellerLink || !condition || !price || !channel) {
    if (isPinnedOffer) console.log("Pinned offer parse miss");
    return undefined;
  }
  return {
    isBuyBox: isPinnedOffer,
    sellerName,
    sellerLink,
    condition,
    rating: rating ? parseFloat(rating) : undefined,
    numReviews: numReviews ? parseInt(numReviews) : undefined,
    price,
    channel,
    stock,
  };
}

async function getOffers(asin: string): Promise<Array<Offer> | null> {
  const offersPageUrl = `https://www.amazon.com/gp/aod/ajax?asin=${asin}`;
  const offersPageDocument = await getDom({
    url: offersPageUrl,
  });

  if (!offersPageDocument) {
    console.log(`Failed to getDom: ${offersPageUrl}`);
    return null;
  }

  const offerArray: Array<Offer> = [];

  //The pinned offer is always the buy box
  const pinnedOfferElem = offersPageDocument.getElementById("aod-pinned-offer");
  if (pinnedOfferElem) {
    const pinnedOffer = parseOffer(
      new jsdom.JSDOM(pinnedOfferElem.innerHTML).window.document,
      true
    );
    if (pinnedOffer) offerArray.push(pinnedOffer);
  }

  const offersDiv = offersPageDocument.getElementById("aod-offer-list");
  const offerElems = offersDiv?.getElementsByClassName(
    "a-section a-spacing-none a-padding-base aod-information-block aod-clear-float"
  );
  if (offerElems) {
    for (let i = 0; i < offerElems.length; i++) {
      const offer = parseOffer(
        new jsdom.JSDOM(offerElems[i].innerHTML).window.document
      );
      if (offer) offerArray.push(offer);
    }
  }

  return offerArray;
}

function parseDimensions(dimensionsStr: string | undefined | null): Dimensions {
  const undefinedDimensions = {
    wIn: undefined,
    lIn: undefined,
    hIn: undefined,
    wCm: undefined,
    lCm: undefined,
    hCm: undefined,
  };

  if (!dimensionsStr) return undefinedDimensions;

  dimensionsStr = dimensionsStr.toLocaleLowerCase();
  if (dimensionsStr.includes("inches")) {
    const dimensionsArray = dimensionsStr.split("x");
    if (dimensionsArray.length !== 3) return undefinedDimensions;

    const wIn = parseFloat(dimensionsArray[0].replace(/[^0-9.]/g, ""));
    const lIn = parseFloat(dimensionsArray[1].replace(/[^0-9.]/g, ""));
    const hIn = parseFloat(dimensionsArray[2].replace(/[^0-9.]/g, ""));

    const wCm = parseFloat((wIn * 2.54).toFixed(2));
    const lCm = parseFloat((lIn * 2.54).toFixed(2));
    const hCm = parseFloat((hIn * 2.54).toFixed(2));

    return {
      wIn,
      lIn,
      hIn,
      wCm,
      lCm,
      hCm,
    };
  } else {
    //todo: parse other dimension types
    return undefinedDimensions;
  }
}

function parseWeight(weightStr: string | undefined | null): Weight {
  const undefinedWeight = {
    lbs: undefined,
    oz: undefined,
    kg: undefined,
    g: undefined,
  };

  if (!weightStr) return undefinedWeight;

  weightStr = weightStr.toLocaleLowerCase();
  if (weightStr.includes("pounds")) {
    const formattedWeight = weightStr.replace(/[^0-9.]/g, "");

    const lbs = parseFloat(formattedWeight);
    const oz = parseFloat((lbs * 16).toFixed(2));
    const kg = parseFloat((lbs / 2.205).toFixed(2));
    const g = parseFloat((kg * 1000).toFixed(2));

    return {
      lbs,
      oz,
      kg,
      g,
    };
  } else if (weightStr.includes("ounces")) {
    const formattedWeight = weightStr.replace(/[^0-9.]/g, "");

    const oz = parseFloat(formattedWeight);
    const lbs = parseFloat((oz / 16).toFixed(2));
    const kg = parseFloat((lbs / 2.205).toFixed(2));
    const g = parseFloat((kg * 1000).toFixed(2));

    return {
      lbs,
      oz,
      kg,
      g,
    };
  } else {
    return undefinedWeight;
  }
}

function getCategory(categoryStr: string | null): Category | null {
  if (!categoryStr) return null;
  return categoryStr.split(` › `)[0] as Category;
}

function getAmazonOnListing(offers: Offer[]): boolean {
  return (
    offers.filter((offer) =>
      offer.sellerName?.toLocaleLowerCase()?.includes("amazon")
    ).length > 0
  );
}

function getSalesRanks(salesRankRaw: string, category: Category): SalesRanks {
  const salesRankFlat = salesRankRaw
    ? parseFloat(salesRankRaw.split(" ")[0].replace(/[^0-9]/g, ""))
    : null;
  const productsInCategory: number | undefined =
    productsInCategoryMap[category || ""];
  const salesRank = {
    flat: salesRankFlat,
    percent:
      salesRankFlat && productsInCategory
        ? parseFloat(((salesRankFlat / productsInCategory) * 100).toFixed(2))
        : null,
  };
  return salesRank;
}

function parseReviewCount(reviewCount: number | undefined | null) {
  if (!reviewCount) return 0;
  return reviewCount;
}

function parseRating(stars: string | number | undefined | null) {
  if (!stars) return null;

  if (typeof stars === "number") return stars;

  return parseFloat(stars.split(" ")[0]);
}

export async function getBestVariation(
  retailerProductName: string,
  variationNames: string[],
  retryCount = 0
): Promise<number | null> {
  const bestVariationQuestion = `Which Amazon variation index best matches the retailer product name: ${retailerProductName}? \n${variationNames
    .map((variationName, index) => `${index}. ${variationName}`)
    .join("\n")}`;

  const gptRes = await gpt_3_5_turbo(bestVariationQuestion);

  if (gptRes.status !== 200 || !gptRes.content || !isNumber(gptRes.content)) {
    await sleep(1000);
    if (retryCount < 3)
      return await getBestVariation(
        retailerProductName,
        variationNames,
        retryCount + 1
      );
    else return null;
  }

  const bestVariationIndex = parseInt(gptRes.content);
  return bestVariationIndex;
}

async function getBetterVariationUrl(
  retailerProductName: string,
  customizationOptions: CustomizationOptions
): Promise<string | null> {
  if (!customizationOptions) return null;
  if (Object.entries(customizationOptions).length === 0) return null;
  //todo: handle products with multiple customization options (levels of variation)
  if (Object.entries(customizationOptions).length > 1) return null;

  const firstCustomizationOption = Object.values(customizationOptions)[0];
  const variations = firstCustomizationOption.map(
    (variation) => variation.value || ""
  );

  const bestVariationIndex = await getBestVariation(
    retailerProductName,
    variations
  );

  if (!bestVariationIndex) return null;

  return firstCustomizationOption[bestVariationIndex].url;
}

function extractQuantity(productName: string): number {
  // List of unit indicators in regex format
  const indicators = [
    "case of \\d+",
    "case of\\d+",
    "pack of \\d+",
    "pack of\\d+",
    "bundle of \\d+",
    "bundle of\\d+",
    "set of \\d+",
    "set of\\d+",
    "sets of \\d+",
    "sets of\\d+",
    "lot of \\d+",
    "lot of\\d+",
    "box of \\d+",
    "box of\\d+",
    "boxes of \\d+",
    "boxes of\\d+",
    "\\d+ pack",
    "\\d+pack",
    "\\d+ pk",
    "\\d+pk",
    "\\d+ pairs",
    "\\d+pairs",
    "\\d+ ct",
    "\\d+ct",
  ];

  // Create a regex that matches any of the unit indicators followed by a number
  const regex = new RegExp(indicators.join("|"), "i");

  // Use the regex to find the units part of the product name
  const match = productName.match(regex);
  if (match) {
    // Extract the number from the match
    const numberMatch = match[0].match(/\d+/);
    if (numberMatch) return parseInt(numberMatch[0]);
  }

  // If no units are found, assume it's 1
  return 1;
}

export function quantitySanityCheck(
  retailerProductName: string,
  amazonProductName: string
): boolean {
  // Standardize the product names
  const standardizedRetailerName = standardizeString(retailerProductName);
  const standardizedAmazonName = standardizeString(amazonProductName);

  // Extract the quantities
  const retailerQuantity = extractQuantity(standardizedRetailerName);
  const amazonQuantity = extractQuantity(standardizedAmazonName);

  // Compare the quantities
  return retailerQuantity === amazonQuantity;
}

interface GetAmazonInfoFromPdpProps {
  retailerProductName: string;
  amazonPdpLink: string;
  amazonImageLink: string;
}

interface GetAmazonInfoFromPdpRes {
  amazonInfoFromPdp: AmazonInfoFromPdp;
  amazonPdpLink: string;
  amazonImageLink: string;
}

export async function getAmazonInfoFromPdp({
  retailerProductName,
  amazonPdpLink,
  amazonImageLink,
}: GetAmazonInfoFromPdpProps): Promise<GetAmazonInfoFromPdpRes | null> {
  console.log("Starting getAmazonInfoFromPdp");
  let amazonPdpJson = await getDomAutoParse<ScraperApiAmazonPdpJson>({
    url: amazonPdpLink,
  });

  if (!amazonPdpJson) {
    console.log(`Failed getAmazonPdpPageJson: ${amazonPdpLink}`);
    return null;
  }

  const betterVariationUrl = await getBetterVariationUrl(
    retailerProductName,
    amazonPdpJson.customization_options
  );
  if (betterVariationUrl) {
    amazonPdpLink = betterVariationUrl;

    amazonPdpJson = await getDomAutoParse<ScraperApiAmazonPdpJson>({
      url: amazonPdpLink,
    });

    if (!amazonPdpJson) {
      console.log(`Failed getAmazonPdpPageJson: ${amazonPdpLink}`);
      return null;
    } else if (!amazonPdpJson.images || !amazonPdpJson.images[0]) {
      console.log(`Failed no image found: ${amazonPdpLink}`);
      return null;
    }

    amazonImageLink = amazonPdpJson.images[0];
  }

  const asin =
    amazonPdpJson.product_information?.asin || extractAsin(amazonPdpLink);

  if (!amazonPdpJson.name) {
    console.log(`Failed no name found: ${amazonPdpLink}`);
    return null;
  } else if (!asin) {
    console.log(`Failed no asin found: ${amazonPdpLink}`);
    return null;
  } else if (!quantitySanityCheck(retailerProductName, amazonPdpJson.name)) {
    console.log(`Failed quantitySanityCheck: ${amazonPdpLink}`);
    return null;
  }

  const offers = await getOffers(asin);
  if (!offers || offers.length <= 0) {
    console.log(`Failed getOffers: ${asin}`);
    return null;
  }

  const category = getCategory(amazonPdpJson.product_category);
  if (!category) {
    console.log(`Failed no category: ${amazonPdpLink}`);
    return null;
  } else if (
    !amazonPdpJson.product_information?.best_sellers_rank ||
    !amazonPdpJson.product_information?.best_sellers_rank[0]
  ) {
    console.log(`Failed no salesRank: ${amazonPdpLink}`);
    return null;
  }

  const amazonInfoFromPdp: AmazonInfoFromPdp = {
    asin,
    productName: amazonPdpJson.name,
    hasBuyBox: offers.filter((offer) => offer.isBuyBox).length > 0,
    buyBoxPrice: offers.filter((offer) => offer.isBuyBox)[0]?.price,
    category,
    offers,
    amazonOnListing: getAmazonOnListing(offers),
    reviewCount: parseReviewCount(
      amazonPdpJson.product_information?.customer_reviews?.ratings_count
    ),
    rating: parseRating(
      amazonPdpJson.product_information?.customer_reviews?.stars
    ),
    dimensions: parseDimensions(
      amazonPdpJson.product_information.product_dimensions
    ),
    weight: parseWeight(amazonPdpJson.product_information.item_weight),
    salesRank: getSalesRanks(
      amazonPdpJson.product_information.best_sellers_rank[0],
      category
    ),
  };

  return {
    amazonInfoFromPdp,
    amazonPdpLink,
    amazonImageLink,
  };
}
