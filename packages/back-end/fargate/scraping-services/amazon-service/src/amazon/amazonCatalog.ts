import { AmazonInfoFromCatalog } from "../../../../../../types/Product";
import { getDomAutoParse } from "../../../shared/scraperApi";
import {
  AI_MATCH_SCORE_VARIANCE,
  AMAZON_CATALOG_NUM_LISTINGS_TO_COMPARE,
  MIN_AI_MATCH_SCORE,
  MIN_AMAZON_RETAILER_DIFF_RATIO,
  MIN_AMAZON_FEATURED_PRICE,
} from "../../../../../shared/constants";
import { ScraperApiAmazonCatalogJson } from "../../../../../../types/ScraperApi";
import { getProductNameMatchScore } from "../utils";

export async function chooseProductFromAmazonCatalogByUPC(
  upc: string,
  _retailerProductName: string,
  _retailerProductImageLink: string,
  retailerProductPrice: number
): Promise<AmazonInfoFromCatalog | null> {
  try {
    const amazonCatalogUrl = `https://www.amazon.com/s?k=${upc}`;
    const amazonCatalogJson =
      await getDomAutoParse<ScraperApiAmazonCatalogJson>({
        url: amazonCatalogUrl,
      });

    if (!amazonCatalogJson || !amazonCatalogJson.results.length) {
      console.log(`No results for upc: ${upc}`);
      return null;
    }

    const amazonInfoFromCatalog: AmazonInfoFromCatalog = {
      productLink: amazonCatalogJson.results[0].url,
      productImageLink: amazonCatalogJson.results[0].image,
      featuredPrice: amazonCatalogJson.results[0].price,
      matchType: "upc",
      matchScoreBreakdown: {},
      matchScore: 100,
    };

    const amazonToRetailerPriceDiffRatio =
      amazonInfoFromCatalog.featuredPrice / retailerProductPrice;
    if (amazonToRetailerPriceDiffRatio < MIN_AMAZON_RETAILER_DIFF_RATIO) {
      console.log(
        `Ignoring product due to price ratio constraint. amazon: ${amazonInfoFromCatalog.featuredPrice}, retailer: ${retailerProductPrice}, ratio: ${amazonToRetailerPriceDiffRatio}`
      );
      return null;
    }

    if (amazonInfoFromCatalog.featuredPrice < MIN_AMAZON_FEATURED_PRICE) {
      console.log(
        `Ignoring product, feature price too low: ${amazonInfoFromCatalog.featuredPrice} < ${MIN_AMAZON_FEATURED_PRICE}`
      );
      return null;
    }

    return amazonInfoFromCatalog;
  } catch (err) {
    console.log(`Error chooseProductFromAmazonCatalogByUPC. upc: ${upc}`, err);
    return null;
  }
}

export async function chooseProductFromAmazonCatalogByNameAndImage(
  retailerProductName: string,
  _retailerProductImageLink: string,
  retailerProductPrice: number
): Promise<AmazonInfoFromCatalog | null> {
  try {
    const amazonCatalogUrl = `https://www.amazon.com/s?k=${retailerProductName}`;
    const amazonCatalogJson =
      await getDomAutoParse<ScraperApiAmazonCatalogJson>({
        url: amazonCatalogUrl,
      });

    if (!amazonCatalogJson || !amazonCatalogJson.results.length) {
      console.log(`No results found for product name`);
      return null;
    }

    amazonCatalogJson.results = amazonCatalogJson.results.slice(
      0,
      AMAZON_CATALOG_NUM_LISTINGS_TO_COMPARE
    );

    // Filter out products that are too cheap
    amazonCatalogJson.results = amazonCatalogJson.results.filter((result) => {
      return result.price > MIN_AMAZON_FEATURED_PRICE;
    });
    if (!amazonCatalogJson.results.length) {
      console.log(`No results w/ price > MIN_AMAZON_FEATURED_PRICE`);
      return null;
    }

    // Filter out products that do not meet the price ratio constraint
    amazonCatalogJson.results = amazonCatalogJson.results.filter((result) => {
      const amazonToRetailerPriceDiffRatio =
        result.price / retailerProductPrice;
      return amazonToRetailerPriceDiffRatio > MIN_AMAZON_RETAILER_DIFF_RATIO;
    });
    if (!amazonCatalogJson.results.length) {
      console.log(`No results after filtering by price ratio`);
      return null;
    }

    const amazonInfoFromCatalogPromises = amazonCatalogJson.results.map(
      async (result) => {
        const calculateSimilarityScoreRes = await getProductNameMatchScore({
          retailerProductName,
          amazonProductName: result.name,
        });

        if (!calculateSimilarityScoreRes) return null;

        const { imageSimilarityScore, textSimilarityScore, score } =
          calculateSimilarityScoreRes;

        return {
          productLink: result.url,
          productImageLink: result.image,
          featuredPrice: result.price,
          total_reviews: result.total_reviews,
          matchType: "name+image",
          matchScore: score,
          matchScoreBreakdown: {
            imageSimilarityScore,
            textSimilarityScore,
          },
        };
      }
    );

    const results = await Promise.all(amazonInfoFromCatalogPromises);

    type AmazonInfoFromCatalogAndReviews = AmazonInfoFromCatalog & {
      total_reviews: number;
    };
    const amazonInfoFromCatalogList = results.filter(
      Boolean
    ) as Array<AmazonInfoFromCatalogAndReviews>;

    if (amazonInfoFromCatalogList.length === 0) return null;

    //Get the listing with the best score
    const amazonInfoFromCatalogWithBestScore = amazonInfoFromCatalogList.reduce(
      (prev, curr) => {
        if (curr.matchScore > prev.matchScore) return curr;
        return prev;
      }
    );
    const bestScore = amazonInfoFromCatalogWithBestScore.matchScore;

    //Get the listing with the most reviews that is within the variance of the best score
    const amazonInfoFromCatalogWithMostReviews = amazonInfoFromCatalogList
      .filter((x) => x.matchScore >= bestScore - AI_MATCH_SCORE_VARIANCE)
      .reduce((prev, curr) => {
        if (curr.total_reviews > prev.total_reviews) return curr;
        return prev;
      });

    if (!amazonInfoFromCatalogWithMostReviews) return null;
    if (amazonInfoFromCatalogWithMostReviews.matchScore < MIN_AI_MATCH_SCORE) {
      console.log(
        `Ignoring product due to AI match score constraint. matchScore: ${amazonInfoFromCatalogWithMostReviews.matchScore}`
      );
      return null;
    }

    console.log(
      "amazonInfoFromCatalog: ",
      amazonInfoFromCatalogWithMostReviews
    );
    return amazonInfoFromCatalogWithMostReviews;
  } catch (e) {
    console.log(
      `Error chooseProductFromAmazonCatalogByNameAndImage. retailerProductName: ${retailerProductName}`
    );
    console.log(e);
    return null;
  }
}
