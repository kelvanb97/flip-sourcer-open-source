import express from "express";
import asyncHandler from "express-async-handler";
import {
  initPaymentMethod,
  listPaymentMethods,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  handleSubscription,
  getSubscriptionInfo,
  cancelSubscription,
} from "../controllers/stripe.c";
import { authenticateSession } from "../middleware/authenticateSession.mid";
import { validateRequestMiddleware } from "../utils/validateRequestMiddleware";
import z from "zod";

const router = express.Router();

//Need to authenticate session for these routes
router.use(authenticateSession);
router.post("/init-payment-method", asyncHandler(initPaymentMethod));
router.get("/payment-method", asyncHandler(listPaymentMethods));
router.delete("/payment-method/:id", asyncHandler(deletePaymentMethod));
router.post(
  "/default-payment-method/:id",
  asyncHandler(setDefaultPaymentMethod)
);
router.get("/subscription", asyncHandler(getSubscriptionInfo));
router.post("/subscription", asyncHandler(handleSubscription));
router.put(
  "/cancel-subscription",
  validateRequestMiddleware({
    body: z.object({ feedback: z.string() }),
  }),
  asyncHandler(cancelSubscription)
);

export { router as stripeRouter };
