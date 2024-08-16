import { Box } from "@chakra-ui/react";

interface AlertProps {
  type: "error" | "success";
  message: string;
}

export default function Alert({ type, message }: AlertProps) {
  return (
    <>
      {message && (
        <Box
          bg={type === "error" ? "red.100" : "green.100"}
          border="1px"
          borderColor={type === "error" ? "red.500" : "green.500"}
          py={2}
          px={4}
          color={type === "error" ? "red.400" : "green.400"}
          borderRadius="md"
        >
          {message}
        </Box>
      )}
    </>
  );
}
