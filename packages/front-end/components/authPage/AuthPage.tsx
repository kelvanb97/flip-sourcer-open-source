import { Box, Flex, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import useBreakpoints from "../../hooks/useBreakpoints";
import { DarkModeContext } from "../../providers/DarkModeProvider";
import { spApiInit, validateSession } from "../../services/auth";
import Banner from "../shared/Banner";
import Loader from "../shared/Loader";
import ConnectionAmazonAccountBanner from "./ConnectAmazonAccountBanner";
import Sidebar from "./SideBar";
import mixpanelAnalytics from "../../utils/analytics/mixpanelAnalytics";
import googleAnalytics from "../../utils/analytics/googleAnalytics";
import { setLocalStorageVar } from "../../utils/localstorage";
import VerifyEmailModal from "./VerifyEmailModal";
import facebookAnalytics from "../../utils/analytics/facebookAnalytics";

interface AuthPageProps {
  children: React.ReactNode;
}

export default function AuthPage({ children }: AuthPageProps) {
  const { isDesktop } = useBreakpoints();
  const toast = useToast();
  const { isDarkMode } = useContext(DarkModeContext);
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  const [delinquentWarning, setDelinquentWarning] = useState(false);
  const [verifyEmailWarning, setVerifyEmailWarning] = useState(false);
  const [verifyEmailModalOpen, setVerifyEmailModalOpen] = useState(false);
  const [showConnectAmazonAccountBanner, setShowConnectAmazonAccountBanner] =
    useState(false);

  const isAuthPage = useMemo(() => {
    return router.pathname.includes("dashboard");
  }, [router.pathname]);


  const isAddPaymentInfoPage = useMemo(() => {
    return router.pathname.includes("dashboard/payment-info");
  }, [router.pathname]);

  useEffect(() => {
    if (!isAuthPage || !router || !hydrated) return;

    router.push("/");

    async function run() {
      await validateSession({
        setShowConnectAmazonAccountBanner,
        setDelinquentWarning,
        setVerifyEmailWarning,
        router,
      });
    }

    run();
  }, [hydrated, isAuthPage]);

  useEffect(() => {
    async function run() {
      const {
        r, // referrer
        referrer,
        spapi_oauth_code,
        state,
        selling_partner_id,
        emailVerified,
      } = router.query;

      if (emailVerified === "true") {
        toast({
          title: "Email Verified",
          description: "Your email has been verified.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        const updatedQuery = { ...router.query };
        delete updatedQuery.emailVerified;

        router.push(
          {
            pathname: router.pathname,
            query: updatedQuery,
          },
          undefined,
          { shallow: true }
        );
      }

      if (referrer)
        setLocalStorageVar(
          "referrer",
          (referrer as string).toLocaleLowerCase()
        );
      else if (r)
        setLocalStorageVar("referrer", (r as string).toLocaleLowerCase());

      if (spapi_oauth_code && state && selling_partner_id) {
        await spApiInit(router, setShowConnectAmazonAccountBanner, toast);
      }
    }

    run();
  }, [router.query]);

  const pageHasPadding = useMemo(() => {
    if (router.pathname.includes("dashboard/features/products")) return false;
    else if (router.pathname.includes("dashboard/features/saved-products"))
      return false;
    else if (router.pathname.includes("dashboard/payment-info")) return false;
    return true;
  }, [router.pathname]);

  useEffect(() => {
    mixpanelAnalytics.init();
    mixpanelAnalytics.trackEvent(`Page View ${router.pathname}`);

    googleAnalytics.init();
    googleAnalytics.pageView(router.pathname);

    facebookAnalytics.init();
    facebookAnalytics.pageView();
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return !hydrated ? (
    <Loader />
  ) : !isAuthPage ? (
    <Box>
      <Banner
        type="error"
        msg={`Sorry! With a heavy heart we have decided to shut down Flip Sourcer. We are no longer accepting new users.`}
        cta=""
        href="/"
      />
      {children}
    </Box>
  ) : (
    <Flex>
      {!isAddPaymentInfoPage && <Sidebar isDesktop={isDesktop} />}
      <Box
        flexGrow={1}
        className={isDesktop ? "" : "no_scrollbar"}
        overflowY="scroll"
        maxH="100vh"
        bgColor={isDarkMode ? "gray.700" : "gray.100"}
      >
        {showConnectAmazonAccountBanner && <ConnectionAmazonAccountBanner />}
        {verifyEmailModalOpen && (
          <VerifyEmailModal close={() => setVerifyEmailModalOpen(false)} />
        )}
        {verifyEmailWarning && (
          <Banner
            type="error"
            msg="Click here to "
            cta="verify your email."
            onClick={() => setVerifyEmailModalOpen(true)}
          />
        )}
        {delinquentWarning && (
          <Banner
            type="error"
            msg={`Your current payment method failed. Please add/update a`}
            cta="new payment method."
            href="/dashboard/account"
          />
        )}
        <Box p={pageHasPadding ? 3 : 0}>{children}</Box>
      </Box>
    </Flex>
  );
}
