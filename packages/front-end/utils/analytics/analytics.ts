import { isProd } from "../envVars";
import googleAnalytics from "./googleAnalytics";
import facebookAnalytics from "./facebookAnalytics";

export type ConversionType = "onboarding" | "trialing" | "active";

export const conversionValueMap = {
  onboarding: 0.89,
  trialing: 8.9,
  active: 89,
};

export function trackConversion(conversionType: ConversionType) {
  if (!isProd) return Promise.resolve();

  return Promise.all([
    googleAnalytics.reportAdConversion(conversionType),
    facebookAnalytics.reportAdConversion(conversionType),
  ]);
}
