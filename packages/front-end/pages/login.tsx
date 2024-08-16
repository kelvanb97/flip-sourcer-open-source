import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Header from "../components/home/Header";
import Button from "../components/shared/Button";
import Alert from "../components/shared/Alert";
import Link from "../components/shared/LinkHref";
import Logo, { getLogoSrc } from "../components/shared/Logo";
import { PasswordField } from "../components/shared/PasswordField";
import { brandDarkertLightBlue, marginX } from "../theme";
import { apiCall } from "../utils/apiCall";
import { deleteCookie, setCookie } from "../utils/cookies";
import { getLoginRedirectUrl } from "../services/auth";
import mixpanelAnalytics from "../utils/analytics/mixpanelAnalytics";
import googleAnalytics from "../utils/analytics/googleAnalytics";
import facebookAnalytics from "../utils/analytics/facebookAnalytics";
import Loader from "../components/shared/Loader";

export default function Login() {
  const toast = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleForgotPassword() {
    toast({
      title: "Forgot password",
      description:
        "Please email support@flipsourcer.com and we will help you resolve this issue.",
      status: "error",
      duration: null,
      isClosable: true,
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const res = await apiCall<{ status: number; sessionToken: string }>(
      "/auth/login",
      { method: "POST", body: { email: email.toLowerCase(), password } }
    );
    if (!res || res.status !== 200) {
      setLoading(false);
      return setError("Invalid email or password.");
    }

    deleteCookie("s");
    setCookie("s", res.sessionToken);
    mixpanelAnalytics.trackEvent("Log In");
    googleAnalytics.trackEvent("User", "Log In");
    facebookAnalytics.trackEvent("Log In");

    router.push(getLoginRedirectUrl(router));
  }

  useEffect(() => {
    async function trySpApi() {
      const res = await apiCall<{ status: number; needsSpApi: boolean }>(
        "/auth/validate-session",
        {
          method: "POST",
          isSessionRequest: true,
        }
      );
      if (!res || res.status !== 200) return; //do nothing, they still need to login

      const redirect = getLoginRedirectUrl(router);
      if (redirect === "/dashboard") return; //do nothing

      router.push(redirect);
    }

    trySpApi();
  }, [
    router.query.amazon_callback_uri,
    router.query.amazon_state,
    router.query.selling_partner_id,
  ]);

  //clears error message when user starts typing
  useEffect(() => {
    setError("");
  }, [email, password]);

  return (
    <Box className="gradient_bg_light_to_dark" minH="100vh" pb={12}>
      <Box marginX={marginX}>
        <Header />
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
            <Box mx="auto">
              <Heading size="sm">Log in to your account</Heading>
              <Flex justifyItems="center" justifyContent="center" mt={2}>
                <Text color="muted">Don{`'`}t have an account?</Text>
                <Link href="/sign-up" ml={1}>
                  Sign up
                </Link>
              </Flex>
            </Box>
          </Flex>
          <form onSubmit={async (e) => await handleSubmit(e)}>
            <Flex direction={"column"} rowGap={5}>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  borderColor={"gray.300"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <PasswordField password={password} setPassword={setPassword} />
              <Box textAlign={"left"}>
                <Link onClick={handleForgotPassword}>Forgot password?</Link>
              </Box>
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
                {loading ? <Loader size="md" color="white" /> : "Login"}
              </Button>
              <Alert type="error" message={error} />
            </Flex>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
