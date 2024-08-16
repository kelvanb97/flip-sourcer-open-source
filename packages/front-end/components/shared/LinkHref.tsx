import { Box, BoxProps as ChakraBoxProps } from "@chakra-ui/react";
import NextLink from "next/link";

type LinkHrefProps = {
  color?: string;
  href?: string;
  children: React.ReactNode;
} & ChakraBoxProps;

export default function LinkHref({
  color = "dodgerblue",
  href = "#",
  children,
  ...props
}: LinkHrefProps) {
  return (
    <NextLink href={href}>
      <Box
        as="a"
        color={color}
        cursor="pointer"
        _hover={{
          textDecoration: "underline",
        }}
        {...props}
      >
        {children}
      </Box>
    </NextLink>
  );
}
