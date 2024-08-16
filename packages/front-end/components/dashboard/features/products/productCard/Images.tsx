import {
  Box,
  chakra,
  Flex,
  Image,
  SimpleGrid,
  Badge,
  FlexProps,
} from "@chakra-ui/react";
import { Discount } from "../../../../../../types/Filters";
import {
  Condition,
  ProductInterface,
  RetailerName,
} from "../../../../../../types/Product";
import { conditionMap, retailerLogoMap } from "../../../../../utils/constants";
import { getSumOfDiscounts } from "../../../../../utils/product";
import { toPrice } from "../../../../../utils/shared";
import ConditionBadge from "../../../../shared/ConditionBadge";

type ProductCardImageSectionProps = {
  product: ProductInterface;
  discount: Discount;
} & FlexProps;

export default function Images({
  product,
  discount,
  ...props
}: ProductCardImageSectionProps) {
  return (
    <Flex flexDir="column" rowGap={3} {...props}>
      <Flex justifyContent="space-between" fontSize="sm">
        <chakra.span>
          <Badge
            bgColor={
              product.retailerInfo.productInStock ? "green.200" : "red.200"
            }
            color={
              product.retailerInfo.productInStock ? "green.500" : "red.500"
            }
            borderColor={
              product.retailerInfo.productInStock ? "green.500" : "red.500"
            }
            borderWidth="1px"
          >
            {product.retailerInfo.productInStock ? "In stock" : "Out of stock"}
          </Badge>
        </chakra.span>
      </Flex>
      <Flex flexDir="column" rowGap={1}>
        <Box>
          <img
            src={retailerLogoMap[product.retailerInfo.siteName as RetailerName]}
            width="90px"
            height="32px"
          />
          <Box>{product.retailerInfo.productName}</Box>
        </Box>
        <Flex columnGap={3}>
          <Box
            borderColor="gray.300"
            borderWidth="1px"
            p={3}
            bgColor="gray.100"
          >
            <Image src={product.retailerInfo.productImageLink} width={100} />
          </Box>
          <Flex flexDir="column" rowGap={1}>
            <Box fontWeight="bold" fontSize={"lg"} color="dodgerblue">
              <Box>
                <Badge
                  fontSize="xs"
                  color="green.500"
                  bgColor="green.200"
                  borderColor="green.500"
                  borderWidth="1px"
                >
                  New {toPrice(product.retailerInfo.productCost)}
                </Badge>
                {discount.enabled && (
                  <Badge
                    fontSize="xs"
                    color="green.500"
                    bgColor="green.200"
                    borderColor="green.500"
                    borderWidth="1px"
                    ml={1}
                  >
                    Discounted{" "}
                    {toPrice(
                      product.retailerInfo.productCost -
                        getSumOfDiscounts(
                          product.retailerInfo.productCost,
                          discount
                        )
                    )}
                  </Badge>
                )}
              </Box>
              <Box>
                {product.retailerInfo.productCostUsed && (
                  <Badge
                    fontSize="xs"
                    color="teal.500"
                    bgColor="teal.200"
                    borderColor="teal.500"
                    borderWidth="1px"
                  >
                    Used {toPrice(product.retailerInfo.productCostUsed)}
                  </Badge>
                )}
                {discount.enabled && product.retailerInfo.productCostUsed && (
                  <Badge
                    fontSize="xs"
                    color="teal.500"
                    bgColor="teal.200"
                    borderColor="teal.500"
                    borderWidth="1px"
                    ml={1}
                  >
                    Discounted{" "}
                    {toPrice(
                      product.retailerInfo.productCostUsed -
                        getSumOfDiscounts(
                          product.retailerInfo.productCostUsed,
                          discount
                        )
                    )}
                  </Badge>
                )}
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDir="column" rowGap={1}>
        <Box>
          <Box fontWeight="bold">Amazon</Box>
          <Box>{product.amazonInfo.productName}</Box>
        </Box>
        <Flex columnGap={3}>
          <Box
            borderColor="gray.300"
            borderWidth="1px"
            p={3}
            bgColor="gray.100"
          >
            <Image src={product.amazonInfo.productImageLink} width={100} />
          </Box>
          <Flex flexDir="column" rowGap={1}>
            <SimpleGrid columns={2} gap={1}>
              {Object.entries(product.amazonInfo.lowestOfferByCondition).map(
                ([condition, price], index) => {
                  return price ? (
                    <ConditionBadge
                      key={`$imagesConditionBadge${index}${product.id}`}
                      condition={condition as Condition}
                      body={`${toPrice(price)} ${
                        conditionMap[condition as Condition].short
                      }`}
                      tooltip={conditionMap[condition as Condition].long}
                    />
                  ) : null;
                }
              )}
            </SimpleGrid>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
