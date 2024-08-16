import { Flex, Heading, useToast } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import Loader from "../../components/shared/Loader";
import { useRouter } from "next/router";
import ProfileSection from "../../components/dashboard/account/ProfileSection";
import CurrentPlanSection from "../../components/dashboard/account/CurrentPlanSection";
import PaymentMethodsSection from "../../components/dashboard/account/PaymentMethodsSection";
import { DarkModeContext } from "../../providers/DarkModeProvider";
import AmazonSellerAccountSection from "../../components/dashboard/account/AmazonSellerAccountSection";
import mixpanelAnalytics from "../../utils/analytics/mixpanelAnalytics";
import googleAnalytics from "../../utils/analytics/googleAnalytics";
import { UserContext } from "../../providers/UserProvider";

export default function Account() {
  const { darkModeColor } = useContext(DarkModeContext);
  const toast = useToast();
  const router = useRouter();
  const { user, refetchUser } = useContext(UserContext);

  useEffect(() => {
    if (router.query.success === "true") {
      toast({
        title: "Success",
        description: "Subscription updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      const { ...restQuery } = router.query;
      router.replace(
        {
          pathname: router.pathname,
          query: restQuery,
        },
        undefined,
        { shallow: true }
      );
      refetchUser();
    }
  }, [router.query.success]);

  useEffect(() => {
    if (router.query.redirect_status === "succeeded") {
      mixpanelAnalytics.trackEvent("Added Payment Method");
      googleAnalytics.trackEvent("User", "Added Payment Method");
      toast({
        title: "Success",
        description: "Payment method added",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [router.query.redirect_status]);

  return (
    <>
      <Heading as="h3" size="lg" color={darkModeColor}>
        Account
      </Heading>
      {user ? (
        <Flex direction="column" rowGap={5} mt={5} maxW="600px">
          <ProfileSection user={user} />
          <CurrentPlanSection />
          <PaymentMethodsSection />
          <AmazonSellerAccountSection />
        </Flex>
      ) : (
        <Loader />
      )}
    </>
  );
}
