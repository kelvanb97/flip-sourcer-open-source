import { Box, BoxProps, Flex, Heading, Text } from "@chakra-ui/react";
import { ProductInterface } from "../../../../../../types/Product";

type SpecsProps = {
  product: ProductInterface;
  isMetric: boolean;
} & BoxProps;

export default function Specs({ product, isMetric, ...props }: SpecsProps) {
  const { weight, dimensions } = product.amazonInfo;

  const getDisplayWeight = (rawSpec: number | undefined) =>
    rawSpec ? `${rawSpec} ${isMetric ? "kg" : "lbs"}` : "unknown";
  const displayWeight = getDisplayWeight(isMetric ? weight?.kg : weight?.lbs);

  const getDisplaydimension = (rawSpec: number | undefined) =>
    rawSpec ? `${rawSpec} ${isMetric ? "cm" : "in"}` : "unknown";
  const w = getDisplaydimension(isMetric ? dimensions?.wCm : dimensions?.wIn);
  const l = getDisplaydimension(isMetric ? dimensions?.lCm : dimensions?.lIn);
  const h = getDisplaydimension(isMetric ? dimensions?.hCm : dimensions?.hIn);

  return (
    <Box {...props}>
      <Heading size="md" mb={2}>
        Specs
      </Heading>
      <Flex direction="column" fontSize={"sm"} rowGap={5}>
        <Box>
          <Text fontWeight="bold">Weight</Text>
          <Flex
            justifyContent="space-between"
            borderTop="1px"
            borderColor="gray.300"
          >
            <Box>weight</Box>
            <Box>{displayWeight}</Box>
          </Flex>
        </Box>
        <Box>
          <Text fontWeight="bold">Dimensions</Text>
          <Flex
            justifyContent="space-between"
            borderTop="1px"
            borderColor="gray.300"
          >
            <Box>width</Box>
            <Box>{w}</Box>
          </Flex>
          <Flex justifyContent="space-between">
            <Box>length</Box>
            <Box>{l}</Box>
          </Flex>
          <Flex justifyContent="space-between">
            <Box>height</Box>
            <Box>{h}</Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
