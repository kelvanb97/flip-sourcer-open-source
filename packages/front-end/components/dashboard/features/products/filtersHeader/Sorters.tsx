import { Box, Flex, Radio, RadioGroup, chakra } from "@chakra-ui/react";
import { SortersInterface } from "../../../../../../types/Filters";
import Card from "../../../../shared/Card";

interface SortersProps {
  sorters: SortersInterface;
  setSorters: (sorters: SortersInterface) => void;
}

export default function Sorters({ sorters, setSorters }: SortersProps) {
  return (
    <Card
      id="sortersDiv"
      display="flex"
      p={3}
      mt={3}
      color="black"
      fontSize="sm"
      maxW="450px"
    >
      <Flex flexDir="column" rowGap={5} pr={5}>
        <Box>
          <Box>Sort by</Box>
          <RadioGroup
            value={sorters.sorter.toString()}
            display="flex"
            flexWrap="wrap"
            columnGap={3}
            rowGap={1}
            my={2}
          >
            <Radio
              value={"profit"}
              onChange={() =>
                setSorters({
                  ...sorters,
                  sorter: "profit",
                })
              }
              checked={sorters.sorter === "profit"}
            >
              Profit
            </Radio>
            <Radio
              value={"roi"}
              onChange={() =>
                setSorters({
                  ...sorters,
                  sorter: "roi",
                })
              }
              checked={sorters.sorter === "roi"}
            >
              ROI
            </Radio>
            <chakra.span id="sort-by-sales-rank-container">
              <Radio
                id="sort-by-sales-rank"
                value={"salesRank"}
                onChange={() =>
                  setSorters({
                    ...sorters,
                    sorter: "salesRank",
                  })
                }
                checked={sorters.sorter === "salesRank"}
              >
                Sales Rank
              </Radio>
            </chakra.span>
            <Radio
              value={"lastUpdated"}
              onChange={() =>
                setSorters({
                  ...sorters,
                  sorter: "lastUpdated",
                })
              }
              checked={sorters.sorter === "lastUpdated"}
            >
              Last Updated
            </Radio>
          </RadioGroup>
        </Box>
        <Box>
          <Box>Order by</Box>
          <RadioGroup
            value={sorters.sortType.toString()}
            display="flex"
            columnGap={3}
            my={2}
          >
            <chakra.span id="order-by-low-to-high-container">
              <Radio
                id="order-by-low-to-high"
                value={"lowToHigh"}
                onChange={() =>
                  setSorters({
                    ...sorters,
                    sortType: "lowToHigh",
                  })
                }
                checked={sorters.sortType === "lowToHigh"}
              >
                Low to High
              </Radio>
            </chakra.span>
            <Radio
              value={"highToLow"}
              onChange={() =>
                setSorters({
                  ...sorters,
                  sortType: "highToLow",
                })
              }
              checked={sorters.sortType === "highToLow"}
            >
              High to Low
            </Radio>
          </RadioGroup>
        </Box>
      </Flex>
    </Card>
  );
}
