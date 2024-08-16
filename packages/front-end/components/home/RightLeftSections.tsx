import { Box, Flex, Heading, Image } from "@chakra-ui/react";

export default function RightLeftSections() {
  return (
    <Box maxW="950px" mx="auto">
      <Heading textAlign="center" fontSize={["5xl", "6xl", "7xl"]}>
        Features
      </Heading>
      <Flex mt={24} flexDir="column" rowGap={32} color="black">
        {/* RETAILER COMPARISON START */}
        <Flex
          flexDir={["column", "column", "row-reverse"]}
          justifyContent="space-between"
          alignItems={"center"}
          justifySelf={"center"}
        >
          <Flex
            maxW="400px"
            flexDir="column"
            rowGap={3}
            mt={[0, 0, -12]}
            mb={[12, 12, 0]}
          >
            <Box fontSize="sm" color="gray.400">
              RETAILER COMPARISON
            </Box>
            <Box fontSize={["3xl", "3xl", "4xl"]} fontWeight="bold">
              AI-Powered Product Discovery & Tracking
            </Box>
            <Box color="gray.500">
              Unearth profitable product opportunities with our intelligent
              matching and tracking tools. Our AI-driven platform helps you
              navigate the resale landscape, fueling sales growth and strategic
              inventory acquisition.
            </Box>
          </Flex>
          <Image
            src="/images/branding/product_card_images.png"
            rounded="md"
            shadow="dark-lg"
            transform="rotate(-1deg) skew(2deg)"
            maxW={["300px", "300px", "366px"]}
          />
        </Flex>
        {/* RETAILER COMPARISON END */}

        {/* ANALYSIS START */}
        <Flex
          flexDir={["column", "column", "row"]}
          justifyContent="space-between"
          alignItems={"center"}
          justifySelf={"center"}
        >
          <Flex
            maxW="400px"
            flexDir="column"
            rowGap={3}
            mt={[0, 0, -12]}
            mb={[12, 12, 0]}
          >
            <Box fontSize="sm" color="gray.400">
              ANALYSIS
            </Box>
            <Box fontSize={["3xl", "3xl", "4xl"]} fontWeight="bold">
              Comprehensive Product Analytics
            </Box>
            <Box color="gray.500">
              Harness all the product data you need to excel in the Amazon
              marketplace. Stay ahead with sales tracking, price trend analysis,
              and an understanding of the competitor dynamics in your targeted
              market.
            </Box>
          </Flex>
          <Image
            src="/images/branding/product_card_analysis.png"
            rounded="md"
            shadow="dark-lg"
            transform="rotate(1deg) skew(-2deg)"
            maxW={["90%", "90%", "366px"]}
          />
        </Flex>
        {/* ANALYSIS END */}

        {/* HISTORICAL DATA START */}
        <Flex
          flexDir={["column", "column", "row-reverse"]}
          justifyContent="space-between"
          alignItems={"center"}
          justifySelf={"center"}
          mt={[0, 0, 12]}
        >
          <Flex
            maxW="400px"
            flexDir="column"
            rowGap={3}
            mt={[0, 0, -12]}
            mb={[12, 12, 0]}
          >
            <Box fontSize="sm" color="gray.400">
              HISTORICAL DATA
            </Box>
            <Box fontSize={["3xl", "3xl", "4xl"]} fontWeight="bold">
              Accelerate Actions via Market Intelligence
            </Box>
            <Box color="gray.500">
              Use the power of our platform toolkit, transforming raw market
              data into actions that fuel your product reselling efforts. Spot
              emerging trends and make informed decisions swiftly and
              efficiently.
            </Box>
          </Flex>
          <Image
            src="/images/branding/product_card_historical_data.png"
            rounded="md"
            shadow="dark-lg"
            transform="rotate(-1deg) skew(5deg)"
            maxW={["95%", "95%", "450px"]}
          />
        </Flex>
        {/* HISTORICAL DATA END */}

        {/* OTHER OFFERS START */}
        <Flex
          flexDir={["column", "column", "row"]}
          justifyContent="space-between"
          alignItems={"center"}
          justifySelf={"center"}
          mt={[0, 0, 24]}
        >
          <Flex
            maxW="400px"
            flexDir="column"
            rowGap={3}
            mt={[0, 0, -12]}
            mb={[12, 12, 0]}
          >
            <Box fontSize="sm" color="gray.400">
              OTHER OFFERS
            </Box>
            <Box fontSize={["3xl", "3xl", "4xl"]} fontWeight="bold">
              Competitive Market Monitoring
            </Box>
            <Box color="gray.500">
              Keep a pulse on your category competition and digest live market
              trends to build a comprehensive understanding of your business
              landscape. Stay informed, stay competitive.
            </Box>
          </Flex>
          <Image
            src="/images/branding/product_card_other_offers.png"
            rounded="md"
            shadow="dark-lg"
            transform="rotate(1deg) skew(-5deg)"
            maxW={["95%", "95%", "366px"]}
          />
        </Flex>
        {/* OTHER OFFERS END */}

        {/* POWERFUL DATA START */}
        <Flex
          flexDir={["column", "column", "row-reverse"]}
          justifyContent="space-between"
          alignItems={"center"}
          justifySelf={"center"}
          mt={[0, 0, 12]}
        >
          <Flex
            maxW="400px"
            flexDir="column"
            rowGap={3}
            mt={[0, 0, -12]}
            mb={[12, 12, 0]}
          >
            <Box fontSize="sm" color="gray.400">
              POWERFUL DATA
            </Box>
            <Box fontSize={["3xl", "3xl", "4xl"]} fontWeight="bold">
              Make Informed Decisions
            </Box>
            <Box color="gray.500">
              Leverage our powerful data to make informed decisions. Our
              platform provides you with the tools to analyze the market and
              make the best decisions for your business.
            </Box>
          </Flex>
          <Image
            src="/images/branding/product_card_historical_data.png"
            rounded="md"
            shadow="dark-lg"
            transform="rotate(-1deg) skew(5deg)"
            maxW={["95%", "95%", "450px"]}
          />
        </Flex>
        {/* POWERFUL DATA END */}

        {/* SPECIFICATIONS START */}
        <Flex
          flexDir={["column", "column", "row"]}
          justifyContent="space-between"
          alignItems={"center"}
          justifySelf={"center"}
          mt={[0, 0, 24]}
        >
          <Flex
            maxW="400px"
            flexDir="column"
            rowGap={3}
            mt={[0, 0, -12]}
            mb={[12, 12, 0]}
          >
            <Box fontSize="sm" color="gray.400">
              SPECIFICATIONS
            </Box>
            <Box fontSize={["3xl", "3xl", "4xl"]} fontWeight="bold">
              Detailed Product Specifications
            </Box>
            <Box color="gray.500">
              Gather all vital product data required to scrutinize your
              competition and enhance your sales volume. Monitor key parameters
              including updates in packaging, product, weights, and sizes.
            </Box>
          </Flex>
          <Image
            src="/images/branding/product_card_specs.png"
            rounded="md"
            shadow="dark-lg"
            transform="rotate(1deg) skew(-5deg)"
            maxW={["95%", "95%", "366px"]}
          />
        </Flex>
        {/* SPECIFICATIONS END */}
      </Flex>
    </Box>
  );
}
