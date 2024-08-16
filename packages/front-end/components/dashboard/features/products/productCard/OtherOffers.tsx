import {
  Badge,
  chakra,
  Heading,
  Table,
  TableContainer,
  TableContainerProps,
  Tbody,
  Td,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { ProductInterface } from "../../../../../../types/Product";
import {
  toDisplayNumber,
  toPrice,
  truncStr,
} from "../../../../../utils/shared";
import LinkHref from "../../../../shared/LinkHref";

type OtherOffersProps = {
  product: ProductInterface;
} & TableContainerProps;

export default function OtherOffers({ product, ...props }: OtherOffersProps) {
  function getConditionShorthand(condition: string) {
    condition = condition.replace(/([A-Z])/g, " $1").trim();

    let keywords = condition.split(" ");
    if (keywords[0].toLowerCase() === "used") keywords = keywords.splice(1);
    keywords = keywords.filter((word) => word.length > 0 && word !== "-");

    return keywords.map((word) => word[0].toUpperCase()).join("");
  }

  function getConditionLonghand(channel: string, condition: string) {
    condition = condition.replace(/([A-Z])/g, " $1").trim();
    let keywords = condition.split(" ");
    if (keywords[0].toLowerCase() === "used") keywords = keywords.splice(1);
    keywords = keywords.filter((word) => word.length > 0 && word !== "-");

    return `${channel === "fba" ? "FBA" : "FBM"} - ${keywords.join(" ")}`;
  }

  return (
    <TableContainer {...props}>
      <Heading size="md" mb={2}>
        Other offers
      </Heading>
      <Table className="table_col_gap_sm" size="sm" variant="simple">
        <Thead>
          <Tr fontWeight={"bold"}>
            <Td>#</Td>
            <Td>condition</Td>
            <Td>stock</Td>
            <Td>price</Td>
            <Td>rating</Td>
            <Td>store</Td>
          </Tr>
        </Thead>
        <Tbody>
          {product.amazonInfo.offers.map((offer, index) => (
            <Tr key={`offer${index}${product.id}`} borderWidth={0}>
              <Td>{index + 1}</Td>
              <Td>
                <Tooltip
                  label={getConditionLonghand(offer.channel, offer.condition)}
                  hasArrow
                  placement="top-start"
                >
                  {offer.channel === "fba" ? (
                    <Badge
                      color="orange.500"
                      bg="orange.200"
                      borderWidth="1px"
                      borderColor="orange.500"
                      cursor="default"
                    >
                      {getConditionShorthand(offer.condition)}
                    </Badge>
                  ) : (
                    <Badge
                      color="blue.500"
                      bg="blue.200"
                      borderWidth="1px"
                      borderColor="blue.500"
                      cursor="default"
                    >
                      {getConditionShorthand(offer.condition)}
                    </Badge>
                  )}
                </Tooltip>
                {offer.isBuyBox && (
                  <Tooltip label={"Buy Box"} hasArrow placement="top-start">
                    <Badge
                      color="pink.500"
                      bg="pink.200"
                      borderWidth="1px"
                      borderColor="pink.500"
                      cursor="default"
                      ml={1}
                    >
                      BB
                    </Badge>
                  </Tooltip>
                )}
              </Td>
              <Td>{offer.stock ? toDisplayNumber(offer.stock) : "?"}</Td>
              <Td>{toPrice(offer.price)}</Td>
              <Td>
                {offer.rating && offer.numReviews
                  ? `${offer.rating}% (${toDisplayNumber(offer.numReviews)})`
                  : `n/a`}
              </Td>
              <Td>
                <Tooltip
                  label={offer.sellerName}
                  hasArrow
                  placement="top-start"
                >
                  <chakra.span>
                    <LinkHref
                      onClick={() => window.open(offer.sellerLink, "_blank")}
                      cursor="pointer"
                    >
                      {truncStr(offer.sellerName, 10)}
                    </LinkHref>
                  </chakra.span>
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
