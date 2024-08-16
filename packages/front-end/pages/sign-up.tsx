import {
  Box,
  chakra,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import Header from "../components/home/Header";
import Alert from "../components/shared/Alert";
import Logo, { getLogoSrc } from "../components/shared/Logo";
import { PasswordField } from "../components/shared/PasswordField";
import { apiCall } from "../utils/apiCall";
import { brandDarkertLightBlue, marginX } from "../theme";
import { setCookie } from "../utils/cookies";
import { SignUpRequest } from "../../types/User";
import Button from "../components/shared/Button";
import Link from "../components/shared/LinkHref";
import { emailValidationRegex, passwordValidationRegex } from "../utils/auth";
import { useRouter } from "next/router";
import { getLocalStorageVar } from "../utils/localstorage";
import ReferrerSection from "../components/shared/ReferrerSection";
import { trackConversion } from "../utils/analytics/analytics";
import mixpanelAnalytics from "../utils/analytics/mixpanelAnalytics";
import googleAnalytics from "../utils/analytics/googleAnalytics";
import facebookAnalytics from "../utils/analytics/facebookAnalytics";
import Loader from "../components/shared/Loader";

export default function SignUp() {
  const toast = useToast();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!email.toLowerCase().match(emailValidationRegex)) {
      setLoading(false);
      return setError("Invalid email address.");
    }

    if (!password.match(passwordValidationRegex)) {
      setLoading(false);
      return setError("Invalid password. You may need a special character.");
    }

    if (password !== confirmPassword) {
      setLoading(false);
      return setError("Passwords do not match.");
    }

    if (!termsAgreed) {
      setLoading(false);
      return setError("Please agree to the 'Terms of Service'.");
    }

    const body: SignUpRequest = {
      name,
      email: email.toLowerCase(),
      password,
      confirmPassword,
      termsAgreed,
      referrer: getLocalStorageVar("referrer") || null,
    };

    try {
      const res = await apiCall<{ status: number; sessionToken: string }>(
        "/auth/signup",
        { method: "POST", body }
      );
      if (!res) throw new Error("No response from server.");

      setCookie("s", res.sessionToken);

      mixpanelAnalytics.trackEvent("Sign Up");
      googleAnalytics.trackEvent("User", "Sign Up");
      facebookAnalytics.trackEvent("Sign Up");
      await trackConversion("onboarding");

      return router.push("/dashboard/payment-info");
    } catch (e) {
      console.error(e);
      setError("An error occurred. Please contact support@flipsourcer.com");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (router.query.redirect) {
      toast({
        title: "Please sign up to continue.",
        description:
          "The page you were trying to access requires you to sign up. Luckily, it's free to start!",
        status: "warning",
        duration: null,
        isClosable: true,
      });
    }
  }, [router]);

  useEffect(() => {
    setError("");
  }, [email, password, confirmPassword, termsAgreed]);

  return (
    <Box className="gradient_bg_light_to_dark" minH="100vh" pb={12}>
      <Box marginX={marginX}>
        <Header showPb={false} />
        <Box
          bg="white"
          maxW="sm"
          mx="auto"
          textAlign={"center"}
          py={12}
          px={6}
          rounded="md"
          shadow="dark-lg"
        >
          <Flex
            direction="column"
            rowGap={5}
            justifyItems="center"
            justifyContent="center"
            mb={12}
          >
            <Logo src={getLogoSrc("icon")} height={72} width={72} />
            <Heading size={"sm"}>Create an account</Heading>
          </Flex>
          <ReferrerSection />
          <form onSubmit={async (e) => await handleSubmit(e)}>
            <Flex direction={"column"} rowGap={5}>
              <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  type="text"
                  borderColor={"gray.300"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  borderColor={"gray.300"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="password">Password</FormLabel>
                <PasswordField
                  showLabel={false}
                  password={password}
                  setPassword={setPassword}
                />
                <FormHelperText color="gray.500" textAlign={"left"}>
                  8 characters, letters, number, special character
                </FormHelperText>
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="confirm passowrd">
                  Confirm Password
                </FormLabel>
                <PasswordField
                  showLabel={false}
                  password={confirmPassword}
                  setPassword={setConfirmPassword}
                />
              </FormControl>
              <FormControl isRequired textAlign={"left"}>
                <Checkbox
                  mt={1}
                  isChecked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                />
                <chakra.span ml={2}>
                  Agree to{" "}
                  <Link href="/legal/terms">
                    <chakra.span
                      color="dodgerblue"
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                    >
                      Terms of Service
                    </chakra.span>
                  </Link>
                </chakra.span>
              </FormControl>
              <Button
                type="submit"
                shadow=""
                cursor={loading ? "not-allowed" : "pointer"}
                bgColor={loading ? "gray.400" : "dodgerblue"}
                _hover={
                  loading
                    ? { bgColor: "gray.400" }
                    : { bgColor: brandDarkertLightBlue }
                }
              >
                {loading ? (
                  <Loader size="md" color="white" />
                ) : (
                  "Create account"
                )}
              </Button>
              <Alert type="error" message={error} />
            </Flex>
          </form>
          <HStack mt={5} justify="center" spacing="1">
            <Text fontSize="sm" color="muted">
              Already have an account?
            </Text>
            <Link href="/login" fontSize="sm">
              Log in
            </Link>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
