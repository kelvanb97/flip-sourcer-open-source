import { Box, Flex, Image } from "@chakra-ui/react";
import { calendly } from "../../../theme";
import Button from "../../shared/Button";
import { AiOutlineCalendar } from "react-icons/ai";

export default function ScheduleADemo() {
  return (
    <Flex
      direction="column"
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
      <Box>
        <Flex justifyContent="center" alignItems="center">
          <Image src="/images/other/calendly.svg" w="70%" />
        </Flex>
        <Box mt={3} textAlign="center">
          <strong>Schedule a Demo</strong>
        </Box>
        <Flex direction="column" rowGap={2} mt={5}>
          Experience the power of Flip Sourcer firsthand. Schedule a demo with
          us today and discover how we can revolutionize your sourcing.
        </Flex>
      </Box>

      <Flex justifyContent="center" alignItems="center">
        <Button
          mt={5}
          bg={calendly}
          icon={AiOutlineCalendar}
          iconPosition="left"
          iconStyle={{ marginBottom: "-3px" }}
          shadow="none"
          onClick={() =>
            window.open("https://calendly.com/flip-sourcer/15min", "_blank")
          }
        >
          Schedule a demo
        </Button>
      </Flex>
    </Flex>
  );
}
