import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateSession } from "../middleware/authenticateSession.mid";
import {
  signUp,
  login,
  validateSession,
  sendEmailVerification,
  verifyEmail,
} from "../controllers/auth.c";
import { validateRequestMiddleware } from "../utils/validateRequestMiddleware";
import z from "zod";

const router = express.Router();

//Don't need to authenticate session for these routes
router.post(
  "/signup",
  validateRequestMiddleware({
    body: z
      .object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
        termsAgreed: z.boolean(),
        referrer: z.string().nullable(),
      })
      .strict(),
  }),
  asyncHandler(signUp)
);
router.post("/login", asyncHandler(login));

//Need to authenticate session for these routes
router.use(authenticateSession);
router.post("/validate-session", asyncHandler(validateSession));
router.post("/send-email-verification", asyncHandler(sendEmailVerification));
router.post(
  "/verify-email/:token",
  validateRequestMiddleware({
    params: z
      .object({
        token: z.string(),
      })
      .strict(),
  }),
  asyncHandler(verifyEmail)
);

export { router as authRouter };
