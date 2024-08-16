import express from "express";
import asyncHandler from "express-async-handler";
import { emailSub, healthCheck } from "../controllers/unAuth.c";

const router = express.Router();

router.post("/email-sub", asyncHandler(emailSub));
router.get("/health-check", asyncHandler(healthCheck));

export { router as unAuthRouter };
