import { Box, Heading, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { apiCall } from "../../utils/apiCall";
import Loader from "../../components/shared/Loader";
import { DarkModeContext } from "../../providers/DarkModeProvider";

export default function VerifyEmail() {
  const { darkModeColor } = useContext(DarkModeContext);
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function VerifyEmail() {
      if (!router.query.token) return;
      const res = await apiCall<{ status: number; message: string }>(
        `/auth/verify-email/${router.query.token}`,
        {
          method: "POST",
          isSessionRequest: true,
        }
      );

      console.log(res);

      if (!res || res.status !== 200) {
        setLoading(false);
        toast({
          title: "Error",
          description: "Email verification failed. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setLoading(false);
      router.push("/dashboard?emailVerified=true");
    }

    setLoading(true);
    VerifyEmail();
  }, [router.query.token]);

  return (
    <Box>
      <Heading as="h3" size="lg" color={darkModeColor}>
        Verify Email
      </Heading>
      {loading && <Loader />}
    </Box>
  );
}
