import { Flex, Box } from "@chakra-ui/react";
import { useState } from "react";
import AmazonSpApiModal from "../shared/AmazonSpApiModal";
import Card from "../../shared/Card";
import Button from "../../shared/Button";

export default function AmazonSellerAccountSection() {
  const [showAmazonSpApiModal, setShowAmazonSpApiModel] = useState(false);
  const closeAmazonSpApiModal = () => setShowAmazonSpApiModel(false);

  return (
    <>
      {showAmazonSpApiModal && (
        <AmazonSpApiModal close={closeAmazonSpApiModal} />
      )}
      <Card p={0}>
        <Box
          fontSize="lg"
          fontWeight={""}
          borderBottom={"1px"}
          borderColor="gray.300"
          p={3}
        >
          <strong>Amazon Seller Account</strong>
        </Box>
        <Flex p={3} justifyContent={"space-between"}>
          <Box my="auto">Connect Amazon Seller account:</Box>
          <Button
            ml={5}
            size="sm"
            shadow="none"
            onClick={() => setShowAmazonSpApiModel(true)}
          >
            Reconnect
          </Button>
        </Flex>
      </Card>
    </>
  );
}
