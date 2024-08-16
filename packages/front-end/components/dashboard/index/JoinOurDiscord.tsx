import { Box, Flex } from "@chakra-ui/react";
import { FaDiscord } from "react-icons/fa";
import { HiCheck } from "react-icons/hi";
import { discord } from "../../../theme";
import Button from "../../shared/Button";

export default function JoinOurDiscord() {
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
          <FaDiscord size="60px" color={discord} />
        </Flex>
        <Box mt={3} textAlign="center">
          <strong>Join our Discord</strong>
        </Box>
        <Flex direction="column" rowGap={2} mt={5}>
          <Flex>
            <HiCheck color="green" size="24px" style={{ flexShrink: 0 }} />
            <Box pl={1}>Get the latest news and updates</Box>
          </Flex>
          <Flex>
            <HiCheck color="green" size="24px" style={{ flexShrink: 0 }} />
            <Box pl={1}>Fastest way to get help</Box>
          </Flex>
          <Flex>
            <HiCheck color="green" size="24px" style={{ flexShrink: 0 }} />
            <Box pl={1}>Join a community of like minded people</Box>
          </Flex>
          <Flex>
            <HiCheck color="green" size="24px" style={{ flexShrink: 0 }} />
            <Box pl={1}>Learn from others</Box>
          </Flex>
        </Flex>
      </Flex>

      <Flex justifyContent="center" alignItems="center">
        <Button
          mt={5}
          bg={discord}
          icon={FaDiscord}
          iconPosition="left"
          iconStyle={{ marginBottom: "-3px" }}
          shadow="none"
          onClick={() => window.open("https://discord.gg/aXEDxJSYBD", "_blank")}
        >
          Join Discord
        </Button>
      </Flex>
    </Flex>
  );
}
