import { Box, Flex, Select } from "@chakra-ui/react";
import {
  getLocalStorageVar,
  setLocalStorageVar,
} from "../../utils/localstorage";
import Button from "./Button";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Card from "./Card";

//gets the amount of products to display on a page
export function getDefaultPageSize(): number {
  const pageSize = getLocalStorageVar("pageSize");
  if (pageSize) {
    const pageSizeNum = parseInt(pageSize);
    if (pageSizeNum > 25) return 25;
    return pageSizeNum;
  }
  return 10;
}

interface PaginationProps {
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  page: number;
  setPage: (page: number) => void;
  hasNextPage: boolean;
  numResults: number;
}

export default function Pagination({
  pageSize,
  setPageSize,
  page,
  setPage,
  hasNextPage,
  numResults,
}: PaginationProps) {
  return (
    <Box px={3} pb={3}>
      <Card display="flex" justifyContent="space-between">
        <Flex my="auto">
          <Select
            size="sm"
            rounded="md"
            onChange={(e) => {
              setLocalStorageVar("pageSize", e.target.value);
              setPageSize(parseInt(e.target.value));
            }}
            value={pageSize}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
          </Select>
        </Flex>
        <Flex>
          <Button
            bg="white"
            color={page === 0 ? "gray.400" : "black"}
            shadow="none"
            my="auto"
            borderColor="gray.300"
            borderWidth="1px"
            px={3}
            py={1}
            rounded="md"
            cursor={page === 0 ? "not-allowed" : "pointer"}
            maxH="28px"
            _hover={{ bg: "gray.300" }}
            onClick={() => {
              if (page === 0) return;
              setPage(page - 1);
            }}
          >
            <AiOutlineLeft size="18px" />
          </Button>
          <Box textAlign="center" px={5}>
            <Box color="gray.700" fontSize="sm">
              page: {page + 1}
            </Box>
            <Box color="gray.600" fontSize="xs">
              {page * pageSize + 1}
              {` - `}
              {!hasNextPage ? numResults : page * pageSize + pageSize}
            </Box>
            <Box color="gray.600" fontSize="xs">
              of {numResults} results
            </Box>
          </Box>
          <Button
            bg="white"
            color={!hasNextPage ? "gray.400" : "black"}
            shadow="none"
            my="auto"
            borderColor="gray.300"
            borderWidth="1px"
            px={3}
            py={1}
            rounded="md"
            cursor={!hasNextPage ? "not-allowed" : "pointer"}
            maxH="28px"
            _hover={{ bg: "gray.300" }}
            onClick={() => {
              if (!hasNextPage) return;
              setPage(page + 1);
            }}
          >
            <AiOutlineRight size="18px" />
          </Button>
        </Flex>
        {/* Probably a better way to do this but this is to get the pagination section to the middle */}
        <Flex />
      </Card>
    </Box>
  );
}
