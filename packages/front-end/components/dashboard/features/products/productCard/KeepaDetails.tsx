import { Box, Flex, FlexProps, Heading } from "@chakra-ui/react";
import { ProductInterface } from "../../../../../../types/Product";
import { toDisplayNumber, toPrice } from "../../../../../utils/shared";
import Loader from "../../../../shared/Loader";

interface Row {
  label: string;
  value: string;
  valueColor: string;
  hasBorder?: boolean;
}

function Row({ label, value, valueColor, hasBorder = true }: Row) {
  return (
    <Flex
      justifyContent="space-between"
      py={1}
      borderTop={hasBorder ? "1px" : "0px"}
      borderColor="gray.300"
    >
      <Box>{label}</Box>
      <Box color={valueColor}>{value}</Box>
    </Flex>
  );
}

type KeepaDetails = {
  product: ProductInterface;
  keepaDataLoading: boolean;
} & FlexProps;

export default function KeepaDetails({
  product,
  keepaDataLoading,
  ...props
}: KeepaDetails) {
  return (
    <Flex flexDir="column" {...props}>
      <Heading size="md" mb={2}>
        Keepa Details
      </Heading>
      {keepaDataLoading ? (
        <Loader />
      ) : (
        <Flex justifyContent="space-between" columnGap={5}>
          <Flex flexDir="column" fontSize="xs" w="full">
            <Row
              label="Sales Rank - Current"
              value={
                typeof product.amazonInfo.salesRank.flat === "number"
                  ? `# ${toDisplayNumber(product.amazonInfo.salesRank.flat)}`
                  : "?"
              }
              valueColor="#8FBC8F"
              hasBorder={false}
            />
            <Row
              label="Sales Rank - 30 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa.salesRank30DayAvg ===
                "number"
                  ? `# ${toDisplayNumber(
                      product.amazonInfo.infoFromKeepa.salesRank30DayAvg
                    )}`
                  : "?"
              }
              valueColor="#8FBC8F"
            />
            <Row
              label="Sales Rank - 60 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa.salesRank60DayAvg ===
                "number"
                  ? `# ${toDisplayNumber(
                      product.amazonInfo.infoFromKeepa.salesRank60DayAvg
                    )}`
                  : "?"
              }
              valueColor="#8FBC8F"
            />
            <Row
              label="Sales Rank - 90 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa.salesRank90DayAvg ===
                "number"
                  ? `# ${toDisplayNumber(
                      product.amazonInfo.infoFromKeepa.salesRank90DayAvg
                    )}`
                  : "?"
              }
              valueColor="#8FBC8F"
            />
            <Row
              label="Sales Rank - 180 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa.salesRank180DayAvg ===
                "number"
                  ? `# ${toDisplayNumber(
                      product.amazonInfo.infoFromKeepa.salesRank180DayAvg
                    )}`
                  : "?"
              }
              valueColor="#8FBC8F"
            />
            <Row
              label="Sales Rank - Drops last 30 days"
              value={
                typeof product.amazonInfo.infoFromKeepa.salesRankDrops30 ===
                "number"
                  ? toDisplayNumber(
                      product.amazonInfo.infoFromKeepa.salesRankDrops30
                    )
                  : "?"
              }
              valueColor="#8FBC8F"
            />
            <Row
              label="Sales Rank - Drops last 90 days"
              value={
                typeof product.amazonInfo.infoFromKeepa.salesRankDrops90 ===
                "number"
                  ? toDisplayNumber(
                      product.amazonInfo.infoFromKeepa.salesRankDrops90
                    )
                  : "?"
              }
              valueColor="#8FBC8F"
            />
            <Row
              label="Sales Rank - Drops last 180 days"
              value={
                typeof product.amazonInfo.infoFromKeepa.salesRankDrops180 ===
                "number"
                  ? toDisplayNumber(
                      product.amazonInfo.infoFromKeepa.salesRankDrops180
                    )
                  : "?"
              }
              valueColor="#8FBC8F"
            />
            <Row
              label="Buy Box - Current"
              value={
                typeof product.amazonInfo.infoFromKeepa.buyBoxCurrent ===
                "number"
                  ? product.amazonInfo.infoFromKeepa.buyBoxCurrent < 0
                    ? "n/a"
                    : `${toPrice(
                        product.amazonInfo.infoFromKeepa.buyBoxCurrent,
                        true
                      )}`
                  : "?"
              }
              valueColor="#FF00B4"
            />
            <Row
              label="Buy Box - 90 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa.buyBox90DayAvg ===
                "number"
                  ? `${toPrice(
                      product.amazonInfo.infoFromKeepa.buyBox90DayAvg,
                      true
                    )}`
                  : "?"
              }
              valueColor="#FF00B4"
            />
            <Row
              label="Buy Box - 180 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa.buyBox180DayAvg ===
                "number"
                  ? `${toPrice(
                      product.amazonInfo.infoFromKeepa.buyBox180DayAvg,
                      true
                    )}`
                  : "?"
              }
              valueColor="#FF00B4"
            />
            <Row
              label="Buy Box - 90 days OOS"
              value={
                typeof product.amazonInfo.infoFromKeepa.buyBox90DayOos ===
                "number"
                  ? `${toDisplayNumber(
                      Math.ceil(product.amazonInfo.infoFromKeepa.buyBox90DayOos)
                    )} %`
                  : "?"
              }
              valueColor="#FF00B4"
            />
            <Row
              label="Amazon - 90 days OOS"
              value={
                typeof product.amazonInfo.infoFromKeepa.amazon90DayOos ===
                "number"
                  ? `${toDisplayNumber(
                      Math.ceil(product.amazonInfo.infoFromKeepa.amazon90DayOos)
                    )} %`
                  : "?"
              }
              valueColor="orange"
            />
            <Row
              label="New - Current"
              value={
                typeof product.amazonInfo.infoFromKeepa.newCurrent === "number"
                  ? `${toPrice(
                      product.amazonInfo.infoFromKeepa.newCurrent,
                      true
                    )}`
                  : "?"
              }
              valueColor="#8888DD"
            />
            <Row
              label="New - 90 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa.new90DayAvg === "number"
                  ? `${toPrice(
                      product.amazonInfo.infoFromKeepa.new90DayAvg,
                      true
                    )}`
                  : "?"
              }
              valueColor="#8888DD"
            />
            <Row
              label="New - 180 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa.new180DayAvg ===
                "number"
                  ? `${toPrice(
                      product.amazonInfo.infoFromKeepa.new180DayAvg,
                      true
                    )}`
                  : "?"
              }
              valueColor="#8888DD"
            />
            <Row
              label="New - 90 days OOS"
              value={
                typeof product.amazonInfo.infoFromKeepa.new90DayOos === "number"
                  ? `${toDisplayNumber(
                      Math.ceil(product.amazonInfo.infoFromKeepa.new90DayOos)
                    )} %`
                  : "?"
              }
              valueColor="#8888DD"
            />
          </Flex>
          <Flex flexDir="column" fontSize="xs" w="full">
            <Row
              label="New, 3rd Party FBA - Current"
              value={
                typeof product.amazonInfo.infoFromKeepa
                  .new3rdPartyFbaCurrent === "number"
                  ? `${toPrice(
                      product.amazonInfo.infoFromKeepa.new3rdPartyFbaCurrent,
                      true
                    )}`
                  : "?"
              }
              valueColor="#FF5C30"
              hasBorder={false}
            />
            <Row
              label="New, 3rd Party FBA - 90 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa
                  .new3rdPartyFba90DayAvg === "number"
                  ? `${toPrice(
                      product.amazonInfo.infoFromKeepa.new3rdPartyFba90DayAvg,
                      true
                    )}`
                  : "?"
              }
              valueColor="#FF5C30"
            />
            <Row
              label="New, 3rd Party FBA - 180 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa
                  .new3rdPartyFba180DayAvg === "number"
                  ? `${toPrice(
                      product.amazonInfo.infoFromKeepa.new3rdPartyFba180DayAvg,
                      true
                    )}`
                  : "?"
              }
              valueColor="#FF5C30"
            />
            <Row
              label="New, 3rd Party FBM - Current"
              value={
                typeof product.amazonInfo.infoFromKeepa
                  .new3rdPartyFbmCurrent === "number"
                  ? `${toPrice(
                      product.amazonInfo.infoFromKeepa.new3rdPartyFbmCurrent,
                      true
                    )}`
                  : "?"
              }
              valueColor="#0B9DE5"
            />
            <Row
              label="New, 3rd Party FBM - 90 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa
                  .new3rdPartyFbm90DayAvg === "number"
                  ? `${toPrice(
                      product.amazonInfo.infoFromKeepa.new3rdPartyFbm90DayAvg,
                      true
                    )}`
                  : "?"
              }
              valueColor="#0B9DE5"
            />
            <Row
              label="New, 3rd Party FBM - 180 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa
                  .new3rdPartyFbm180DayAvg === "number"
                  ? `${toPrice(
                      product.amazonInfo.infoFromKeepa.new3rdPartyFbm180DayAvg,
                      true
                    )}`
                  : "?"
              }
              valueColor="#0B9DE5"
            />
            <Row
              label="Used - 90 days OOS"
              value={
                typeof product.amazonInfo.infoFromKeepa.used90DayOos ===
                "number"
                  ? `${toDisplayNumber(
                      Math.ceil(product.amazonInfo.infoFromKeepa.used90DayOos)
                    )} %`
                  : "?"
              }
              valueColor="#4C4C4C"
            />
            <Row
              label="New Offer Count - Current"
              value={
                typeof product.amazonInfo.infoFromKeepa.newOfferCount ===
                "number"
                  ? `${toDisplayNumber(
                      product.amazonInfo.infoFromKeepa.newOfferCount
                    )}`
                  : "?"
              }
              valueColor="#8888DD"
            />
            <Row
              label="New Offer Count - 30 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa
                  .newOfferCount30DayAvg === "number"
                  ? `${toDisplayNumber(
                      product.amazonInfo.infoFromKeepa.newOfferCount30DayAvg
                    )}`
                  : "?"
              }
              valueColor="#8888DD"
            />
            <Row
              label="New Offer Count - 90 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa
                  .newOfferCount90DayAvg === "number"
                  ? `${toDisplayNumber(
                      product.amazonInfo.infoFromKeepa.newOfferCount90DayAvg
                    )}`
                  : "?"
              }
              valueColor="#8888DD"
            />
            <Row
              label="New Offer Count - 180 days avg."
              value={
                typeof product.amazonInfo.infoFromKeepa
                  .newOfferCount180DayAvg === "number"
                  ? `${toDisplayNumber(
                      product.amazonInfo.infoFromKeepa.newOfferCount180DayAvg
                    )}`
                  : "?"
              }
              valueColor="#8888DD"
            />
            <Row
              label="Count of retrieved live offers - New, FBA"
              value={
                typeof product.amazonInfo.infoFromKeepa
                  .countOfRetrievedLiveOffersFba === "number"
                  ? `${toDisplayNumber(
                      product.amazonInfo.infoFromKeepa
                        .countOfRetrievedLiveOffersFba
                    )}`
                  : "?"
              }
              valueColor="#FF5C30"
            />
            <Row
              label="Count of retrieved live offers - New, FBM"
              value={
                typeof product.amazonInfo.infoFromKeepa
                  .countOfRetrievedLiveOffersFbm === "number"
                  ? `${toDisplayNumber(
                      product.amazonInfo.infoFromKeepa
                        .countOfRetrievedLiveOffersFbm
                    )}`
                  : "?"
              }
              valueColor="#0B9DE5"
            />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
