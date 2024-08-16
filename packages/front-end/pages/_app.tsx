import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import AuthPage from "../components/authPage/AuthPage";
import "../theme/styles.css";
import { ChatWidget } from "@papercups-io/chat-widget";
import { Analytics } from "@vercel/analytics/react";
import { brandDarkerDarkBlue } from "../theme";
import DarkModeProvider from "../providers/DarkModeProvider";
import { PaperCupsProvider } from "../providers/PaperCupsProvider";
import { UserContext, UserProvider } from "../providers/UserProvider";
import { useContext, useEffect } from "react";
import Hotjar from "@hotjar/browser";

const siteId = process.env.NEXT_PUBLIC_HOTJAR_SITE_ID;
const hotjarVersion = 6;

function App({ Component, pageProps }: AppProps) {
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (typeof window !== "undefined") {
      Hotjar.init(siteId, hotjarVersion);
    }
  }, []);

  return (
    <>
      <Analytics />
      <UserProvider>
        <ChakraProvider>
          <PaperCupsProvider>
            <DarkModeProvider>
              <Head>
                <title>Flip Sourcer</title>
                <link rel="icon" href="/favicon.svg" />
              </Head>
              <AuthPage>
                <Component {...pageProps} />
                <ChatWidget
                  token={process.env.NEXT_PUBLIC_PAPERCUPS_TOKEN}
                  inbox={process.env.NEXT_PUBLIC_PAPERCUPS_INBOX_ID}
                  title="Welcome to Flip Sourcer"
                  subtitle="Ask us anything in the chat window below 😊"
                  primaryColor={brandDarkerDarkBlue}
                  greeting="You are speaking with a real human! How can I help you?"
                  customer={{
                    name: user ? user.name : undefined,
                    email: user ? user.email : undefined,
                  }}
                  newMessagePlaceholder="Start typing..."
                  showAgentAvailability={false}
                  agentAvailableText="We're online right now!"
                  agentUnavailableText="We're away at the moment."
                  requireEmailUpfront={true}
                  iconVariant="outlined"
                  baseUrl="https://app.papercups.io"
                />
              </AuthPage>
            </DarkModeProvider>
          </PaperCupsProvider>
        </ChakraProvider>
      </UserProvider>
    </>
  );
}

export default App;
