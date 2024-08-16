import { Box, Flex } from "@chakra-ui/react";
import { HiCheck } from "react-icons/hi";
import { BiNews } from "react-icons/bi";

export default function News() {
  return (
    <Flex
      flexDir="column"
      justifyContent="space-between"
      rounded="md"
      shadow="xl"
      bg="white"
      py={4}
      px={8}
      borderColor={"gray.300"}
      borderWidth={1}
      maxW={"400px"}
    >
      <Flex flexDir="column">
        <Flex justifyContent="center" alignItems="center">
          <BiNews size="60px" />
        </Flex>
        <Box mt={3} textAlign="center">
          <strong>News</strong>
        </Box>
        <Flex direction="column" rowGap={2} mt={5}>
          <Flex>
            <HiCheck color="green" size="24px" style={{ flexShrink: 0 }} />
            <Box pl={1}>
              Our product catalog is updated every Monday and Thursday morning.
            </Box>
          </Flex>
          <Flex>
            <HiCheck color="green" size="24px" style={{ flexShrink: 0 }} />
            <Box pl={1}>We are averaging 5 new supported sites per week!</Box>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
