import {
  Box,
  Button,
  chakra,
  Circle,
  Heading,
  HStack,
  Icon,
  List,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FiCheck } from "react-icons/fi";
import { ProductProps } from "../../constants/products";

interface PricingCardProps {
  product: ProductProps;
  href: string;
  cta?: string;
  isStripe?: boolean;
  onClick?: () => Promise<void>;
}

export const PricingCard = ({
  product,
  href,
  cta = "Get started",
  isStripe = false,
  onClick,
}: PricingCardProps) => {
  return (
    <Box
      bg="white"
      borderRadius="md"
      shadow="dark-lg"
      px={8}
      py={8}
      minW={"320px"}
      maxW={"320px"}
    >
      <Stack spacing="8" textAlign="center">
        <Stack spacing="5" align="center">
          <Stack spacing="4">
            <Heading mt={5} size={useBreakpointValue({ base: "md", md: "lg" })}>
              <chakra.span fontSize={"2xl"}>${product.price}</chakra.span>
              <chakra.span fontSize={"sm"} fontWeight={"light"}>
                /{product.frequency}
              </chakra.span>
            </Heading>
            <Stack spacing="1">
              <Text fontSize="xl" fontWeight="semibold">
                {product.planName}
              </Text>
              <Text color="muted">{product.description || <br />}</Text>
              <Text color="gray.600" fontSize={"sm"}>
                {product.subdescription || <br />}
              </Text>
            </Stack>
          </Stack>
        </Stack>
        <List as="ul" spacing="4">
          {product.features.map((feature) => (
            <HStack key={feature} as="li" spacing="3">
              <Circle size="6" bg={mode("pink.50", "whiteAlpha.50")}>
                <Icon as={FiCheck} color="dodgerblue" />
              </Circle>
              <Text color="muted">{feature}</Text>
            </HStack>
          ))}
        </List>
        <>
          {isStripe && onClick ? (
            <>
              <Button
                bg={product.disabled ? "gray.500" : "dodgerblue"}
                color="white"
                size="lg"
                disabled={product.disabled}
                cursor={product.disabled ? "not-allowed" : "pointer"}
                onClick={async () => {
                  if (!product.disabled) await onClick();
                }}
              >
                {cta}
              </Button>
            </>
          ) : (
            <Link href={href}>
              <Button
                bg="dodgerblue"
                color="white"
                size="lg"
                disabled={product.disabled}
              >
                {cta}
              </Button>
            </Link>
          )}
        </>
      </Stack>
    </Box>
  );
};
