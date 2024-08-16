import { Box, chakra } from "@chakra-ui/react";
import { useContext, useState } from "react";
import AmazonSpApiModal from "../dashboard/shared/AmazonSpApiModal";
import { DarkModeContext } from "../../providers/DarkModeProvider";

export default function ConnectionAmazonAccountBanner() {
  const [showAmazonSpApiModal, setShowAmazonSpApiModel] = useState(false);
  const closeAmazonSpApiModal = () => setShowAmazonSpApiModel(false);
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <>
      {showAmazonSpApiModal && (
        <AmazonSpApiModal close={closeAmazonSpApiModal} />
      )}
      <Box
        w="full"
        bgColor="dodgerblue"
        color="white"
        textAlign={"center"}
        fontWeight="bold"
        p={3}
        zIndex={1}
        borderBottom="1px solid"
        borderColor={isDarkMode ? "gray.700" : "gray.100"}
      >
        Please connect your Amazon Seller account. Certain features will not
        work without it.
        {` `}
        <chakra.span
          cursor="pointer"
          textDecor={"underline"}
          _hover={{ textDecor: "none" }}
          onClick={() => setShowAmazonSpApiModel(true)}
        >
          Connect
        </chakra.span>
      </Box>
    </>
  );
}
