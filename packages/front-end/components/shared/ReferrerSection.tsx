import { Box, Flex, Image } from "@chakra-ui/react";
import {
  referrerLogoMap,
  referrerMessageMap,
  reffererList,
} from "../../utils/constants";
import { getLocalStorageVar } from "../../utils/localstorage";
import { Referrer } from "../../../types/User";
import { useEffect, useState } from "react";

export default function ReferrerSection() {
  const [isClient, setIsClient] = useState(false);
  const referrer = getLocalStorageVar("referrer");

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  if (!referrer || !reffererList.includes(referrer as Referrer)) return null;

  return (
    <Flex
      rounded="md"
      borderColor="gray.200"
      borderWidth="1px"
      p={4}
      my={5}
      bg="white"
    >
      <Image
        src={referrerLogoMap[referrer as Referrer]}
        alt={`${referrer} logo}`}
        width="50px"
        height="50px"
        rounded="100%"
      />
      <Box fontSize={"xl"} fontWeight="bold" m="auto">
        {referrerMessageMap[referrer as Referrer].title}
      </Box>
    </Flex>
  );
}
