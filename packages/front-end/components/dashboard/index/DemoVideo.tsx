import { Box, Flex, Image } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export default function DemoVideo() {
  const videoEl = useRef(null);

  const attemptPlay = () => {
    if (typeof videoEl.current !== "object") return;

    // @ts-ignore
    videoEl && videoEl.current && videoEl.current.play();
  };

  useEffect(() => {
    attemptPlay();
  }, []);

  return (
    <Flex
      flexDirection="column"
      rounded="md"
      shadow="xl"
      bg="white"
      py={4}
      px={4}
      borderColor={"gray.300"}
      borderWidth={1}
      maxW={"500px"}
      minW={"500px"}
      textAlign={"center"}
    >
      <Flex justifyContent="center" alignItems="center">
        <Image src="/images/branding/logoNameBlue.svg" w="90%" />
      </Flex>
      <Box mt={3} textAlign="center">
        <strong>Demo Video</strong>
      </Box>
      <Box mt={1} color="gray.600" textAlign="center" fontSize={"sm"}>
        Watch this video to learn how to use Flip Sourcer.
      </Box>
      <Box position="relative" pb="56.25%" h={0}>
        <iframe
          src="https://www.loom.com/embed/161e98256f8845e7a9a648ac80e51bc1?sid=4ecefdda-5cee-494a-b0e0-261efe123c67"
          frameBorder="0"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
    </Flex>
  );
}
