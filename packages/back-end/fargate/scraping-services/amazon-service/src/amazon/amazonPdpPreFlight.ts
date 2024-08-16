import {
  AmazonInfoFromCatalog,
  AmazonInfoFromCatalogAndPdp,
} from "../../../../../../types/Product";
import {
  chooseProductFromAmazonCatalogByNameAndImage,
  chooseProductFromAmazonCatalogByUPC,
} from "./amazonCatalog";
import { getAmazonInfoFromPdp } from "./amazonPdp";

interface GetAmazonInfoCallerPdp {
  retailerProductName: string;
  retailerProductImageLink: string;
  retailerProductPrice: number;
  upc: string | null;
}

export async function getAmazonInfoCallerPdp({
  retailerProductName,
  retailerProductImageLink,
  retailerProductPrice,
  upc,
}: GetAmazonInfoCallerPdp): Promise<AmazonInfoFromCatalogAndPdp> {
  console.log("Starting getAmazonInfoCallerPdp()");

  let amazonInfoFromCatalog: AmazonInfoFromCatalog | null = null;
  if (upc)
    amazonInfoFromCatalog = await chooseProductFromAmazonCatalogByUPC(
      upc,
      retailerProductName,
      retailerProductImageLink,
      retailerProductPrice
    );

  if (!amazonInfoFromCatalog) {
    amazonInfoFromCatalog = await chooseProductFromAmazonCatalogByNameAndImage(
      retailerProductName,
      retailerProductImageLink,
      retailerProductPrice
    );
  }

  if (!amazonInfoFromCatalog)
    throw new Error(`Failed to find product on Amazon catalog page`);

  const amazonInfoFromPdp = await getAmazonInfoFromPdp({
    retailerProductName,
    amazonPdpLink: amazonInfoFromCatalog.productLink,
    amazonImageLink: amazonInfoFromCatalog.productImageLink,
  });
  if (!amazonInfoFromPdp)
    throw new Error(
      `Failed to getAmazonInfoFromPdp for ${amazonInfoFromCatalog.productLink}}`
    );

  amazonInfoFromCatalog.productLink = amazonInfoFromPdp.amazonPdpLink;
  amazonInfoFromCatalog.productImageLink = amazonInfoFromPdp.amazonImageLink;

  const amazonInfoFromCatalogAndPdp: AmazonInfoFromCatalogAndPdp = {
    amazonInfoFromCatalog: { ...amazonInfoFromCatalog },
    amazonInfoFromPdp: { ...amazonInfoFromPdp.amazonInfoFromPdp },
  };

  return amazonInfoFromCatalogAndPdp;
}
