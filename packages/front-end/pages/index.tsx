import Head from "next/head";
import { Box } from "@chakra-ui/react";
import CookieConsentPolicy from "../components/legal/CookieConsentPolicy";
import Home from "../components/home/Home";

export default function LandingPage() {
  return (
    <Box>
      <CookieConsentPolicy />
      <Head>
        <meta
          name="The Better Way To Source"
          content={`
            Resale data can be expensive, complicated, and outdated/incorrect. 
            Flip Sourcer makes it easy to get real time data while sourcing 
            products online.
          `}
        />
      </Head>

      <main>
        <Home />
      </main>
    </Box>
  );
}
