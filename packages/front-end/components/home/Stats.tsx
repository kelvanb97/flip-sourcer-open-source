import { Box, Flex } from "@chakra-ui/react";
import { FiBox } from "react-icons/fi";
import { SlGraph } from "react-icons/sl";
import { IoServerOutline } from "react-icons/io5";

const statList = [
  {
    icon: <FiBox size={"72px"} />,
    header: "3,000,000+",
    text: "Products Scanned",
  },
  {
    icon: <SlGraph size={"72px"} />,
    header: "20,000+",
    text: "Profitable Items Found",
  },
  {
    icon: <IoServerOutline size={"72px"} />,
    header: "100+",
    text: "Metrics Tracked",
  },
];

export default function Stats() {
  return (
    <Flex
      direction={["column", "column", "column", "column", "row"]}
      rowGap={12}
      color="white"
      py={12}
      textAlign={"center"}
      alignItems={"center"}
      justifyContent={"center"}
      fontSize={["4xl"]}
    >
      {statList.map((stat, index) => (
        <Box mx={[16]} key={index}>
          <Flex alignItems={"center"} justifyContent={"center"}>
            <Box my={"auto"}>{stat.icon}</Box>
            <Box my={"auto"} ml={3} fontWeight={"bold"}>
              {stat.header}
            </Box>
          </Flex>
          <Box fontSize={["3xl"]}>{stat.text}</Box>
        </Box>
      ))}
    </Flex>
  );
}
