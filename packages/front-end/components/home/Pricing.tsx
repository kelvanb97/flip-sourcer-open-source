import { Box, Flex, Heading } from "@chakra-ui/react";
import * as React from "react";
import { products } from "../../constants/products";
import { PricingCard } from "../shared/PricingCard";

export default function Pricing() {
  return (
    <Box>
      <Heading
        fontSize={["5xl", "6xl", "7xl"]}
        color="white"
        textAlign={"center"}
      >
        Pricing
      </Heading>
      <Heading
        fontSize={["2xl", "3xl", "4xl"]}
        color="white"
        textAlign={"center"}
      >
        All plans include a 7-day free trial
      </Heading>
      <Flex
        mt={5}
        direction={["column", "column", "row"]}
        columnGap={8}
        rowGap={8}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {products.map((product, id) => (
          <PricingCard
            key={`pricingCard${id}`}
            product={product}
            href={`/sign-up?plan=${product.planName}`}
            cta={"Start free trial"}
          />
        ))}
      </Flex>
    </Box>
  );
}
