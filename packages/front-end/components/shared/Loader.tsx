import { Flex, Spinner } from "@chakra-ui/react";

interface LoaderProps {
  color?: string;
  size?: string;
}

export default function Loader({
  color = "dodgerblue",
  size = "xl",
}: LoaderProps) {
  return (
    <Flex justifyContent="center" alignItems="center" my="auto">
      <Spinner color={color} size={size} textAlign={"center"} />
    </Flex>
  );
}
