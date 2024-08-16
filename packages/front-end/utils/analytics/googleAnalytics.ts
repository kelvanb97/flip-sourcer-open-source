import ReactGA from "react-ga4";
import { Category, EventName } from "../../../types/Analytics";
import { ConversionType, conversionValueMap } from "./analytics";
import { isProd } from "../envVars";
import { getAnalyticsUUID } from "./analyticsHelpers";

const analyticsUUID = getAnalyticsUUID();
let isInitialized = false;

function init() {
  if (isInitialized) return;
  ReactGA.initialize([
    {
      trackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
      gaOptions: {},
      gtagOptions: {},
    },
    {
      trackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID_2,
      gaOptions: {},
      gtagOptions: {},
    },
  ]);
  ReactGA.set({ userId: analyticsUUID });
  isInitialized = true;
}

function pageView(path: string) {
  if (!isProd) return;
  if (!isInitialized) init();
  ReactGA.send({ hitType: "pageview", page: path });
}

function trackEvent(category: Category, eventName: EventName) {
  if (!isProd) return;
  if (!isInitialized) init();
  ReactGA.event({
    category,
    action: eventName,
  });
}

const conversionMap: Record<ConversionType, string> = {
  onboarding: "a6IMCLmLy-AYEJSjnZgq",
  trialing: "wGsbCLyLy-AYEJSjnZgq",
  active: "FnqUCL-Ly-AYEJSjnZgq",
};

function reportAdConversion(conversionType: ConversionType) {
  if (!isProd) return;
  if (!isInitialized) init();
  ReactGA.gtag("event", "conversion", {
    send_to: `${process.env.NEXT_PUBLIC_GA_TRACKING_ID_2}/${conversionMap[conversionType]}`,
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
