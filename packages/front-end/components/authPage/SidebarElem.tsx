import { Box, Flex, Tooltip } from "@chakra-ui/react";
import React from "react";

type SidebarElemProps = {
  depth?: number;
  icon?: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  sidbarOpen: boolean;
};

export default function SidebarElem({
  depth = 0,
  icon,
  label,
  active,
  onClick,
  sidbarOpen,
}: SidebarElemProps) {
  return (
    <Tooltip
      label={label}
      placement="right"
      bg="white"
      color="black"
      fontSize="md"
      hasArrow
    >
      <Flex
        bg={active ? "rgba(255, 255, 255, 0.2)" : "transparent"}
        rounded="md"
        py={2}
        pl={3 + 4 * depth}
        pr={3}
        justifyContent={"start"}
        color="white"
        cursor="pointer"
        _hover={{ bg: "dodgerblue" }}
        onClick={() => onClick()}
      >
        <Flex>
          <Box my="auto">{icon}</Box>
          {sidbarOpen && (
            <Box ml={2} my="auto" fontWeight={"bold"} fontSize={"sm"}>
              {label}
            </Box>
          )}
        </Flex>
      </Flex>
    </Tooltip>
  );
}
