import {
  Box,
  BoxProps,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Tooltip,
  Text,
  chakra,
  useToast,
  Button as ChakraButton,
  Spinner,
  Input,
  Badge,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { HiEye } from "react-icons/hi";
import { MdInfoOutline, MdOutlineSync } from "react-icons/md";
import {
  Condition,
  Fee,
  ProductInterface,
} from "../../../../../../types/Product";
import { GeneralSettings } from "../../../../../../types/User";
import { apiCall } from "../../../../../utils/apiCall";
import { conditionMap, conditions } from "../../../../../utils/constants";
import { toDisplayNumber, toPrice } from "../../../../../utils/shared";
import ConditionBadge from "../../../../shared/ConditionBadge";
import {
  calculateMetaByCondition,
  calculateTotalFees,
} from "../../../../../utils/product";
import { AiFillStar } from "react-icons/ai";

function toPriceWrapper(price: number | undefined | null) {
  return price ? toPrice(price) : "$0.00";
}

export type ProductAnalysisMeta = {
  profit: number | undefined;
  roi: number | undefined;
  cogs: number | undefined;
  effectiveCogs: number | undefined;
  cashbackSum: number | undefined;
  discountSum: number | undefined;
};

type AnalysisProps = {
  product: ProductInterface;
  generalSettings: GeneralSettings;
  discount: {
    enabled: boolean;
    type: "flat" | "percent";
    flat: number;
    percent: number;
  };
} & BoxProps;

export default function Analysis({
  product,
  generalSettings,
  discount,
  ...props
}: AnalysisProps) {
  const retailerConditions: Array<"new" | "used"> = product.retailerInfo
    .productCostUsed
    ? ["new", "used"]
    : ["new"];
  const [activeRetailerCondition, setActiveRetailerCondition] = useState<
    "new" | "used"
  >("new");

  const toast = useToast();
  const [numUnits, setNumUnits] = useState(1);
  const [customFees, setCustomFees] = useState(0);
  const [customRewards, setCustomRewards] = useState(0);
  const cashback = {
    flat: generalSettings.cashback.flat,
    percent: generalSettings.cashback.percent,
  };
  const [activeCondition, setActiveCondition] = useState<Condition>(
    Object.keys(product.amazonInfo.lowestOfferByCondition)[0] as Condition
  );

  const [feesByCondition, setFeesByCondition] = useState<
    Record<
      Condition,
      { specificToUser: boolean; loading: boolean; feeList: Fee[] }
    >
  >({
    fbaNew: {
      specificToUser: false,
      loading: false,
      feeList: product.amazonInfo.fees.fbaNew,
    },
    fbaLikeNew: {
      specificToUser: false,
      loading: false,
      feeList: product.amazonInfo.fees.fbaLikeNew,
    },
    fbaVeryGood: {
      specificToUser: false,
      loading: false,
      feeList: product.amazonInfo.fees.fbaVeryGood,
    },
    fbaGood: {
      specificToUser: false,
      loading: false,
      feeList: product.amazonInfo.fees.fbaGood,
    },
    fbaAcceptable: {
      specificToUser: false,
      loading: false,
      feeList: product.amazonInfo.fees.fbaAcceptable,
    },
    fbmAny: {
      specificToUser: false,
      loading: false,
      feeList: product.amazonInfo.fees.fbmAny,
    },
  });

  const [metaByCondition, setMetaByCondition] = useState<
    Record<"new" | "used", Record<Condition, ProductAnalysisMeta>>
  >({
    new: {
      fbaNew: calculateMetaByCondition({
        retailerCost: product.retailerInfo.productCost,
        salePricePerUnit: product.amazonInfo.lowestOfferByCondition.fbaNew,
        cashback,
        fees: product.amazonInfo.fees.fbaNew,
        discount,
      }),
      fbaLikeNew: calculateMetaByCondition({
        retailerCost: product.retailerInfo.productCost,
        salePricePerUnit: product.amazonInfo.lowestOfferByCondition.fbaLikeNew,
        cashback,
        fees: product.amazonInfo.fees.fbaLikeNew,
        discount,
      }),
      fbaVeryGood: calculateMetaByCondition({
        retailerCost: product.retailerInfo.productCost,
        salePricePerUnit: product.amazonInfo.lowestOfferByCondition.fbaVeryGood,
        cashback,
        fees: product.amazonInfo.fees.fbaVeryGood,
        discount,
      }),
      fbaGood: calculateMetaByCondition({
        retailerCost: product.retailerInfo.productCost,
        salePricePerUnit: product.amazonInfo.lowestOfferByCondition.fbaGood,
        cashback,
        fees: product.amazonInfo.fees.fbaGood,
        discount,
      }),
      fbaAcceptable: calculateMetaByCondition({
        retailerCost: product.retailerInfo.productCost,
        salePricePerUnit:
          product.amazonInfo.lowestOfferByCondition.fbaAcceptable,
        cashback,
        fees: product.amazonInfo.fees.fbaAcceptable,
        discount,
      }),
      fbmAny: calculateMetaByCondition({
        retailerCost: product.retailerInfo.productCost,
        salePricePerUnit: product.amazonInfo.lowestOfferByCondition.fbmAny,
        cashback,
        fees: product.amazonInfo.fees.fbmAny,
        discount,
      }),
    },
    used: {
      fbaNew: calculateMetaByCondition({
        retailerCost: product.retailerInfo.productCostUsed,
        salePricePerUnit: product.amazonInfo.lowestOfferByCondition.fbaNew,
        cashback,
        fees: product.amazonInfo.fees.fbaNew,
        discount,
      }),
      fbaLikeNew: calculateMetaByCondition({
        retailerCost: product.retailerInfo.productCostUsed,
        salePricePerUnit: product.amazonInfo.lowestOfferByCondition.fbaLikeNew,
        cashback,
        fees: product.amazonInfo.fees.fbaLikeNew,
        discount,
      }),
      fbaVeryGood: calculateMetaByCondition({
        retailerCost: product.retailerInfo.productCostUsed,
        salePricePerUnit: product.amazonInfo.lowestOfferByCondition.fbaVeryGood,
        cashback,
        fees: product.amazonInfo.fees.fbaVeryGood,
        discount,
      }),
      fbaGood: calculateMetaByCondition({
        retailerCost: product.retailerInfo.productCostUsed,
        salePricePerUnit: product.amazonInfo.lowestOfferByCondition.fbaGood,
        cashback,
        fees: product.amazonInfo.fees.fbaGood,
        discount,
      }),
      fbaAcceptable: calculateMetaByCondition({
        retailerCost: product.retailerInfo.productCostUsed,
        salePricePerUnit:
          product.amazonInfo.lowestOfferByCondition.fbaAcceptable,
        cashback,
        fees: product.amazonInfo.fees.fbaAcceptable,
        discount,
      }),
      fbmAny: calculateMetaByCondition({
        retailerCost: product.retailerInfo.productCostUsed,
        salePricePerUnit: product.amazonInfo.lowestOfferByCondition.fbmAny,
        cashback,
        fees: product.amazonInfo.fees.fbmAny,
        discount,
      }),
    },
  });

  useEffect(() => {
    const retailerCostPropName =
      activeRetailerCondition === "new" ? "productCost" : "productCostUsed";
    setMetaByCondition((prev) => ({
      ...prev,
      [activeRetailerCondition]: {
        ...prev[activeRetailerCondition],
        [activeCondition]: {
          ...calculateMetaByCondition({
            retailerCost: product.retailerInfo[retailerCostPropName],
            salePricePerUnit:
              product.amazonInfo.lowestOfferByCondition[activeCondition],
            cashback,
            fees: product.amazonInfo.fees[activeCondition],
            discount,
            numUnits,
            customFees,
            customRewards,
          }),
        },
      },
    }));
  }, [
    activeRetailerCondition,
    activeCondition,
    numUnits,
    customFees,
    customRewards,
  ]);

  async function getFeesBasedOnUser(condition: Condition) {
    setFeesByCondition((prev) => ({
      ...prev,
      [condition]: {
        ...prev[condition],
        loading: true,
      },
    }));

    const res = await apiCall<{ fees: Fee[] }>(
      "/product/fees-specific-to-user",
      {
        method: "POST",
        body: {
          purchasePrice: product.retailerInfo.productCost,
          salePrice: product.amazonInfo.lowestOfferByCondition[condition],
          asin: product.amazonInfo.asin,
          weightInPounds: product.amazonInfo.weight.lbs || 0,
        },
        isSessionRequest: true,
      }
    );

    if (!res || !res.fees) {
      setFeesByCondition((prev) => ({
        ...prev,
        [condition]: {
          ...prev[condition],
          loading: false,
        },
      }));
      return toast({
        title: "Error",
        description:
          "Something went wrong while fetching fees. Make sure you have connected your Amazon Seller account.",
        status: "error",
        duration: null,
        isClosable: true,
      });
    }

    setFeesByCondition((prev) => ({
      ...prev,
      [condition]: {
        specificToUser: true,
        loading: false,
        feeList: res.fees,
      },
    }));

    setMetaByCondition((prev) => ({
      ...prev,
      new: {
        ...prev.new,
        [activeCondition]: calculateMetaByCondition({
          retailerCost: product.retailerInfo.productCost,
          salePricePerUnit:
            product.amazonInfo.lowestOfferByCondition[activeCondition],
          cashback,
          fees: product.amazonInfo.fees[activeCondition],
          discount,
        }),
      },
      used: {
        ...prev.used,
        [activeCondition]: calculateMetaByCondition({
          retailerCost: product.retailerInfo.productCostUsed,
          salePricePerUnit:
            product.amazonInfo.lowestOfferByCondition[activeCondition],
          cashback,
          fees: product.amazonInfo.fees[activeCondition],
          discount,
        }),
      },
    }));
  }

  return (
    <Box {...props}>
      <Heading size="md" mb={2}>
        Analysis
      </Heading>
      <Flex direction="column" rowGap={1} fontSize="sm">
        <Text fontWeight="bold" borderBottom="1px" borderColor="gray.300">
          Top level data
        </Text>

        {/* ASIN */}
        <Flex justifyContent="space-between" px={2}>
          <chakra.span>ASIN</chakra.span>
          <chakra.span>{product.amazonInfo.asin}</chakra.span>
        </Flex>

        {/* CATEGORY */}
        <Flex justifyContent="space-between" bg="gray.100" px={2}>
          <chakra.span>Category</chakra.span>
          <chakra.span>{product.amazonInfo.category}</chakra.span>
        </Flex>

        {/* BUY BOX */}
        <Flex justifyContent="space-between" px={2}>
          <chakra.span mr={0.5}>Buy Box</chakra.span>
          <chakra.span>
            {product.amazonInfo.hasBuyBox ? (
              toPriceWrapper(product.amazonInfo.buyBoxPrice)
            ) : (
              <chakra.span color="red.500">N/A</chakra.span>
            )}
          </chakra.span>
        </Flex>

        {/* NUM SELLERS */}
        <Flex justifyContent="space-between" bg="gray.100" px={2}>
          <chakra.span># of Sellers:</chakra.span>
          <chakra.span>
            {(product.amazonInfo.infoFromKeepa.countOfRetrievedLiveOffersFba ||
              0) +
              (product.amazonInfo.infoFromKeepa.countOfRetrievedLiveOffersFbm ||
                0)}
          </chakra.span>
        </Flex>

        {/* RATING */}
        <Flex justifyContent="space-between" px={2}>
          <chakra.span>Rating</chakra.span>
          <Flex>
            <>
              {product.amazonInfo.rating ? product.amazonInfo.rating : "?"}
              <AiFillStar
                color="#F6BC0C"
                size="16px"
                style={{ marginTop: "1px" }}
              />
            </>
            <Box ml={3}>
              {product.amazonInfo.reviewCount &&
              product.amazonInfo.reviewCount > 0
                ? toDisplayNumber(product.amazonInfo.reviewCount)
                : "?"}{" "}
              reviews
            </Box>
          </Flex>
        </Flex>

        {/* SALES RANK */}
        <Flex justifyContent="space-between" bg="gray.100" px={2}>
          <chakra.span mr={0.5}>Sales Rank</chakra.span>
          <Flex>
            <chakra.span mr={0.5}>
              {product.amazonInfo.salesRank.percent
                ? product.amazonInfo.salesRank.percent < 1
                  ? "<1%"
                  : `${product.amazonInfo.salesRank.percent}%`
                : "?"}
            </chakra.span>
            <Tooltip
              label={
                "Sales rank as a percent. Sales rank divided by the total number of products in the category."
              }
              hasArrow
              placement="top-start"
            >
              <chakra.span my="auto">
                <MdInfoOutline
                  cursor="pointer"
                  color="dodgerblue"
                  size="14px"
                />
              </chakra.span>
            </Tooltip>
          </Flex>
          <chakra.span>
            {product.amazonInfo.salesRank.flat
              ? toDisplayNumber(product.amazonInfo.salesRank.flat)
              : "?"}
          </chakra.span>
        </Flex>
      </Flex>

      {/* CONDITIONS FOR COMPARISON */}
      <Box mt={5} fontSize="sm">
        <Flex borderBottom="1px" borderColor="gray.300">
          <chakra.span fontWeight="bold" mr={0.5}>
            Conditions for comparison
          </chakra.span>
          <Tooltip
            label={
              "Calculates the metrics listed below using the Retailer and Amazon conditions selected"
            }
            hasArrow
            placement="top-start"
          >
            <chakra.span my="auto">
              <MdInfoOutline cursor="pointer" color="dodgerblue" size="14px" />
            </chakra.span>
          </Tooltip>
        </Flex>
        <RadioGroup
          value={activeRetailerCondition}
          display="flex"
          columnGap={3}
          my={2}
        >
          <Radio
            value={"new"}
            onChange={() => setActiveRetailerCondition("new")}
            checked={activeRetailerCondition === "new"}
          >
            <Tooltip label={"Retailer - New"} hasArrow placement="top-start">
              <Badge
                color="green.500"
                bg="green.200"
                borderWidth="1px"
                borderColor="green.500"
                cursor="default"
              >
                New
              </Badge>
            </Tooltip>
          </Radio>
          {retailerConditions.includes("used") && (
            <Radio
              value={"used"}
              onChange={() => setActiveRetailerCondition("used")}
              checked={activeRetailerCondition === "used"}
            >
              <Tooltip label={"Retailer - Used"} hasArrow placement="top-start">
                <Badge
                  color="teal.500"
                  bg="teal.200"
                  borderWidth="1px"
                  borderColor="teal.500"
                  cursor="default"
                >
                  Used
                </Badge>
              </Tooltip>
            </Radio>
          )}
        </RadioGroup>
        <RadioGroup value={activeCondition} display="flex" columnGap={3} my={2}>
          {conditions.map((condition) => {
            if (!product.amazonInfo.lowestOfferByCondition[condition])
              return null;
            return (
              <Radio
                key={`${condition}${product.id}`}
                value={condition}
                onChange={() => setActiveCondition(condition)}
                checked={activeCondition === condition}
              >
                <ConditionBadge
                  condition={condition}
                  body={conditionMap[condition].short}
                  tooltip={conditionMap[condition].long}
                />
              </Radio>
            );
          })}
        </RadioGroup>
      </Box>

      <Flex mt={3} direction="column" rowGap={1} fontSize="sm">
        <Flex
          fontWeight="bold"
          borderBottom="1px"
          borderColor="gray.300"
          columnGap={1}
          pb={0.5}
        >
          <Box>Data for:</Box>
          <Badge
            color={activeRetailerCondition === "new" ? "green.500" : "teal.500"}
            bg={activeRetailerCondition === "new" ? "green.200" : "teal.200"}
            borderWidth="1px"
            borderColor={
              activeRetailerCondition === "new" ? "green.500" : "teal.500"
            }
            cursor="default"
          >
            Retailer - {activeRetailerCondition === "new" ? "New" : "Used"}
          </Badge>
          <Badge
            color={activeCondition.includes("fba") ? "orange.500" : "blue.500"}
            bg={activeCondition.includes("fba") ? "orange.200" : "blue.200"}
            borderWidth="1px"
            borderColor={
              activeCondition.includes("fba") ? "orange.500" : "blue.500"
            }
            cursor="default"
          >
            {conditionMap[activeCondition].long}
          </Badge>
        </Flex>

        {/* # OF UNITS */}
        <Flex justifyContent="space-between">
          <chakra.span># of Units</chakra.span>
          <Input
            type="number"
            textAlign="right"
            size="xs"
            fontSize={"xs"}
            width="40px"
            rounded="md"
            value={numUnits}
            onChange={(e) => {
              let tmpNumUnits = parseFloat(e.target.value);
              if (tmpNumUnits < 1) {
                toast({
                  title: "Invalid number of units",
                  description: "num units must be greater than 0",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                });
                tmpNumUnits = 1;
              }
              setNumUnits(tmpNumUnits);
            }}
            onBlur={() => {
              if (isNaN(numUnits)) {
                setNumUnits(1);
              }
            }}
          />
        </Flex>

        {/* CUSTOM REWARDS */}
        <Flex justifyContent="space-between">
          <Flex>
            <chakra.span mr={0.5}>Custom Reward Per Unit</chakra.span>
            <Tooltip
              label={
                "Some sites like Kohl's, GameStop, etc, have rewards programs. You can enter the amount of rewards you will earn here."
              }
              hasArrow
              placement="top-start"
            >
              <chakra.span>
                <MdInfoOutline
                  cursor="pointer"
                  color="dodgerblue"
                  size="14px"
                  style={{ marginTop: "3px" }}
                />
              </chakra.span>
            </Tooltip>
          </Flex>
          <Box>
            <InputGroup size="xs" fontSize={"xs"}>
              <InputLeftAddon rounded="md">$</InputLeftAddon>
              <Input
                type="number"
                textAlign="right"
                rounded="md"
                width="60px"
                value={customRewards}
                onChange={(e) => setCustomRewards(parseFloat(e.target.value))}
                onBlur={() => {
                  if (isNaN(customRewards)) {
                    setCustomRewards(0);
                  }
                }}
              />
            </InputGroup>
          </Box>
        </Flex>

        {/* CUSTOM FEE */}
        <Flex justifyContent="space-between">
          <chakra.span>Custom Fee Per Unit</chakra.span>
          <Box>
            <InputGroup size="xs" fontSize={"xs"}>
              <InputLeftAddon rounded="md">$</InputLeftAddon>
              <Input
                type="number"
                textAlign="right"
                rounded="md"
                width="60px"
                value={customFees}
                onChange={(e) => setCustomFees(parseFloat(e.target.value))}
                onBlur={() => {
                  if (isNaN(customFees)) {
                    setCustomFees(0);
                  }
                }}
              />
            </InputGroup>
          </Box>
        </Flex>

        {/* Revenue */}
        <Flex justifyContent="space-between">
          <chakra.span>Revenue</chakra.span>
          <chakra.span fontWeight="bold">
            {toPriceWrapper(
              (product.amazonInfo.lowestOfferByCondition[activeCondition] ||
                0) * numUnits
            )}
          </chakra.span>
        </Flex>

        {/* Effective COGS */}
        <Flex justifyContent="space-between">
          <Flex>
            <chakra.span mr={0.5}>Effective COGS</chakra.span>
            <Tooltip
              label={
                <Flex direction="column" fontSize="xs">
                  <Box fontWeight="bold" borderBottom="1px">
                    Effective COGS: Cost of goods sold after cashback,
                    discounts, and custom rewards.
                  </Box>
                  <Flex justifyContent="space-between">
                    <Text>COGS</Text>
                    <Text ml={5}>
                      {toPriceWrapper(
                        metaByCondition[activeRetailerCondition][
                          activeCondition
                        ].cogs || 0
                      )}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>Discounts</Text>
                    <Text ml={5}>
                      -
                      {toPriceWrapper(
                        metaByCondition[activeRetailerCondition][
                          activeCondition
                        ].discountSum || 0
                      )}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>Cashback</Text>
                    <Text ml={5}>
                      -
                      {toPriceWrapper(
                        metaByCondition[activeRetailerCondition][
                          activeCondition
                        ].cashbackSum || 0
                      )}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>Custom Rewards</Text>
                    <Text ml={5}>
                      -{toPriceWrapper(customRewards * numUnits || 0)}
                    </Text>
                  </Flex>
                  <Flex borderTop="1px" justifyContent="space-between" mt={2}>
                    <Text fontWeight="bold">Effective COGS</Text>
                    <Text ml={5}>
                      {toPriceWrapper(
                        metaByCondition[activeRetailerCondition][
                          activeCondition
                        ].effectiveCogs
                      )}
                    </Text>
                  </Flex>
                </Flex>
              }
              hasArrow
              placement="top-start"
            >
              <chakra.span my="auto">
                <HiEye cursor="pointer" color="gray" size="16px" />
              </chakra.span>
            </Tooltip>
          </Flex>
          <chakra.span fontWeight="bold">
            {toPriceWrapper(
              metaByCondition[activeRetailerCondition][activeCondition]
                .effectiveCogs
            )}
          </chakra.span>
        </Flex>

        {/* FEES */}
        <Flex justifyContent="space-between">
          <Flex>
            <chakra.span mr={0.5}>Fees</chakra.span>
            <Tooltip
              label={
                <Flex direction="column" fontSize="xs">
                  <Box fontWeight="bold" borderBottom="1px">
                    Amazon Fees
                  </Box>
                  {feesByCondition[activeCondition].feeList
                    .filter((fee) => fee.from === "amazon")
                    .map((fee) => (
                      <Flex
                        key={`${fee.name}${product.id}`}
                        justifyContent="space-between"
                      >
                        <Text>{fee.name}</Text>
                        <Text ml={5}>{toPrice(fee.value * numUnits)}</Text>
                      </Flex>
                    ))}
                  <Box fontWeight="bold" borderBottom="1px" mt={2}>
                    General Fees
                  </Box>
                  {feesByCondition[activeCondition].feeList.filter(
                    (fee) => fee.from === "flipsourcer"
                  ).length
                    ? feesByCondition[activeCondition].feeList
                        .filter((fee) => fee.from === "flipsourcer")
                        .map((fee) => (
                          <Flex
                            key={`${fee.name}${product.id}`}
                            justifyContent="space-between"
                          >
                            <Text>{fee.name}</Text>
                            <Text ml={5}>{toPrice(fee.value * numUnits)}</Text>
                          </Flex>
                        ))
                    : "No general fees"}
                  <Box fontWeight="bold" borderBottom="1px" mt={2}>
                    Custom Fees
                  </Box>
                  <Flex justifyContent="space-between">
                    <Text>Custom Fees</Text>
                    <Text ml={5}>{toPrice(customFees * numUnits)}</Text>
                  </Flex>
                  <Flex borderTop="1px" justifyContent="space-between" mt={2}>
                    <Text fontWeight="bold">Fees total</Text>
                    <Text ml={5}>
                      {toPrice(
                        calculateTotalFees([
                          ...feesByCondition[activeCondition].feeList,
                          {
                            from: "flipsourcer",
                            name: "customFee",
                            value: customFees,
                          },
                        ]) * numUnits
                      )}
                    </Text>
                  </Flex>
                </Flex>
              }
              hasArrow
              placement="top-start"
            >
              <chakra.span my="auto">
                <HiEye cursor="pointer" color="gray" size="16px" />
              </chakra.span>
            </Tooltip>
          </Flex>
          <chakra.span fontWeight="bold">
            {toPrice(
              calculateTotalFees([
                ...feesByCondition[activeCondition].feeList,
                { from: "flipsourcer", name: "customFee", value: customFees },
              ]) * numUnits
            )}
          </chakra.span>
        </Flex>

        {/* PROFIT  & ROI*/}
        <Flex direction={"column"} fontWeight="bold" bg="blue.100">
          <Flex justifyContent="space-between">
            <chakra.span>Profit</chakra.span>
            <chakra.span>
              {toPriceWrapper(
                metaByCondition[activeRetailerCondition][activeCondition]
                  .profit || 0
              )}
            </chakra.span>
          </Flex>
          <Flex justifyContent="space-between">
            <chakra.span>ROI</chakra.span>
            <chakra.span>
              {`${metaByCondition[activeRetailerCondition][
                activeCondition
              ].roi?.toFixed(2)}%` || "unknown"}
            </chakra.span>
          </Flex>
        </Flex>

        {/* FEE SYNC */}
        {feesByCondition[activeCondition].specificToUser ? (
          <ChakraButton
            borderWidth="1px"
            borderColor="green.500"
            color="green.500"
            rounded="md"
            bgColor="green.200"
            _hover={{ bg: "green.200" }}
            disabled={true}
            cursor="not-allowed"
          >
            <BsCheckLg color="green.500" size="24px" />
            Fees synced
          </ChakraButton>
        ) : (
          <Tooltip
            label={
              "By default Flip Sourcer uses Amazon's estimated fees to make filtering fast! You can get your exact fees by clicking this button."
            }
            hasArrow
            placement="top-start"
          >
            <ChakraButton
              borderWidth="1px"
              borderColor="yellow.600"
              color="yellow.600"
              rounded="md"
              bgColor="yellow.200"
              _hover={{ bg: "yellow.100" }}
              onClick={async () => await getFeesBasedOnUser(activeCondition)}
            >
              <MdOutlineSync
                color="yellow.500"
                size="24px"
                style={{ marginTop: -3 }}
              />
              Click to sync fees
              {feesByCondition[activeCondition].loading && (
                <Spinner ml={2} size="sm" color="yellow.500" />
              )}
            </ChakraButton>
          </Tooltip>
        )}
      </Flex>
    </Box>
  );
}
