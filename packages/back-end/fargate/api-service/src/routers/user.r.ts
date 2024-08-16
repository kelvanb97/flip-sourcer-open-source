import express from "express";
import z from "zod";
import asyncHandler from "express-async-handler";
import {
  getDisplayUser,
  spApiInit,
  updateGeneralSettings,
  addProductToProductBlacklist,
  createSavedProduct,
  removeFromSavedProducts,
  getSavedProducts,
} from "../controllers/user.c";
import { authenticateSession } from "../middleware/authenticateSession.mid";
import { validateRequestMiddleware } from "../utils/validateRequestMiddleware";

const router = express.Router();

//Need to authenticate session by session token for these routes
router.use(authenticateSession);
router.get("", asyncHandler(getDisplayUser));
router.post("/sp-api-init", asyncHandler(spApiInit));
router.put(
  "/general-settings",
  validateRequestMiddleware({
    body: z
      .object({
        defaultFbaFee: z.number().min(0),
        perUnitCosts: z.object({
          flat: z.number().min(0),
          percent: z.number().min(0),
        }),
        shippingCosts: z.object({
          perPound: z.number().min(0),
          perOunce: z.number().min(0),
          perKilogram: z.number().min(0),
          perGram: z.number().min(0),
          perUnit: z.number().min(0),
        }),
        cashback: z.object({
          flat: z.number().min(0),
          percent: z.number().min(0),
        }),
        measurementSystem: z.union([
          z.literal("imperial"),
          z.literal("metric"),
        ]),
      })
      .strict(),
  }),
  asyncHandler(updateGeneralSettings)
);
router.post(
  "/add-to-blacklist/:id",
  validateRequestMiddleware({
    params: z.object({ id: z.string() }).strict(),
  }),
  asyncHandler(addProductToProductBlacklist)
);
router.post(
  "/saved-products",
  validateRequestMiddleware({
    body: z.object({
      productInfo: z.any(),
    }),
  }),
  asyncHandler(createSavedProduct)
);
router.delete(
  "/saved-products/:id",
  validateRequestMiddleware({
    params: z.object({ id: z.string() }).strict(),
  }),
  asyncHandler(removeFromSavedProducts)
);
router.post(
  "/list-saved-products",
  validateRequestMiddleware({
    body: z.object({
      page: z.number(),
      pageSize: z.number(),
    }),
  }),
  asyncHandler(getSavedProducts)
);

export { router as userRouter };
