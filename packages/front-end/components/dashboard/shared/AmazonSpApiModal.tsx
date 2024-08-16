import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { amazonApplicationId } from "../../../utils/constants";
import Button from "../../shared/Button";
import Modal from "../../shared/Modal";
import { useRouter } from "next/router";

const amazonSpApiUri = `https://sellercentral.amazon.com/apps/authorize/consent?application_id=${amazonApplicationId}`;

interface AmazonSpApiModalProps {
  close: () => void;
}

export default function AmazonSpApiModal({ close }: AmazonSpApiModalProps) {
  const router = useRouter();

  return (
    <Modal close={() => close()} size="md">
      <Box>
        <Heading as="h3" size="lg">
          Connect your Amazon Seller Central account
        </Heading>
        <Text mt={3}>
          We use this connection to calculate fees associated with various ASINs
          as well as process additional product data.
        </Text>
        <Flex flexDir="row-reverse" mt={5}>
          <Button onClick={() => router.push(amazonSpApiUri)} shadow="none">
            Authorize
          </Button>
        </Flex>
      </Box>
    </Modal>
  );
}
