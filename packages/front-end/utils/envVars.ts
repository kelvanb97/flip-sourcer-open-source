function getApiBase(stage: string) {
  if (stage === "local") return "http://localhost:4200";
  return `https://${stage}-api.flipsourcerapi.com`;
}

export const stage = process.env.NEXT_PUBLIC_STAGE as string;
export const isProd = process.env.NEXT_PUBLIC_STAGE === "prod" ? true : false;
export const apiBase = getApiBase(stage);
export const stripeReturnUrl = isProd
  ? "https://www.flipSourcer.com"
  : "http://localhost:4000";
export const stripePublicKey = (
  isProd
    ? process.env.NEXT_PUBLIC_STRIPE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_TEST_KEY
) as string;
export const mixPanelProjectToken = (
  isProd
    ? process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN
    : process.env.NEXT_PUBLIC_MIXPANEL_TEST_PROJECT_TOKEN
) as string;
