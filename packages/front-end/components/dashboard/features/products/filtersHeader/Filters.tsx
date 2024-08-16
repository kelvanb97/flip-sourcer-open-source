import {
  Badge,
  Box,
  chakra,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  Tooltip,
} from "@chakra-ui/react";
import Card from "../../../../shared/Card";
import { InputField } from "../../../../shared/Fields";
import {
  categories,
  conditionMap,
  conditions,
} from "../../../../../utils/constants";
import ConditionBadge from "../../../../shared/ConditionBadge";
import { MdInfoOutline } from "react-icons/md";
import { FiltersInterface } from "../../../../../../types/Filters";
import { Category } from "../../../../../../types/Product";
import { toDisplayNumber } from "../../../../../utils/shared";
import { useState } from "react";
import RetailersModal from "./RetailersModal";
import { MIN_LEADING_ROI } from "../../../../../../back-end/shared/constants";

interface FiltersProps {
  filters: FiltersInterface;
  setFilters: (filters: FiltersInterface) => void;
}

export default function Filters({ filters, setFilters }: FiltersProps) {
  const [retailersModalOpen, setRetailersModalOpen] = useState(false);
  const closeRetailersModal = () => setRetailersModalOpen(false);

  const [keywordsStr, setkeywordsStr] = useState(filters.keywords.join(","));
  const [excludedKeywordsStr, setExcludedKeywordsStr] = useState(
    filters.excludedKeywords.join(",")
  );

  function handleEnabledMapChange(key: keyof FiltersInterface["enabledMap"]) {
    setFilters({
      ...filters,
      enabledMap: { ...filters.enabledMap, [key]: !filters.enabledMap[key] },
    });
  }

  return (
    <>
      {retailersModalOpen && (
        <RetailersModal
          filters={filters}
          setFilters={setFilters}
          close={closeRetailersModal}
        />
      )}
      <Card
        id="filtersDiv"
        display="flex"
        p={3}
        mt={3}
        color="black"
        fontSize="sm"
        overflowX="scroll"
      >
        {/* BULK FILTERS */}
        <Flex
          flexDir="column"
          rowGap={5}
          minW="350px"
          maxW="350px"
          pr={5}
          borderRightWidth="1px"
          borderRightColor="gray.300"
        >
          <Heading size="md">Bulk Filters</Heading>
          <Flex
            id="retailersFilterContainer"
            columnGap={5}
            pb={5}
            borderBottom="1px"
            borderColor="gray.300"
          >
            <Box id="retailerFilterSwitchContainer" my="auto">
              <Switch
                id="retailerFilterSwitch"
                my="auto"
                size="sm"
                isChecked={filters.enabledMap.retailerList}
                onChange={() => handleEnabledMapChange("retailerList")}
              />
            </Box>
            {filters.enabledMap.retailerList ? (
              <Box w="100%">
                <Box>Enabled Retailers</Box>
                <Box
                  id="editEnabledRetailersButton"
                  color="dodgerblue"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={() => setRetailersModalOpen(!retailersModalOpen)}
                >
                  <chakra.span id="editEnabledRetailersButtonText">
                    edit enabled retailers
                  </chakra.span>
                </Box>
              </Box>
            ) : (
              <Box color="gray.500">Filter by Retailer Disabled</Box>
            )}
          </Flex>
          <Flex columnGap={5}>
            <Switch
              id="matchTypeSwitch"
              my="auto"
              size="sm"
              isChecked={filters.enabledMap.match}
              onChange={() => handleEnabledMapChange("match")}
            />
            {filters.enabledMap.match ? (
              <Box w="100%">
                <Box>Match Type</Box>
                <RadioGroup
                  value={filters.match.type}
                  display="flex"
                  columnGap={3}
                  my={2}
                >
                  <Radio
                    value={"all"}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        match: { ...filters.match, type: "all" },
                      })
                    }
                    checked={"all" === filters.match.type}
                  >
                    <Badge
                      color={"pink.500"}
                      bg={"pink.200"}
                      borderWidth="1px"
                      borderColor={"pink.500"}
                      cursor="default"
                    >
                      All
                    </Badge>
                  </Radio>
                  <Radio
                    value={"upc"}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        match: { ...filters.match, type: "upc" },
                      })
                    }
                    checked={"upc" === filters.match.type}
                  >
                    <Badge
                      color={"pink.500"}
                      bg={"pink.200"}
                      borderWidth="1px"
                      borderColor={"pink.500"}
                      cursor="default"
                    >
                      UPC
                    </Badge>
                  </Radio>
                </RadioGroup>
                {filters.match.type === "all" && (
                  <Box>
                    <Box>Match Confidence</Box>
                    <RadioGroup
                      value={filters.match.confidence}
                      display="flex"
                      columnGap={3}
                      my={2}
                    >
                      <Radio
                        value={"low"}
                        onChange={() =>
                          setFilters({
                            ...filters,
                            match: { ...filters.match, confidence: "low" },
                          })
                        }
                        checked={"low" === filters.match.confidence}
                      >
                        <Badge
                          color={"red.500"}
                          bg={"red.200"}
                          borderWidth="1px"
                          borderColor={"red.500"}
                          cursor="default"
                        >
                          Low
                        </Badge>
                      </Radio>
                      <Radio
                        value={"medium"}
                        onChange={() =>
                          setFilters({
                            ...filters,
                            match: { ...filters.match, confidence: "medium" },
                          })
                        }
                        checked={"medium" === filters.match.confidence}
                      >
                        <Badge
                          color={"yellow.500"}
                          bg={"yellow.200"}
                          borderWidth="1px"
                          borderColor={"yellow.500"}
                          cursor="default"
                        >
                          Medium
                        </Badge>
                      </Radio>
                      <Radio
                        value={"high"}
                        onChange={() =>
                          setFilters({
                            ...filters,
                            match: { ...filters.match, confidence: "high" },
                          })
                        }
                        checked={"high" === filters.match.confidence}
                      >
                        <Badge
                          color={"green.500"}
                          bg={"green.200"}
                          borderWidth="1px"
                          borderColor={"green.500"}
                          cursor="default"
                        >
                          High
                        </Badge>
                      </Radio>
                    </RadioGroup>
                  </Box>
                )}
              </Box>
            ) : (
              <Box color="gray.500">Match Type Filter Disabled</Box>
            )}
          </Flex>
        </Flex>

        {/* KEY FILTERS */}
        <Flex
          flexDir="column"
          rowGap={5}
          minW="350px"
          maxW="350px"
          px={5}
          borderRightWidth="1px"
          borderRightColor="gray.300"
        >
          <Heading size="md">Key Filters</Heading>
          {/* PROFIT FILTER */}
          <Flex columnGap={5} pb={5} borderBottom="1px" borderColor="gray.300">
            <Switch
              my="auto"
              size="sm"
              isChecked={filters.enabledMap.profit}
              onChange={() => handleEnabledMapChange("profit")}
            />
            {filters.enabledMap.profit ? (
              <Box w="100%">
                <Box>
                  Profit{" "}
                  {filters.profit < 0
                    ? `-$${Math.abs(filters.profit)}`
                    : `$${filters.profit}`}
                  +
                </Box>
                <Slider
                  aria-label="profit-slider"
                  min={-50}
                  value={filters.profit}
                  onChange={(profit) => setFilters({ ...filters, profit })}
                >
                  <SliderTrack boxSize={1} bg="gray.400">
                    <SliderFilledTrack
                      bg={filters.profit < 0 ? "red.300" : "blue.300"}
                    />
                  </SliderTrack>
                  <SliderThumb
                    bg={filters.profit < 0 ? "red.300" : "blue.300"}
                    borderWidth={"2px"}
                    borderColor={filters.profit < 0 ? "red.600" : "dodgerblue"}
                  />
                </Slider>
              </Box>
            ) : (
              <Box color="gray.500">Profit Filter Disabled</Box>
            )}
          </Flex>
          {/* ROI FILTER */}
          <Flex columnGap={5} pb={5} borderBottom="1px" borderColor="gray.300">
            <Switch
              my="auto"
              size="sm"
              isChecked={filters.enabledMap.roi}
              onChange={() => handleEnabledMapChange("roi")}
            />
            {filters.enabledMap.roi ? (
              <Box w="100%">
                <Box>ROI {filters.roi}%+</Box>
                <Slider
                  aria-label="roi-slider"
                  min={MIN_LEADING_ROI}
                  value={filters.roi}
                  onChange={(roi) => setFilters({ ...filters, roi })}
                >
                  <SliderTrack boxSize={1} bg="gray.400">
                    <SliderFilledTrack
                      bg={filters.roi < 0 ? "red.300" : "blue.300"}
                    />
                  </SliderTrack>
                  <SliderThumb
                    bg={filters.roi < 0 ? "red.300" : "blue.300"}
                    borderWidth={"2px"}
                    borderColor={filters.roi < 0 ? "red.600" : "dodgerblue"}
                  />
                </Slider>
              </Box>
            ) : (
              <Box color="gray.500">ROI Filter Disabled</Box>
            )}
          </Flex>
          {/* SALES RANK FILTER */}
          <Flex columnGap={5} pb={5} borderBottom="1px" borderColor="gray.300">
            <Switch
              my="auto"
              size="sm"
              isChecked={filters.enabledMap.salesRank}
              onChange={() => handleEnabledMapChange("salesRank")}
            />
            {filters.enabledMap.salesRank ? (
              <Box w="100%">
                <Flex>
                  <Tooltip
                    label={
                      <Box>
                        <Box>
                          Percent - Sales rank is less than X% of the category
                          (recommended)
                        </Box>
                        <Box>Flat - Sales rank is less than X</Box>
                      </Box>
                    }
                    hasArrow
                    placement="top-start"
                    shadow={"dark-lg"}
                  >
                    <chakra.span>
                      <MdInfoOutline
                        cursor="pointer"
                        color="dodgerblue"
                        size="18px"
                      />
                    </chakra.span>
                  </Tooltip>
                  <chakra.span>Sales Rank Type</chakra.span>
                </Flex>
                <RadioGroup
                  value={filters.salesRank.type}
                  display="flex"
                  columnGap={3}
                  my={2}
                >
                  <Radio
                    value={"percent"}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        salesRank: { ...filters.salesRank, type: "percent" },
                      })
                    }
                    checked={"percent" === filters.salesRank.type}
                  >
                    <Badge
                      color={"pink.500"}
                      bg={"pink.200"}
                      borderWidth="1px"
                      borderColor={"pink.500"}
                      cursor="default"
                    >
                      Percent
                    </Badge>
                  </Radio>
                  <Radio
                    value={"flat"}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        salesRank: { ...filters.salesRank, type: "flat" },
                      })
                    }
                    checked={"flat" === filters.salesRank.type}
                  >
                    <Badge
                      color={"pink.500"}
                      bg={"pink.200"}
                      borderWidth="1px"
                      borderColor={"pink.500"}
                      cursor="default"
                    >
                      Flat
                    </Badge>
                  </Radio>
                </RadioGroup>
                {filters.salesRank.type === "percent" ? (
                  <Box>
                    <Box>{`Sales Rank < ${filters.salesRank.percent}%`}</Box>
                    <Slider
                      aria-label="sales-rank-slider"
                      min={0.1}
                      value={filters.salesRank.percent}
                      onChange={(percent) =>
                        setFilters({
                          ...filters,
                          salesRank: { ...filters.salesRank, percent },
                        })
                      }
                    >
                      <SliderTrack boxSize={1} bg="gray.400">
                        <SliderFilledTrack bg="blue.300" />
                      </SliderTrack>
                      <SliderThumb
                        bg="blue.300"
                        borderWidth={"2px"}
                        borderColor="dodgerblue"
                      />
                    </Slider>
                  </Box>
                ) : (
                  <InputField
                    type="number"
                    label={`Sales Rank < ${toDisplayNumber(
                      filters.salesRank.flat
                    )}`}
                    value={filters.salesRank.flat.toString()}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        salesRank: {
                          ...filters.salesRank,
                          flat: parseInt(e.target.value),
                        },
                      })
                    }
                    labelFontSize="sm"
                    size="sm"
                    rounded="md"
                  />
                )}
              </Box>
            ) : (
              <Box color="gray.500">Sales Rank Filter Disabled</Box>
            )}
          </Flex>
          {/* AMAZON ON LISTING FILTER */}
          <Flex columnGap={5} pb={5} borderBottom="1px" borderColor="gray.300">
            <Switch
              my="auto"
              size="sm"
              isChecked={filters.enabledMap.amazonOnListing}
              onChange={() => handleEnabledMapChange("amazonOnListing")}
            />
            {filters.enabledMap.amazonOnListing ? (
              <Box w="100%">
                <Box>Amazon On Listing</Box>
                <RadioGroup
                  value={filters.amazonOnListing ? "yes" : "no"}
                  display="flex"
                  columnGap={3}
                  my={2}
                >
                  <Radio
                    value={"yes"}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        amazonOnListing: true,
                      })
                    }
                    checked={filters.amazonOnListing}
                  >
                    Yes
                  </Radio>
                  <Radio
                    value={"no"}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        amazonOnListing: false,
                      })
                    }
                    checked={filters.amazonOnListing}
                  >
                    No
                  </Radio>
                </RadioGroup>
              </Box>
            ) : (
              <Box color="gray.500">Amazon On Listing Filter Disabled</Box>
            )}
          </Flex>
          {/* HAS BUY BOX FILTER */}
          <Flex columnGap={5} pb={5}>
            <Switch
              my="auto"
              size="sm"
              isChecked={filters.enabledMap.hasBuyBox}
              onChange={() => handleEnabledMapChange("hasBuyBox")}
            />
            {filters.enabledMap.hasBuyBox ? (
              <Box w="100%">
                <Box>Listing Has A Buy Box</Box>
                <RadioGroup
                  value={filters.hasBuyBox ? "yes" : "no"}
                  display="flex"
                  columnGap={3}
                  my={2}
                >
                  <Radio
                    value={"yes"}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        hasBuyBox: true,
                      })
                    }
                    checked={filters.hasBuyBox}
                  >
                    Yes
                  </Radio>
                  <Radio
                    value={"no"}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        hasBuyBox: false,
                      })
                    }
                    checked={filters.hasBuyBox}
                  >
                    No
                  </Radio>
                </RadioGroup>
              </Box>
            ) : (
              <Box color="gray.500">Buy Box Filter Disabled</Box>
            )}
          </Flex>
        </Flex>

        {/* ADVANCED FILTERS */}
        <Flex
          flexDir="column"
          rowGap={5}
          minW="350px"
          px={5}
          borderRightWidth="1px"
          borderRightColor="gray.300"
        >
          <Heading size="md">Advanced Filters</Heading>
          {/* CATEGORY FILTER */}
          <Flex columnGap={5} pb={5} borderBottom="1px" borderColor="gray.300">
            <Switch
              my="auto"
              size="sm"
              isChecked={filters.enabledMap.category}
              onChange={() => handleEnabledMapChange("category")}
            />
            {filters.enabledMap.category ? (
              <Box w="100%">
                <Box>Category</Box>
                <Select
                  size="sm"
                  rounded="md"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      category: e.target.value as "All" | Category,
                    })
                  }
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </Box>
            ) : (
              <Box color="gray.500">Category Filter Disabled</Box>
            )}
          </Flex>
          {/* CONDITION FILTER */}
          <Flex columnGap={5} pb={5} borderBottom="1px" borderColor="gray.300">
            <Switch
              my="auto"
              size="sm"
              isChecked={filters.enabledMap.condition}
              onChange={() => handleEnabledMapChange("condition")}
            />
            {filters.enabledMap.condition ? (
              <Box w="100%">
                <Box>Condition</Box>
                <RadioGroup
                  value={filters.condition}
                  display="flex"
                  flexWrap="wrap"
                  columnGap={3}
                  rowGap={1}
                  my={2}
                >
                  <Radio
                    value={"all"}
                    onChange={() =>
                      setFilters({ ...filters, condition: "all" })
                    }
                    checked={"all" === filters.condition}
                  >
                    <Tooltip
                      label={"All - All conditions"}
                      hasArrow
                      placement="top-start"
                    >
                      <Badge
                        color={"pink.500"}
                        bg={"pink.200"}
                        borderWidth="1px"
                        borderColor={"pink.500"}
                        cursor="default"
                      >
                        All
                      </Badge>
                    </Tooltip>
                  </Radio>
                  {conditions.map((condition, index) => (
                    <Radio
                      key={`filtersCondition${index}`}
                      value={condition}
                      onChange={() => setFilters({ ...filters, condition })}
                      checked={condition === filters.condition}
                    >
                      <ConditionBadge
                        condition={condition}
                        body={conditionMap[condition].short}
                        tooltip={conditionMap[condition].long}
                      />
                    </Radio>
                  ))}
                </RadioGroup>
              </Box>
            ) : (
              <Box color="gray.500">Condition Filter Disabled</Box>
            )}
          </Flex>
          {/* NUM SELLERS FBA */}
          <Flex columnGap={5} pb={5} borderBottom="1px" borderColor="gray.300">
            <Switch
              my="auto"
              size="sm"
              isChecked={filters.enabledMap.numSellersFba}
              onChange={() => handleEnabledMapChange("numSellersFba")}
            />
            {filters.enabledMap.numSellersFba ? (
              <Box w="100%">
                <Box>{`FBA Sellers < ${filters.numSellersFba}`}</Box>
                <Slider
                  aria-label="num-fba-sellers-slider"
                  min={1}
                  value={filters.numSellersFba}
                  onChange={(numSellersFba) =>
                    setFilters({ ...filters, numSellersFba })
                  }
                >
                  <SliderTrack boxSize={1} bg="gray.400">
                    <SliderFilledTrack bg="blue.300" />
                  </SliderTrack>
                  <SliderThumb
                    bg="blue.300"
                    borderWidth={"2px"}
                    borderColor="dodgerblue"
                  />
                </Slider>
              </Box>
            ) : (
              <Box color="gray.500">FBA Sellers Filter Disabled</Box>
            )}
          </Flex>
          {/* NUM SELLERS FBM */}
          <Flex columnGap={5} pb={5}>
            <Switch
              my="auto"
              size="sm"
              isChecked={filters.enabledMap.numSellersFbm}
              onChange={() => handleEnabledMapChange("numSellersFbm")}
            />
            {filters.enabledMap.numSellersFbm ? (
              <Box w="100%">
                <Box>{`FBM Sellers < ${filters.numSellersFbm}`}</Box>
                <Slider
                  aria-label="num-fbm-sellers-slider"
                  min={1}
                  value={filters.numSellersFbm}
                  onChange={(numSellersFbm) =>
                    setFilters({ ...filters, numSellersFbm })
                  }
                >
                  <SliderTrack boxSize={1} bg="gray.400">
                    <SliderFilledTrack bg="blue.300" />
                  </SliderTrack>
                  <SliderThumb
                    bg="blue.300"
                    borderWidth={"2px"}
                    borderColor="dodgerblue"
                  />
                </Slider>
              </Box>
            ) : (
              <Box color="gray.500">FBM Sellers Filter Disabled</Box>
            )}
          </Flex>
        </Flex>
        <Flex flexDir="column" rowGap={5} px={5} minW="350px">
          <Heading size="md">Keyword Filters</Heading>
          <Flex columnGap={5} pb={5} borderBottom="1px" borderColor="gray.300">
            <Switch
              my="auto"
              size="sm"
              isChecked={filters.enabledMap.keywords}
              onChange={() => handleEnabledMapChange("keywords")}
            />
            {filters.enabledMap.keywords ? (
              <Box w="100%">
                <InputField
                  type="text"
                  label="Included Keywords"
                  labelSub="comma separated list: keyword1, keyword2, keyword3"
                  value={keywordsStr}
                  onChange={(e) => {
                    setkeywordsStr(e.target.value);
                    setFilters({
                      ...filters,
                      keywords: e.target.value
                        .split(",")
                        .map((x) => x.trim())
                        .filter((x) => x !== ""),
                    });
                  }}
                  labelFontSize="sm"
                  size="sm"
                  rounded="md"
                />
              </Box>
            ) : (
              <Box color="gray.500">Included Keywords Filter Disabled</Box>
            )}
          </Flex>
          <Flex columnGap={5} pb={5}>
            <Switch
              my="auto"
              size="sm"
              isChecked={filters.enabledMap.excludedKeywords}
              onChange={() => handleEnabledMapChange("excludedKeywords")}
            />
            {filters.enabledMap.excludedKeywords ? (
              <Box w="100%">
                <InputField
                  type="text"
                  label="Excluded Keywords"
                  labelSub="comma separated list: keyword1, keyword2, keyword3"
                  value={excludedKeywordsStr}
                  onChange={(e) => {
                    setExcludedKeywordsStr(e.target.value);
                    setFilters({
                      ...filters,
                      excludedKeywords: e.target.value
                        .split(",")
                        .map((x) => x.trim())
                        .filter((x) => x !== ""),
                    });
                  }}
                  labelFontSize="sm"
                  size="sm"
                  rounded="md"
                />
              </Box>
            ) : (
              <Box color="gray.500">Excluded Keywords Filter Disabled</Box>
            )}
          </Flex>
        </Flex>
      </Card>
    </>
  );
}
