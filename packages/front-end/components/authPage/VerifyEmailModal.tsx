import { Box, Flex, Heading, useToast } from "@chakra-ui/react";
import Modal from "../shared/Modal";
import Button from "../shared/Button";
import { apiCall } from "../../utils/apiCall";
import { useState } from "react";

interface VerifyEmailModalProps {
  close: () => void;
}

export default function VerifyEmailModal({ close }: VerifyEmailModalProps) {
  const toast = useToast();
  const [isResending, setIsResending] = useState(false);

  async function handleResendEmail() {
    setIsResending(true);

    const res = await apiCall<{ status: number; message: string }>(
      "/auth/send-email-verification",
      {
        method: "POST",
        isSessionRequest: true,
      }
    );

    setIsResending(false);

    if (!res || res.status !== 200)
      return toast({
        title: "Error",
        description:
          res?.message || "Please wait a few minutes before trying again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

    toast({
      title: "Email Sent",
      description:
        res?.message ||
        "A verification email has been sent to your email address.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <Modal close={close} closeOnOverlayClick={false}>
      <Heading>Email Verification</Heading>
      <Box my={5} fontWeight="bold">
        {`Click "Send Verification Email" then check your email for a verification link.`}
      </Box>
      <Box my={5}>
        If you have not received an email, please check your spam folder.
      </Box>
      <Flex justifyContent="space-between">
        <Button
          isLoading={isResending}
          shadow={"none"}
          onClick={async () => await handleResendEmail()}
        >
          Send Verification Email
        </Button>
        <Button shadow={"none"} onClick={() => window.location.reload()}>
          Verify Email
        </Button>
      </Flex>
    </Modal>
  );
}
