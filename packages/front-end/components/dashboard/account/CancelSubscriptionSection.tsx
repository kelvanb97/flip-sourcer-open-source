import { Box } from "@chakra-ui/react";
import { useState } from "react";
import CancelSubscriptionModal from "./CancelSubscriptionModal";

interface CancelSubscriptionSectionProps {
  getSubscriptionInfo: () => Promise<void>;
}

export default function CancelSubscriptionSection({
  getSubscriptionInfo,
}: CancelSubscriptionSectionProps) {
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] =
    useState(false);

  return (
    <>
      {showCancelSubscriptionModal && (
        <CancelSubscriptionModal
          getSubscriptionInfo={getSubscriptionInfo}
          close={() => setShowCancelSubscriptionModal(false)}
        />
      )}
      <Box
        maxW="max-content"
        onClick={() => setShowCancelSubscriptionModal(true)}
        color="gray.500"
        cursor="pointer"
        _hover={{ textDecoration: "underline" }}
      >
        Cancel Subscription
      </Box>
    </>
  );
}
