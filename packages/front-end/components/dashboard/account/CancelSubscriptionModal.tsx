import { Box, Flex, Textarea, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { apiCall } from "../../../utils/apiCall";
import { genericToastError } from "../../../utils/constants";
import mixpanelAnalytics from "../../../utils/analytics/mixpanelAnalytics";
import googleAnalytics from "../../../utils/analytics/googleAnalytics";
import Button from "../../shared/Button";
import Modal from "../../shared/Modal";
import facebookAnalytics from "../../../utils/analytics/facebookAnalytics";

interface CancelSubscriptionModalProps {
  getSubscriptionInfo: () => Promise<void>;
  close: () => void;
}

export default function CancelSubscriptionModal({
  getSubscriptionInfo,
  close,
}: CancelSubscriptionModalProps) {
  const toast = useToast();
  const [feedback, setFeedback] = useState("");

  async function handleSubmit() {
    const res = await apiCall<{ status: number }>(
      "/stripe/cancel-subscription",
      {
        method: "PUT",
        body: { feedback },
        isSessionRequest: true,
      }
    );
    if (!res || res.status !== 200) toast(genericToastError);

    mixpanelAnalytics.trackEvent("Cancel Subscription");
    googleAnalytics.trackEvent("User", "Cancel Subscription");
    facebookAnalytics.trackEvent("Cancel Subscription");
    await getSubscriptionInfo();
    close();
  }

  return (
    <Modal close={close}>
      <Box fontSize={"2xl"} fontWeight="bold">
        Cancel Subscription
      </Box>
      <Box color="gray.500">
        Are you sure you want to cancel your subscription? This action cannot be
        undone.
      </Box>
      <Box mt={5}>
        <Box>We hate to see you go. Please let us know how we can improve!</Box>
        <Textarea
          rows={5}
          mt={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </Box>
      <Flex mt={5} justifyContent="space-between">
        <Button onClick={() => close()} shadow="none">
          Cancel
        </Button>
        <Button
          onClick={async () => await handleSubmit()}
          ml={3}
          bgColor={"red.500"}
          _hover={{ bgColor: "red.600" }}
          shadow="none"
        >
          Cancel Subscription
        </Button>
      </Flex>
    </Modal>
  );
}
