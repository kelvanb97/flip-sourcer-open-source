import { Box, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { marginX } from "../../theme";
import AddPaymentMethod from "../../components/dashboard/shared/AddPaymentMethod";
import Logo, { getLogoSrc } from "../../components/shared/Logo";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PlanName } from "../../../types/Stripe";
import { apiCall } from "../../utils/apiCall";
import mixpanelAnalytics from "../../utils/analytics/mixpanelAnalytics";
import googleAnalytics from "../../utils/analytics/googleAnalytics";
import { trackConversion } from "../../utils/analytics/analytics";
import { genericToastError } from "../../utils/constants";
import Loader from "../../components/shared/Loader";

export default function PaymentInfo() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function createSubscription() {
      const planName: PlanName = "Flip Sourcer Pro";
      const subRes = await apiCall<{ type: string; status: number }>(
        "/stripe/subscription",
        {
          method: "POST",
          isSessionRequest: true,
          body: { planName, upgradeNow: false },
        }
      );

      if (!subRes || subRes.status !== 200) {
        return toast(genericToastError);
      }

      mixpanelAnalytics.trackEvent("Trial Started", { planName });
      googleAnalytics.trackEvent("User", "Trial Started");
      await trackConversion("trialing");

      return router.push(`/dashboard`);
    }

    if (router.query.startSub === "true") {
      setLoading(true);
      createSubscription();
      setLoading(false);
    }
  }, [router.query.startSub]);

  return (
    <Flex
      className="gradient_bg_light_to_dark"
      minH="100vh"
      pb={12}
      flexDirection="column"
      justifyContent="center"
    >
      <Box m="auto" marginX={marginX}>
        <Box
          bg="white"
          maxW="sm"
          mx="auto"
          textAlign={"center"}
          pt={12}
          pb={6}
          px={6}
          rounded="md"
          shadow="dark-lg"
        >
          <Flex
            direction="column"
            rowGap={5}
            justifyItems="center"
            justifyContent="center"
          >
            <Logo src={getLogoSrc("icon")} height={72} width={72} />
            <Box mx="auto">
              <Heading size="lg">Payment Details</Heading>
              <Flex justifyItems="center" justifyContent="center" mt={2}>
                <Text color="gray.600" fontSize={"sm"}>
                  This is for account verification only.{` `}
                  <strong>
                    No charges will be made during your 7-day free trial.
                  </strong>
                </Text>
              </Flex>
            </Box>
          </Flex>
          <Box mt={5}>
            {loading ? (
              <Loader />
            ) : (
              <AddPaymentMethod
                redirect="/dashboard/payment-info/?startSub=true"
                cta="Complete Registration"
              />
            )}
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
