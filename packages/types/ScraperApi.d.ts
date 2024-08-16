export type ScraperApiCountry =
  | "us"
  | "uk"
  | "ca"
  | "de"
  | "es"
  | "fr"
  | "it"
  | "jp"
  | "in"
  | "cn"
  | "sg"
  | "mx"
  | "ae"
  | "br"
  | "nl"
  | "au"
  | "tr"
  | "sa"
  | "se"
  | "pl";

export type ScraperApiTLD =
  | ".com"
  | ".co.uk"
  | ".ca"
  | ".de"
  | ".es"
  | ".fr"
  | ".it"
  | ".co.jp"
  | ".in"
  | ".cn"
  | ".com.sg"
  | ".com.mx"
  | ".ae"
  | ".com.br"
  | ".nl"
  | ".com.au"
  | ".com.tr"
  | ".sa"
  | ".se"
  | ".pl";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ScraperApiAmazonCatalogJson {
  ads: any[];
  amazons_choise: any[];
  results: Array<{
    type: string;
    position: number;
    name: string;
    image: string;
    has_prime: boolean;
    is_best_seller: boolean;
    is_amazon_choice: boolean;
    is_limited_deal: boolean;
    stars: number;
    total_reviews: number;
    url: string;
    availability_quantity: number;
    spec: any;
    price_string: string;
    price_symbol: string;
    price: number;
  }>;
  explore_more_items: any[];
  pagination: string[];
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export type CustomizationOptions = Record<
  string,
  Array<{
    is_selected: boolean | null;
    url: string | null;
    value: string | null;
    price_string: string | null;
    price: number | null;
    image: string | null;
  }>
> | null;

export interface ScraperApiAmazonPdpJson {
  name: string | null;
  product_information: {
    asin: string | null;
    product_dimensions: string | null;
    color: string | null;
    material: string | null;
    style: string | null;
    product_care_instructions: string | null;
    number_of_items: string | null;
    brand: string | null;
    fabric_type: string | null;
    unit_count: string | null;
    item_weight: string | null;
    item_model_number: string | null;
    manufacturer_recommended_age: string | null;
    best_sellers_rank: string[] | null;
    customer_reviews: {
      ratings_count: number | null;
      stars: string | number | null;
    } | null;
    is_discontinued_by_manufacturer: string;
    release_date: string;
    manufacturer: string;
  } | null;
  brand: string | null;
  brand_url: string | null;
  pricing: string | null;
  list_price: string | null;
  shipping_price: string | number | null;
  availability_status: string | null;
  images: string[] | null;
  product_category: string | null;
  average_rating: number | null;
  small_description: string | null;
  feature_bullets: string[] | null;
  total_reviews: number | null;
  total_answered_questions: number | null;
  model: string | null;
  customization_options: CustomizationOptions;
  seller_id: string | null;
  seller_name: string | null;
  fulfilled_by_amazon: boolean | null;
  fast_track_message: string | null;
  aplus_present: boolean | null;
}
