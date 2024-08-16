//Scraper API
export const SCRAPER_API_CONCURRENCY_LIMIT = 900;

//Catalog Scraper
export const CATALOG_TASK_COUNT = 134;
export const START_PDP_AT_TASK_COUNT = 50;
export const MAX_SUCCESSFUL_PAGE_COUNT = 100;

//PDP Scraper
export const PDP_TASK_COUNT = 300;
export const NUM_PDP_PAGES_TO_SCRAPE_AT_A_TIME = 50;
export const AMAZON_CATALOG_NUM_LISTINGS_TO_COMPARE = 3;

//GPT Scraper
export const GPT_TITLE_MATCH_TASK_COUNT = 10;
export const GPT_TITLE_MATCH_CONCURRENCY_LIMIT = 30;
export const GPT_TITLE_MATCH_ITERATIONS = 5;
export const GPT_TITLE_MATCH_DESIRED_SCORE = 1;
export const GPT_THROW_OUT_SCORE = -3;

//Keepa
export const KEEPA_TASK_COUNT = 1;

//General
export const LINKS_UPSERT_CHUNK_SIZE = 50;
export const MIN_LEADING_ROI = -30;
export const AI_MATCH_SCORE_VARIANCE = 5;
export const MIN_AI_MATCH_SCORE = 70;
export const MIN_AMAZON_RETAILER_DIFF_RATIO = 0.9;
export const MIN_AMAZON_FEATURED_PRICE = 10;
export const MIN_RETAILER_PRICE = 5;

//API
export const SESSION_EXTENSION_HOURS = 48;
export const MATCH_FILTERS_MAP = {
  low: {
    matchScore: MIN_AI_MATCH_SCORE,
    gptTitleMatchScore: GPT_TITLE_MATCH_DESIRED_SCORE,
  },
  medium: {
    matchScore: 77.5,
    gptTitleMatchScore: 3,
  },
  high: {
    matchScore: 85,
    gptTitleMatchScore: 5,
  },
};
