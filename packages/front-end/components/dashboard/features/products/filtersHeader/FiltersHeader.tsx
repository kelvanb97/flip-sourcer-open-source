import { Box, GridItem, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import Button from "../../../../shared/Button";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import {
  FiltersSortersDiscountsInterface,
  FiltersInterface,
  SortersInterface,
  DiscountsInterface,
} from "../../../../../../types/Filters";
import Filters from "./Filters";
import Sorters from "./Sorters";
import { BsFillLightningChargeFill } from "react-icons/bs";
import Discounts from "./Discounts";
import mixpanelAnalytics from "../../../../../utils/analytics/mixpanelAnalytics";
import googleAnalytics from "../../../../../utils/analytics/googleAnalytics";
import { getLocalStorageVar } from "../../../../../utils/localstorage";
import * as z from "zod";
import facebookAnalytics from "../../../../../utils/analytics/facebookAnalytics";

export function getDefaultFilters(): FiltersInterface {
  const defaultFilters: FiltersInterface = {
    enabledMap: {
      profit: true,
      roi: true,
      salesRank: true,
      amazonOnListing: false,
      hasBuyBox: false,
      condition: true,
      numSellersFba: false,
      numSellersFbm: false,
      salesDropsPerMonth: false,
      category: true,
      keywords: false,
      excludedKeywords: false,
      retailerList: false,
      match: true,
    },
    profit: 0,
    roi: 0,
    category: "All",
    condition: "all",
    salesRank: {
      type: "percent",
      flat: 0,
      percent: 10,
    },
    amazonOnListing: false,
    hasBuyBox: true,
    numSellersFba: 10,
    numSellersFbm: 10,
    keywords: [],
    excludedKeywords: [],
    retailerList: [],
    match: {
      type: "all",
      confidence: "high",
    },
  };

  const filters = getLocalStorageVar("filters");
  if (filters) {
    const tmpFilters = JSON.parse(filters);
    const filtersSchema = z
      .object({
        enabledMap: z.object({
          profit: z.boolean(),
          roi: z.boolean(),
          salesRank: z.boolean(),
          amazonOnListing: z.boolean(),
          hasBuyBox: z.boolean(),
          condition: z.boolean(),
          numSellersFba: z.boolean(),
          numSellersFbm: z.boolean(),
          salesDropsPerMonth: z.boolean(),
          category: z.boolean(),
          keywords: z.boolean(),
          excludedKeywords: z.boolean(),
          retailerList: z.boolean(),
          match: z.boolean(),
        }),
        profit: z.number(),
        roi: z.number(),
        category: z.string(),
        condition: z.string(),
        salesRank: z.object({
          type: z.union([z.literal("flat"), z.literal("percent")]),
          flat: z.number(),
          percent: z.number(),
        }),
        amazonOnListing: z.boolean(),
        hasBuyBox: z.boolean(),
        numSellersFba: z.number(),
        numSellersFbm: z.number(),
        keywords: z.array(z.string()),
        excludedKeywords: z.array(z.string()),
        retailerList: z.array(z.string()),
        match: z.object({
          type: z.union([z.literal("all"), z.literal("upc")]),
          confidence: z.union([
            z.literal("low"),
            z.literal("medium"),
            z.literal("high"),
          ]),
        }),
      })
      .strict();

    const zodResult = filtersSchema.safeParse(tmpFilters);
    if (!zodResult.success) {
      return defaultFilters;
    } else {
      return tmpFilters as FiltersInterface;
    }
  }

  return defaultFilters;
}

export function getDefaultSorters(): SortersInterface {
  const defaultSorters: SortersInterface = {
    sortType: "highToLow",
    sorter: "roi",
  };

  const sorters = getLocalStorageVar("sorters");

  if (sorters) {
    const tmpSorters = JSON.parse(sorters);
    const sortersSchema = z
      .object({
        sortType: z.union([z.literal("highToLow"), z.literal("lowToHigh")]),
        sorter: z.union([
          z.literal("roi"),
          z.literal("profit"),
          z.literal("salesRank"),
          z.literal("lastUpdated"),
        ]),
      })
      .strict();

    const zodResult = sortersSchema.safeParse(tmpSorters);
    if (!zodResult.success) {
      return defaultSorters;
    } else {
      return tmpSorters as SortersInterface;
    }
  }

  return defaultSorters;
}

export function getDefaultDiscounts(): DiscountsInterface {
  const defaultDiscounts: DiscountsInterface = {
    enabled: false,
    name: "flat",
    type: "flat",
    flat: 0,
    percent: 0,
  };

  const discounts = getLocalStorageVar("discounts");
  if (discounts) {
    const tmpDiscounts = JSON.parse(discounts);
    const discountsSchema = z
      .object({
        enabled: z.boolean(),
        name: z.union([
          z.literal("flat"),
          z.literal("percent"),
          z.literal("buy 1 get 1 free"),
          z.literal("buy 2 get 1 free"),
          z.literal("buy 1 get 1 half off"),
          z.literal("buy 2 get 1 half off"),
        ]),
        type: z.union([z.literal("flat"), z.literal("percent")]),
        flat: z.number(),
        percent: z.number(),
      })
      .strict();

    const zodResult = discountsSchema.safeParse(tmpDiscounts);
    if (!zodResult.success) {
      return defaultDiscounts;
    } else {
      return tmpDiscounts as DiscountsInterface;
    }
  }

  return defaultDiscounts;
}

interface FiltersHeaderProps {
  filtersSortersDiscounts: FiltersSortersDiscountsInterface;
  handleSetFiltersSortersDiscounts: (
    newFiltersSortersDiscounts: FiltersSortersDiscountsInterface
  ) => void;
}

export default function FiltersHeader({
  filtersSortersDiscounts,
  handleSetFiltersSortersDiscounts,
}: FiltersHeaderProps) {
  const [filters, setFilters] = useState<FiltersInterface>(
    filtersSortersDiscounts.filters
  );
  const [sorters, setSorters] = useState<SortersInterface>(
    filtersSortersDiscounts.sorters
  );
  const [discounts, setDiscounts] = useState<DiscountsInterface>(
    filtersSortersDiscounts.discounts
  );

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortersOpen, setSortersOpen] = useState(false);
  const [discountsOpen, setDiscountsOpen] = useState(false);

  function handleOpenClose(type: "filters" | "sorters" | "discounts") {
    if (type === "filters") {
      setFiltersOpen(!filtersOpen);
      setSortersOpen(false);
      setDiscountsOpen(false);
    } else if (type === "sorters") {
      setFiltersOpen(false);
      setSortersOpen(!sortersOpen);
      setDiscountsOpen(false);
    } else {
      setFiltersOpen(false);
      setSortersOpen(false);
      setDiscountsOpen(!discountsOpen);
    }
  }

  async function handleApplyFilters() {
    const filtersSortersDiscounts: FiltersSortersDiscountsInterface = {
      filters,
      sorters,
      discounts,
    };
    mixpanelAnalytics.trackEvent("Products: Apply Filters", {
      filtersSortersDiscounts,
    });
    googleAnalytics.trackEvent("User", "Products: Apply Filters");
    facebookAnalytics.trackEvent("Products: Apply Filters");
    handleSetFiltersSortersDiscounts(filtersSortersDiscounts);
  }

  return (
    <Box
      className="no_scrollbar"
      position="sticky"
      top="0"
      left="0"
      zIndex={1}
      w="100%"
      bg="gray.800"
      color="white"
      p={3}
    >
      <Box width="max-content">
        <SimpleGrid columns={[2, 2, 4]} rowGap={[2, 2, 0]} columnGap={3}>
          <GridItem>
            <Button
              id="filtersButton"
              flavor="outline"
              color={filtersOpen ? "dodgerblue" : ""}
              icon={filtersOpen ? RiArrowUpSLine : RiArrowDownSLine}
              iconPosition="right"
              w="160px"
              onClick={() => handleOpenClose("filters")}
            >
              Filters
            </Button>
          </GridItem>
          <GridItem>
            <Button
              id="sortByButton"
              flavor="outline"
              color={sortersOpen ? "dodgerblue" : ""}
              icon={sortersOpen ? RiArrowUpSLine : RiArrowDownSLine}
              iconPosition="right"
              w="160px"
              onClick={() => handleOpenClose("sorters")}
            >
              Sort by
            </Button>
          </GridItem>
          <GridItem>
            <Button
              id="discountsButton"
              flavor="outline"
              color={discountsOpen ? "dodgerblue" : ""}
              icon={discountsOpen ? RiArrowUpSLine : RiArrowDownSLine}
              iconPosition="right"
              w="160px"
              onClick={() => handleOpenClose("discounts")}
            >
              Discounts
            </Button>
          </GridItem>
          <GridItem>
            <Button
              id="applyFiltersButton"
              leftIcon={<BsFillLightningChargeFill />}
              onClick={async () => await handleApplyFilters()}
              w="160px"
            >
              Apply
            </Button>
          </GridItem>
        </SimpleGrid>
      </Box>
      {filtersOpen && <Filters filters={filters} setFilters={setFilters} />}
      {sortersOpen && <Sorters sorters={sorters} setSorters={setSorters} />}
      {discountsOpen && (
        <Discounts discounts={discounts} setDiscounts={setDiscounts} />
      )}
    </Box>
  );
}
