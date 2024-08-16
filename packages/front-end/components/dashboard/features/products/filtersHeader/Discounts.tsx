import {
  Badge,
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Radio,
  RadioGroup,
  Switch,
  chakra,
  useToast,
} from "@chakra-ui/react";
import { DiscountsInterface } from "../../../../../../types/Filters";
import Card from "../../../../shared/Card";

interface DiscountsProps {
  discounts: DiscountsInterface;
  setDiscounts: (discounts: DiscountsInterface) => void;
}

export default function Discountss({
  discounts,
  setDiscounts,
}: DiscountsProps) {
  const toast = useToast();

  return (
    <Card
      id="discounts-div"
      display="flex"
      p={3}
      mt={3}
      color="black"
      fontSize="sm"
      maxW="400px"
    >
      <Flex flexDir="column" rowGap={5} minW="350px" maxW="350px" pr={5}>
        <Heading size="md">Discounts</Heading>
        <Flex>
          <Box id="discounts-enabled-switch-container" my="auto">
            <Switch
              id="discounts-enabled-switch"
              isChecked={discounts.enabled}
              onChange={() =>
                setDiscounts({
                  ...discounts,
                  enabled: !discounts.enabled,
                })
              }
            />
          </Box>
          <Box ml={3}>
            {discounts.enabled ? (
              <Badge color={"green.500"} bg={"green.200"}>
                enabled
              </Badge>
            ) : (
              <Badge color={"red.500"} bg={"red.200"}>
                disabled
              </Badge>
            )}
          </Box>
        </Flex>
        {discounts.enabled && (
          <>
            <RadioGroup
              value={discounts.name}
              display="flex"
              flexDirection="column"
              flexWrap="wrap"
              columnGap={3}
              my={2}
            >
              <Box>Custom</Box>
              <Radio
                value={"flat"}
                onChange={() =>
                  setDiscounts({
                    ...discounts,
                    name: "flat",
                    type: "flat",
                  })
                }
                checked={"flat" === discounts.name}
              >
                Flat
              </Radio>
              <Radio
                value={"percent"}
                onChange={() =>
                  setDiscounts({
                    ...discounts,
                    name: "percent",
                    type: "percent",
                  })
                }
                checked={"percent" === discounts.name}
              >
                Percent
              </Radio>
              <Box mt={2}>presets</Box>
              <chakra.span id="discounts-buy-1-get-1-free-radio-container">
                <Radio
                  id="discounts-buy-1-get-1-free-radio"
                  value={"buy 1 get 1 free"}
                  onChange={() =>
                    setDiscounts({
                      ...discounts,
                      name: "buy 1 get 1 free",
                      type: "percent",
                      percent: 50,
                    })
                  }
                  checked={"buy 1 get 1 free" === discounts.name}
                >
                  Buy 1 get 1 free
                </Radio>
              </chakra.span>
              <Radio
                value={"buy 2 get 1 free"}
                onChange={() =>
                  setDiscounts({
                    ...discounts,
                    name: "buy 2 get 1 free",
                    type: "percent",
                    percent: 33.33,
                  })
                }
                checked={"buy 2 get 1 free" === discounts.name}
              >
                Buy 2 get 1 free
              </Radio>
              <Radio
                value={"buy 1 get 1 half off"}
                onChange={() =>
                  setDiscounts({
                    ...discounts,
                    name: "buy 1 get 1 half off",
                    type: "percent",
                    percent: 25,
                  })
                }
                checked={"buy 1 get 1 half off" === discounts.name}
              >
                Buy 1 get 1 half off
              </Radio>
              <Radio
                value={"buy 2 get 1 half off"}
                onChange={() =>
                  setDiscounts({
                    ...discounts,
                    name: "buy 2 get 1 half off",
                    type: "percent",
                    percent: 16.66,
                  })
                }
                checked={"buy 2 get 1 half off" === discounts.name}
              >
                Buy 2 get 1 half off
              </Radio>
            </RadioGroup>
            <Flex>
              {discounts.name === "flat" && (
                <Box>
                  flat:
                  <InputGroup>
                    <InputLeftAddon>$</InputLeftAddon>
                    <Input
                      type="number"
                      value={discounts.flat}
                      onChange={(e) => {
                        let newVal = parseFloat(e.target.value);
                        if (newVal < 0) {
                          toast({
                            title: "Flat discounts cannot be negative",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                          });
                          newVal *= -1;
                        }
                        setDiscounts({ ...discounts, flat: newVal });
                      }}
                      onBlur={() => {
                        if (isNaN(discounts.flat)) {
                          setDiscounts({ ...discounts, flat: 0 });
                        }
                      }}
                    />
                  </InputGroup>
                </Box>
              )}
              {discounts.name === "percent" && (
                <Box>
                  percent:
                  <InputGroup>
                    <Input
                      type="number"
                      value={discounts.percent}
                      onChange={(e) => {
                        let newVal = parseFloat(e.target.value);
                        if (newVal < 0) {
                          toast({
                            title: "Percent discounts cannot be negative",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                          });
                          newVal *= -1;
                        }
                        if (newVal > 100) {
                          toast({
                            title:
                              "Percent discounts cannot be greater than 100",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                          });
                          newVal = 100;
                        }
                        setDiscounts({ ...discounts, percent: newVal });
                      }}
                      onBlur={() => {
                        if (isNaN(discounts.percent)) {
                          setDiscounts({ ...discounts, percent: 0 });
                        }
                      }}
                    />
                    <InputRightAddon>%</InputRightAddon>
                  </InputGroup>
                </Box>
              )}
            </Flex>
            {discounts.name !== "flat" && (
              <Box color="gray.600">
                *Effective discount: {discounts.percent}% off
              </Box>
            )}
            {discounts.name === "flat" && (
              <Box color="gray.600">
                *Effective discount: ${discounts.flat} off
              </Box>
            )}
          </>
        )}
      </Flex>
    </Card>
  );
}
