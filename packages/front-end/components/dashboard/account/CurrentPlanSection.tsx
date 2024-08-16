import { Box, Flex, Spinner } from "@chakra-ui/react";
import { dateToDisplayDate } from "../../../utils/shared";
import Button from "../../shared/Button";
import Card from "../../shared/Card";
import { useEffect, useState } from "react";
import { apiCall } from "../../../utils/apiCall";
import { SubscriptionInfo } from "../../../../types/Stripe";
import CancelSubscriptionSection from "./CancelSubscriptionSection";
import { useRouter } from "next/router";

export default function CurrentPlan() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);

  async function getSubscriptionInfo() {
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

  useEffect(() => {
    async function run() {
      await getSubscriptionInfo();
    }

    setLoading(true);
    run();
    setLoading(false);
  }, []);

  function getRenewsOnText(subscriptionInfo: SubscriptionInfo) {
    if (subscriptionInfo.cancelAtEnd) return "Subscription ends on:";

    if (subscriptionInfo.isTrialing) return "Trial ends on:";

    return "Renews on:";
  }

  return (
    <Card p={0}>
      {loading ? (
        <Box p={5} mx="auto" textAlign="center">
          <Spinner color="dodgerblue" />
        </Box>
      ) : subscriptionInfo === null ? (
        <Box p={5} mx="auto" textAlign="center">
          <strong>Unable to load subscription info.</strong>
        </Box>
      ) : (
        <>
          <Box
            p={3}
            fontSize="lg"
            fontWeight={""}
            borderBottom={"1px"}
            borderColor="gray.300"
          >
            <strong>Current Plan</strong>
          </Box>
          <Flex p={3} justifyContent="space-between">
            <Box>
              {subscriptionInfo.planName +
                `${subscriptionInfo.isTrialing ? " (trial)" : ""}`}
            </Box>
            <Flex>
              <Box>{getRenewsOnText(subscriptionInfo)}</Box>
              <Box ml={3}>{dateToDisplayDate(subscriptionInfo.renewsOn)}</Box>
            </Flex>
          </Flex>
          <Flex
            p={3}
            borderTop={"1px"}
            borderColor="gray.300"
            justifyContent="space-between"
          >
            {subscriptionInfo.subStatus !== "canceled" &&
            !subscriptionInfo.cancelAtEnd ? (
              <Box my="auto">
                <CancelSubscriptionSection
                  getSubscriptionInfo={getSubscriptionInfo}
                />
              </Box>
            ) : (
              <Box></Box>
            )}
            <Button
              shadow="none"
              onClick={() => router.push("/dashboard/plan")}
            >
              Manage Plan
            </Button>
          </Flex>
        </>
      )}
    </Card>
  );
}
