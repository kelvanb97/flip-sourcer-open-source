import {
  Box,
  Divider,
  Flex,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import Logo, { getLogoSrc } from "../shared/Logo";
import Link from "next/link";
import { useContext, useState } from "react";
import { apiCall } from "../../utils/apiCall";
import Button from "../shared/Button";
import { discord, twitter } from "../../theme";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { emailValidationRegex } from "../../utils/auth";
import mixpanelAnalytics from "../../utils/analytics/mixpanelAnalytics";
import googleAnalytics from "../../utils/analytics/googleAnalytics";
import { PaperCupsContext } from "../../providers/PaperCupsProvider";
import facebookAnalytics from "../../utils/analytics/facebookAnalytics";

export default function Footer() {
  const { openChat } = useContext(PaperCupsContext);

  const toast = useToast();
  const [email, setEmail] = useState("");

  async function handleEmailSubmit() {
    if (!email.match(emailValidationRegex)) {
      return toast({
        title: "Invalid email address",
        description: "Please enter a valid email address",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    const res = await apiCall<{ status: number }>("/no-auth/email-sub", {
      method: "POST",
      body: { email },
    });

    if (res && res.status === 200) {
      setEmail("");
      mixpanelAnalytics.trackEvent("Subscribed To Email List", { email });
      googleAnalytics.trackEvent("User", "Subscribed To Email List");
      facebookAnalytics.trackEvent("Subscribed To Email List");

      return toast({
        title: "Success",
        description: "You have been added to our email list",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      return toast({
        title: "Something went wrong",
        description: "Please contact support@flipsourcer.com",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <Box as="footer" color="white">
      <Stack
        spacing="8"
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        py={{ base: "12", md: "16" }}
      >
        <Stack spacing={{ base: "6", md: "8" }} align="start">
          <Link href="/">
            <Logo
              src={getLogoSrc("logoNameWhite")}
              height={47}
              width={316}
              style={{ cursor: "pointer" }}
            />
          </Link>
          <Flex direction={"column"} rowGap={3}>
            <Box fontWeight="bold">Join the community!</Box>
            <Button
              icon={FaDiscord}
              iconPosition="left"
              bg={discord}
              onClick={() =>
                window.open("https://discord.gg/aXEDxJSYBD", "_blank")
              }
            >
              Join Discord
            </Button>
            <Button
              icon={FaTwitter}
              iconPosition="left"
              bg={twitter}
              onClick={() =>
                window.open("https://twitter.com/flipsourcer", "_blank")
              }
            >
              Follow Twitter
            </Button>
          </Flex>
        </Stack>
        <Stack
          direction={{ base: "column-reverse", md: "column", lg: "row" }}
          spacing={{ base: "12", md: "8" }}
        >
          <Stack direction="row" spacing="8">
            <Stack spacing="4" minW="36" flex="1">
              <Text fontSize="md" fontWeight="bold" color="subtle">
                Links
              </Text>
              <Stack fontSize="sm" spacing="3" shouldWrapChildren>
                <Link href="/sites">
                  <Box
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Sites
                  </Box>
                </Link>
                <Link href="/about-us">
                  <Box
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                  >
                    About
                  </Box>
                </Link>
                <Link href="/pricing">
                  <Box
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Pricing
                  </Box>
                </Link>
                <Box
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={() => openChat()}
                >
                  Contact Us
                </Box>
              </Stack>
            </Stack>
          </Stack>
          <Stack direction="row" spacing="8">
            <Stack spacing="4" minW="36" flex="1">
              <Text fontSize="md" fontWeight="bold" color="subtle">
                Legal
              </Text>
              <Stack fontSize="sm" spacing="3" shouldWrapChildren>
                <Link href="/legal/privacy">
                  <Box
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Privacy
                  </Box>
                </Link>
                <Link href="/legal/terms">
                  <Box
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Terms
                  </Box>
                </Link>
                <Link href="/legal/disclaimer">
                  <Box
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Disclaimer
                  </Box>
                </Link>
              </Stack>
            </Stack>
          </Stack>
          <Stack spacing="4">
            <Text fontSize="sm" fontWeight="semibold" color="subtle">
              Subscribe to our newsletter
            </Text>
            <Stack
              spacing="4"
              direction={{ base: "column", sm: "row" }}
              maxW={{ lg: "360px" }}
            >
              <Input
                color="black"
                bg="white"
                fontSize={"sm"}
                h={"36px"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
                required
              />
              <Button onClick={async () => await handleEmailSubmit()}>
                Subscribe
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      <Stack
        pt="8"
        pb="12"
        justify="space-between"
        direction={{ base: "column-reverse", md: "row" }}
        align="center"
      >
        <Text fontSize="sm" color="subtle">
          &copy; {new Date().getFullYear()} Flip Sourcer. All rights reserved.
        </Text>
      </Stack>
    </Box>
  );
}
