import { EventName } from "../../../types/Analytics";
import { isProd } from "../envVars";
import { ConversionType, conversionValueMap } from "./analytics";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
let ReactPixel: any;
if (typeof window !== "undefined") {
  //eslint-disable-next-line @typescript-eslint/no-var-requires
  ReactPixel = require("react-facebook-pixel").default;
}

let isInitialized = false;

function init() {
  if (!ReactPixel || isInitialized) return;
  ReactPixel.init(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
  isInitialized = true;
}

function pageView() {
  if (!isProd) return;
  if (!isInitialized) init();
  ReactPixel.pageView();
}

function trackEvent(eventName: EventName) {
  if (!isProd) return;
  if (!isInitialized) init();
  ReactPixel.track(eventName);
}

const conversionMap: Record<ConversionType, string> = {
  onboarding: "Lead",
  trialing: "CompleteRegistration",
  active: "Purchase",
};

function reportAdConversion(conversionType: ConversionType) {
  if (!isProd) return;
  if (!isInitialized) init();
  ReactPixel.track(conversionMap[conversionType], {
    value: conversionValueMap[conversionType],
    currency: "USD",
  });
}

export default {
  init,
  pageView,
  trackEvent,
  reportAdConversion,
};
