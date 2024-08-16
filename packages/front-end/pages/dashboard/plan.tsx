import { Box, Flex, Heading, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { PlanName, SubscriptionInfo } from "../../../types/Stripe";
import Loader from "../../components/shared/Loader";
import { PricingCard } from "../../components/shared/PricingCard";
import { products } from "../../constants/products";
import { apiCall } from "../../utils/apiCall";
import mixpanelAnalytics from "../../utils/analytics/mixpanelAnalytics";
import googleAnalytics from "../../utils/analytics/googleAnalytics";
import { DarkModeContext } from "../../providers/DarkModeProvider";
import { trackConversion } from "../../utils/analytics/analytics";
import { useRouter } from "next/router";

export default function Plan() {
  const router = useRouter();
  const toast = useToast();
  const { darkModeColor } = useContext(DarkModeContext);

  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    async function run() {
      const res = await apiCall<SubscriptionInfo>("/stripe/subscription", {
        method: "GET",
        isSessionRequest: true,
      });

      if (!res) return;

      const { planName, subStatus, isTrialing, renewsOn, cancelAtEnd } = res;

      setSubscriptionInfo({
        planName,
        subStatus,
        isTrialing,
        renewsOn,
        cancelAtEnd,
      });
    }

    run();
  }, []);

  async function handleSubmit(planName: PlanName, upgradeNow: boolean) {
    setProcessingPayment(true);
    const subRes = await apiCall<{ type: string; status: number }>(
      "/stripe/subscription",
      {
        method: "POST",
        isSessionRequest: true,
        body: { planName, upgradeNow },
      }
    );

    if (subRes && subRes.type && subRes.status === 200) {
      if (upgradeNow) {
        mixpanelAnalytics.trackEvent("Upgraded To Paid Plan", { planName });
        mixpanelAnalytics.trackEvent("Changed Plan", { planName });
        googleAnalytics.trackEvent("User", "Upgraded To Paid Plan");
        googleAnalytics.trackEvent("User", "Changed Plan");
        await trackConversion("active");
      } else {
        mixpanelAnalytics.trackEvent("Trial Started", { planName });
        googleAnalytics.trackEvent("User", "Trial Started");
        await trackConversion("trialing");
      }

      setProcessingPayment(false);
      router.push(`/dashboard/account?success=true&subtype=${subRes.type}`);
    } else {
      toast({
        title: "Error",
        description:
          "Something went wrong with changing your subscription, please contact us",
        status: "error",
        duration: null,
        isClosable: true,
      });
    }
  }

  return (
    <>
      {processingPayment ? (
        <Loader />
      ) : (
        <>
          <Box mt={20} maxW="max-content" mx="auto">
            <Box mx="auto">
              <Heading
                as="h1"
                size="2xl"
                color={darkModeColor}
                textAlign="center"
                mb={8}
              >
                Plans
              </Heading>
            </Box>
            <Flex
              mt={5}
              direction={["column", "column", "row"]}
              columnGap="8"
              alignItems={"center"}
              justifyContent={"center"}
            >
              {products.map((product, i) => {
                const productPlanName = product.planName;
                const subPlanName = subscriptionInfo?.planName;
                const isTrialing = subscriptionInfo?.isTrialing;
                const isCanceled = subscriptionInfo?.cancelAtEnd;

                const samePlan = subPlanName === productPlanName;

                let cta = "Choose Plan";
                let upgradeNow = false;
                let disabled = false;
                if (samePlan && isTrialing) {
                  if (isCanceled) {
                    cta = "Reactivate Plan";
                    upgradeNow = false;
                    disabled = false;
                  } else {
                    cta = "Upgrade Now";
                    upgradeNow = true;
                    disabled = false;
                  }
                } else if (samePlan && !isTrialing) {
                  if (isCanceled) {
                    cta = "Reactivate Plan";
                    upgradeNow = false;
                    disabled = false;
                  } else {
                    cta = "Current Plan";
                    upgradeNow = false;
                    disabled = true;
                  }
                } else if (
                  (!samePlan && isTrialing) ||
                  (!samePlan && !isTrialing)
                ) {
                  cta = "Change Plan";
                  upgradeNow = false;
                  disabled = false;
                }

                product.disabled = disabled;

                return (
                  <PricingCard
                    key={`pricingCard${i}`}
                    product={product}
                    cta={cta}
                    href={`#`}
                    isStripe={true}
                    onClick={async () => {
                      if (disabled) return;
                      await handleSubmit(product.planName, upgradeNow);
                    }}
                  />
                );
              })}
            </Flex>
          </Box>
        </>
      )}
    </>
  );
}
