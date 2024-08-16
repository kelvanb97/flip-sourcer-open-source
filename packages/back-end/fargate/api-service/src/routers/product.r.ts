import express from "express";
import asyncHandler from "express-async-handler";
import {
  getProducts,
  getProduct,
  getProductFeesSpecificToUser,
  updateKeepaData,
  reportMismatch,
  superDeleteProduct,
} from "../controllers/product.c";
import { authenticateSession } from "../middleware/authenticateSession.mid";
import z from "zod";
import { validateRequestMiddleware } from "../utils/validateRequestMiddleware";

const router = express.Router();

//Need to authenticate session for these routes
router.use(authenticateSession);
router.get(
  "/:id",
  validateRequestMiddleware({
    params: z.object({ id: z.string() }).strict(),
  }),
  asyncHandler(getProduct)
);
router.post(
  "",
  validateRequestMiddleware({
    body: z
      .object({
        filtersSortersDiscounts: z.object({
          filters: z.object({
            enabledMap: z.object({
              profit: z.boolean(),
              roi: z.boolean(),
              salesRank: z.boolean(),
              amazonOnListing: z.boolean(),
              hasBuyBox: z.boolean(),
              condition: z.boolean(),
              numSellersFba: z.boolean(),
              numSellersFbm: z.boolean(),
              salesDropsPerMonth: z.boolean(),
              category: z.boolean(),
              keywords: z.boolean(),
              excludedKeywords: z.boolean(),
              retailerList: z.boolean(),
              match: z.boolean(),
            }),
            profit: z.number(),
            roi: z.number(),
            category: z.union([
              z.literal("All"),
              z.literal("Alexa Skills"),
              z.literal("Appliances"),
              z.literal("Apps & Games"),
              z.literal("Arts, Crafts & Sewing"),
              z.literal("Audible Books & Originals"),
              z.literal("Automotive"),
              z.literal("Baby Products"),
              z.literal("Beauty & Personal Care"),
              z.literal("Books"),
              z.literal("CDs & Vinyl"),
              z.literal("Cell Phones & Accessories"),
              z.literal("Clothing, Shoes & Jewelry"),
              z.literal("Collectibles & Fine Art"),
              z.literal("Digital Music"),
              z.literal("Electronics"),
              z.literal("Everything Else"),
              z.literal("Gift Cards"),
              z.literal("Grocery & Gourmet Food"),
              z.literal("Handmade Products"),
              z.literal("Health & Household"),
              z.literal("Home & Kitchen"),
              z.literal("Industrial & Scientific"),
              z.literal("Kindle Store"),
              z.literal("Magazine Subscriptions"),
              z.literal("Movies & TV"),
              z.literal("Musical Instruments"),
              z.literal("Office Products"),
              z.literal("Patio, Lawn & Garden"),
              z.literal("Pet Supplies"),
              z.literal("Software"),
              z.literal("Sports & Outdoors"),
              z.literal("Tools & Home Improvement"),
              z.literal("Toys & Games"),
              z.literal("Video Games"),
              z.literal("Video Shorts"),
            ]),
            condition: z.union([
              z.literal("all"),
              z.literal("fbaNew"),
              z.literal("fbaVeryGood"),
              z.literal("fbaGood"),
              z.literal("fbaAcceptable"),
              z.literal("fbmAny"),
            ]),
            salesRank: z.object({
              type: z.union([z.literal("flat"), z.literal("percent")]),
              flat: z.number(),
              percent: z.number(),
            }),
            amazonOnListing: z.boolean(),
            hasBuyBox: z.boolean(),
            numSellersFba: z.number(),
            numSellersFbm: z.number(),
            keywords: z.array(z.string()),
            excludedKeywords: z.array(z.string()),
            retailerList: z.array(z.string()),
            match: z.object({
              type: z.union([z.literal("all"), z.literal("upc")]),
              confidence: z.union([
                z.literal("low"),
                z.literal("medium"),
                z.literal("high"),
              ]),
            }),
          }),
          sorters: z.object({
            sortType: z.union([z.literal("lowToHigh"), z.literal("highToLow")]),
            sorter: z.union([
              z.literal("profit"),
              z.literal("roi"),
              z.literal("salesRank"),
              z.literal("lastUpdated"),
            ]),
          }),
          discounts: z.object({
            enabled: z.boolean(),
            name: z.union([
              z.literal("flat"),
              z.literal("percent"),
              z.literal("buy 1 get 1 free"),
              z.literal("buy 2 get 1 free"),
              z.literal("buy 1 get 1 half off"),
              z.literal("buy 2 get 1 half off"),
            ]),
            type: z.union([z.literal("flat"), z.literal("percent")]),
            flat: z.number(),
            percent: z.number(),
          }),
        }),
        page: z.number(),
        pageSize: z.number(),
      })
      .strict(),
  }),
  asyncHandler(getProducts)
);
router.post(
  "/fees-specific-to-user",
  validateRequestMiddleware({
    body: z
      .object({
        purchasePrice: z.number(),
        salePrice: z.number(),
        asin: z.string(),
        weightInPounds: z.number(),
      })
      .strict(),
  }),
  asyncHandler(getProductFeesSpecificToUser)
);
router.post(
  "/:id/update-keepa-data",
  validateRequestMiddleware({
    params: z.object({ id: z.string() }).strict(),
  }),
  asyncHandler(updateKeepaData)
);
router.post(
  "/:id/report-mismatch",
  validateRequestMiddleware({
    params: z.object({ id: z.string() }).strict(),
  }),
  asyncHandler(reportMismatch)
);
router.delete(
  "/:id/super-delete",
  validateRequestMiddleware({
    params: z.object({ id: z.string() }).strict(),
  }),
  asyncHandler(superDeleteProduct)
);

export { router as productRouter };
