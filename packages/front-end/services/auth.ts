import { NextRouter } from "next/router";
import { apiCall } from "../utils/apiCall";
import { logout } from "../utils/auth";
import { amazonApplicationId } from "../utils/constants";

export function getLoginRedirectUrl(router: NextRouter) {
  const amazonSpApiRedirectUri = "https://www.flipsourcer.com/dashboard";

  if (
    router.query.amazon_callback_uri &&
    router.query.amazon_state &&
    router.query.selling_partner_id
  ) {
    const state = router.query.amazon_state as string;
    return `https://sellercentral.amazon.com/apps/authorize/consent?redirect_uri=${encodeURIComponent(
      amazonSpApiRedirectUri
    )}&application_id=${amazonApplicationId}&state=${state}`;
  }

  return "/dashboard";
}

export async function spApiInit(
  router: NextRouter,
  setShowConnectAmazonAccountBanner: (x: boolean) => void,
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  toast: any
) {
  const spapi_oath_code = router.query.spapi_oauth_code as string;
  const state = router.query.state as string;
  const selling_partner_id = router.query.selling_partner_id as string;

  const res = await apiCall("/user/sp-api-init", {
    method: "POST",
    isSessionRequest: true,
    body: { spapi_oath_code, state, selling_partner_id },
  });

  if (res && res.status === 200) {
    toast({
      title: "Amazon Seller account connected",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    setShowConnectAmazonAccountBanner(false);

    //remove router query params
    router.push("/dashboard");
  } else {
    toast({
      title:
        "Failed to connect to Amazon Seller account, please contact support",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    router.push("/dashboard/account");
  }
}

interface ValidateSession {
  setShowConnectAmazonAccountBanner: (value: boolean) => void;
  setDelinquentWarning: (value: boolean) => void;
  setVerifyEmailWarning: (value: boolean) => void;
  router: NextRouter;
}

export async function validateSession({
  setShowConnectAmazonAccountBanner,
  setDelinquentWarning,
  setVerifyEmailWarning,
  router,
}: ValidateSession) {
  const res = await apiCall<{
    status: number;
    needsSpApi: boolean;
    needsSubscription: boolean;
    isDelinquent: boolean;
    isEmailVerified: boolean;
  }>("/auth/validate-session", {
    method: "POST",
    isSessionRequest: true,
    logoutRedirect: getLogoutRedirect(router),
  });

  if (!res || res.status !== 200) return logout(getLogoutRedirect(router));

  if (res.needsSubscription) {
    if (router.pathname === "/dashboard/payment-info") return;
    return router.push("/dashboard/payment-info");
  }

  //Only want them to fix one thing at a time
  if (res.isDelinquent) {
    //Don't show the banner if they are on the plan page
    if (router.pathname !== "/dashboard/plan") setDelinquentWarning(true);

    //Don't redirect if they are on the plan or account page
    if (
      router.pathname === "/dashboard/plan" ||
      router.pathname === "/dashboard/account"
    )
      return;

    //Redirect to account page
    return router.push("/dashboard/account");
  }

  //Only want them to fix one thing at a time
  if (!res.isEmailVerified) setVerifyEmailWarning(true);

  //Not Important, but we can show the banner
  if (res.needsSpApi) setShowConnectAmazonAccountBanner(true);
}

export function getLogoutRedirect(router: NextRouter) {
  if (router.pathname === "/dashboard/features/products/[id]") {
    return `/sign-up?redirect=/dashboard/features/products/${router.query.id}`;
  }
  return "/login";
}
