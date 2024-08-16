import { Box, chakra } from "@chakra-ui/react";
import Link from "next/link";

interface Colors {
  bgColor: string;
  color: string;
}

interface BannerProps {
  type: "info" | "warning" | "error";
  msg: string | JSX.Element;
  cta: string;
  href?: string;
  onClick?: () => void;
}

export default function Banner({ type, msg, cta, href, onClick }: BannerProps) {
  let colors: Colors = {} as Colors;
  if (type === "info") {
    colors = {
      bgColor: "dodgerblue",
      color: "white",
    };
  } else if (type === "warning") {
    colors = {
      bgColor: "yellow.200",
      color: "yellow.800",
    };
  } else if (type === "error") {
    colors = {
      bgColor: "red.200",
      color: "red.800",
    };
  }

  return (
    <Box
      w="full"
      bgColor={colors.bgColor}
      color={colors.color}
      textAlign={"center"}
      fontWeight="bold"
      p={3}
      zIndex={1}
    >
      {msg}
      {` `}
      {href && (
        <Link href={href}>
          <chakra.span
            cursor="pointer"
            textDecor={"underline"}
            _hover={{ textDecor: "none" }}
          >
            {cta}
          </chakra.span>
        </Link>
      )}
      {onClick && (
        <chakra.span
          cursor="pointer"
          textDecor={"underline"}
          _hover={{ textDecor: "none" }}
          onClick={onClick}
        >
          {cta}
        </chakra.span>
      )}
    </Box>
  );
}
