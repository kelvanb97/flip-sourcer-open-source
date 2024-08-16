import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import { marginX } from "../../theme";

export default function PrivacyPolicy() {
  return (
    <Box className="gradient_bg_dark_to_light" minH="100vh">
      <Flex
        direction="column"
        justifyContent={"space-between"}
        marginX={marginX}
        color="white"
        minH="100vh"
      >
        <Box>
          <Header />
          <Stack>
            <Heading as="h1">Disclaimer</Heading>
            <Box>
              We (flipsourcer.com) do our best to supply you with the most
              accurate information to empower your reselling business. However,
              no information presented on our site is gaurenteed to be accurate.
              We do not take responsibility for any decisions you make based on
              the information we provide.
            </Box>
            <Box>Make sure to do you research before making any decisions.</Box>
          </Stack>
        </Box>
        <Footer />
      </Flex>
    </Box>
  );
}
