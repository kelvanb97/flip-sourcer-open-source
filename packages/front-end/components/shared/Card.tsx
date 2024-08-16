import { Box, BoxProps } from "@chakra-ui/react";

type CardProps = {
  children: React.ReactNode;
} & BoxProps;

export default function Card({ children, ...props }: CardProps) {
  return (
    <Box
      rounded="md"
      shadow="xl"
      bg="white"
      borderColor={"gray.300"}
      borderWidth={1}
      p={3}
      {...props}
    >
      {children}
    </Box>
  );
}
