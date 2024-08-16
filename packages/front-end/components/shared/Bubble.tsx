import { Box } from "@chakra-ui/react";

interface BubbleProps {
  bgColor?: string;
  bold?: boolean;
  maxW?: string;
  body?: string;
  jsxBody?: JSX.Element;
}

export default function Bubble({
  bgColor = "dodgerblue",
  bold = true,
  maxW = "200px",
  body,
  jsxBody,
}: BubbleProps) {
  return (
    <Box
      bgColor={bgColor}
      color="white"
      rounded="md"
      px={4}
      py={1}
      maxW={maxW}
      textAlign={"center"}
      fontSize={"sm"}
    >
      <>
        {body && (bold ? <strong>{body}</strong> : { body })}
        {jsxBody && jsxBody}
      </>
    </Box>
  );
}
