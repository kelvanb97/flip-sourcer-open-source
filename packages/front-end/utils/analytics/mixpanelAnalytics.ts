import mixpanel from "mixpanel-browser";
import { mixPanelProjectToken } from "../envVars";
import { EventName } from "../../../types/Analytics";
import { getAnalyticsUUID } from "./analyticsHelpers";

const analyticsUUID = getAnalyticsUUID();
let isInitialized = false;

function init() {
  if (isInitialized) return;
  mixpanel.init(mixPanelProjectToken);
  mixpanel.identify(analyticsUUID);
  isInitialized = true;
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
function trackEvent(eventName: EventName, properties?: Record<string, any>) {
  if (!isInitialized) init();
  mixpanel.track(eventName, properties);
}

export default {
  init,
  trackEvent,
};
