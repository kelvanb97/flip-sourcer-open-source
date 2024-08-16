import React, { useContext, useEffect, useMemo, useState } from "react";
import { apiCall } from "../../../utils/apiCall";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Box, Flex, useToast, Image } from "@chakra-ui/react";
import Loader from "../../shared/Loader";
import { stripePublicKey, stripeReturnUrl } from "../../../utils/envVars";
import { UserContext } from "../../../providers/UserProvider";
import { BiSolidLockAlt } from "react-icons/bi";
import Button from "../../shared/Button";
import { brandDarkertLightBlue } from "../../../theme";

const stripePromise = loadStripe(stripePublicKey);

interface SetupFormProps {
  redirect: string;
  cta: string;
}

function SetupForm({ redirect, cta }: SetupFormProps) {
  const toast = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${stripeReturnUrl}${redirect}`,
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setLoading(false);
  }

  return (
    <form onSubmit={async (e) => await handleSubmit(e)}>
      <PaymentElement
        options={{
          terms: { card: "never" },
          paymentMethodOrder: ["card"],
          fields: {
            billingDetails: {
              name: "auto",
            },
          },
        }}
      />
      <Box mt={3}>
        <Box>
          <Flex color="gray.500" justifyContent={"center"}>
            <Box width="18px">
              <BiSolidLockAlt size="18px" style={{ margin: "auto" }} />
            </Box>
            <Box ml={2} fontWeight="bold" fontSize={"sm"}>
              Encrypted, Safe & Secure.
            </Box>
          </Flex>
          <Image
            src="/images/other/powered-by-stripe.svg"
            alt="Powered by Stripe"
            height="28px"
            style={{ margin: "auto" }}
          />
        </Box>
        <Button
          type="submit"
          mt={12}
          shadow=""
          cursor={loading ? "not-allowed" : "pointer"}
          bgColor={loading ? "gray.400" : "dodgerblue"}
          _hover={
            loading
              ? { bgColor: "gray.400" }
              : { bgColor: brandDarkertLightBlue }
          }
        >
          {loading ? <Loader size="md" color="white" /> : cta}
        </Button>
      </Box>
    </form>
  );
}

interface AddPaymentMethodModalProps {
  redirect: string;
  cta: string;
}

export default function AddPaymentMethod({
  redirect,
  cta,
}: AddPaymentMethodModalProps) {
  const [clientSecret, setClientSecret] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function initPaymentMethod() {
      const res = await apiCall<{ client_secret: string }>(
        "/stripe/init-payment-method",
        {
          method: "POST",
          isSessionRequest: true,
        }
      );

      if (!res || !res.client_secret) return;

      setClientSecret(res.client_secret);
    }

    if (!user) return;
    initPaymentMethod();
  }, [user]);

  const options = useMemo(() => {
    if (!clientSecret) return {};
    return {
      clientSecret,
    };
  }, [clientSecret]);

  return (
    <>
      {options.clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <SetupForm redirect={redirect} cta={cta} />
        </Elements>
      ) : (
        <Loader />
      )}
    </>
  );
}
