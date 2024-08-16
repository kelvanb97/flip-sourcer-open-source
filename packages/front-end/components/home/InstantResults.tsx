import { Box, Flex, Image } from "@chakra-ui/react";

export default function InstantResults() {
  return (
    <Box maxW="950px" mx="auto">
      <Flex
        flexDir={["column-reverse", "column-reverse", "row-reverse"]}
        justifyContent="space-between"
        alignItems={"center"}
        justifySelf={"center"}
      >
        <Image
          src={"/images/branding/instant_results.png"}
          rounded="md"
          shadow="dark-lg"
          transform="rotate(1deg) skew(-2deg)"
          maxW={["300px", "300px", "450px"]}
        />
        <Flex
          maxW="400px"
          flexDir="column"
          rowGap={3}
          mt={[0, 0, -12]}
          mb={[12, 12, 0]}
        >
          <Box fontSize="lg" color="gray.400">
            NO MORE WAITING FOR SCANS OR PAYING FOR MINUTES
          </Box>
          <Box fontSize={["3xl", "4xl", "5xl"]} fontWeight="bold">
            Instant Results
          </Box>
          <Box
            mt={5}
            mx="auto"
            textAlign="left"
            color="gray.500"
            fontSize={"lg"}
            maxW="lg"
          >
            From the moment you log in, you{`'`}ll be able to see the most
            profitable items from your favorite sourcing sites.
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
