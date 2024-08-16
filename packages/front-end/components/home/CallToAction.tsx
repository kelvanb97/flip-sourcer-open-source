import { Stack, Flex, Heading, Text, Box } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { brandDarkBlue } from "../../theme";
import Button from "../shared/Button";

export default function CallToAction() {
  const videoEl = useRef(null);

  const attemptPlay = () => {
    if (typeof videoEl.current !== "object") return;

    // @ts-ignore
    videoEl && videoEl.current && videoEl.current.play();
  };

  useEffect(() => {
    attemptPlay();
  }, []);

  return (
    <Flex
      align={"center"}
      direction={["column", "column", "column", "column", "row"]}
      color="white"
      rowGap={12}
    >
      <Stack flex={1} spacing={[5, 10]}>
        <Heading fontSize={["5xl", "6xl", "7xl"]}>
          Source Profitable Products
        </Heading>
        <Text fontSize={["lg", "xl", "2xl"]} pr={5}>
          Discover Amazon resale opportunities, replenish your inventory, and
          harness the power of actionable data. Ideal for resellers at all
          stages, our unified, AI-powered toolkit provides a personalized
          dashboard to accelerate your product discovery.
        </Text>
        <Stack spacing={[4, 6]} direction={["column", "row"]}>
          <Link href="/sign-up">
            <Button size="lg" rounded="full" bg={brandDarkBlue}>
              Start for free
            </Button>
          </Link>
        </Stack>
      </Stack>
      <Box maxW={["100%", "100%", "100%", "100%", "40%"]}>
        <video
          ref={videoEl}
          style={{
            maxWidth: "100%",
            width: "800px",
            margin: "0 auto",
            borderRadius: "16px",
          }}
          playsInline
          loop
          muted
          controls
          src="/videos/product_card_video.mp4"
        />
      </Box>
    </Flex>
  );
}
