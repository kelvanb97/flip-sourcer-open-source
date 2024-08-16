import { Box, Flex, Heading } from "@chakra-ui/react";
import Modal from "../shared/Modal";

export default function EmailSubscriptionModal() {
  return (
    <Modal
      close={() => { console.log("no close"); }}
      closeOnOverlayClick={false}
      showX={false}
    >
      <Flex flexDir="column" rowGap={5}>
        <Heading>Sorry!</Heading>
        <Box>With a heavy heart I apologize to inform you that Flip Sourcer has gone out of business.</Box>
      </Flex>
    </Modal>
  );
}
