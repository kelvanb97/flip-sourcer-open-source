import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import { retailerLogoMap, retailerMap } from "../../utils/constants";
import Button from "../shared/Button";
import Link from "next/link";
import { brandDarkBlue } from "../../theme";

const retailerMapLength = Object.entries(retailerMap).length;

interface SupportedSitesProps {
  limitResults?: boolean;
}

export default function SupportedSites({
  limitResults = false,
}: SupportedSitesProps) {
  return (
    <Box mx="auto">
      <Box textAlign="center">
        <Heading fontSize={["5xl", "5xl", "6xl", "7xl"]}>
          Supported Sites
        </Heading>
        <Box mt={8} mx="auto" maxW={"2xl"} fontSize={["md", "md", "lg", "xl"]}>
          Source leads from your favorite sites at the same time. No more
          waiting for leads to come in from one retailer at a time.
        </Box>
        <Box
          mt={5}
          mx="auto"
          textAlign="center"
          color="gray.400"
          fontWeight={"bold"}
        >
          New sites are added every week
        </Box>
      </Box>
      <SimpleGrid
        mt={5}
        columns={[2, 3, 4, 5, 5]}
        rowGap={5}
        columnGap={12}
        className={limitResults ? "fade-out-div" : ""}
        position={"relative"}
      >
        {Object.entries(retailerMap)
          .slice(0, limitResults ? 15 : retailerMapLength)
          .map(([key, value]) => {
            return (
              <Box
                key={key}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="white"
                rounded="md"
                borderColor="gray.200"
                borderWidth="1px"
              >
                <img
                  src={retailerLogoMap[key as keyof typeof retailerLogoMap]}
                  alt={value}
                  width="180px"
                  height="65px"
                />
              </Box>
            );
          })}
      </SimpleGrid>
      {limitResults && (
        <Box mx="auto" textAlign="center" mt={12}>
          <Link href="/sites">
            <Button size="lg" rounded="full" bg={brandDarkBlue}>
              View all sites
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
}
