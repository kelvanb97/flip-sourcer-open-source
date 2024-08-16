import { RetailerInfoFromPdp } from "../../../../../../../types/Product";
import { RetailerPdpConfig } from "../../../../../../../types/Retailer";
import { MIN_RETAILER_PRICE } from "../../../../../../shared/constants";

export async function parsePpd(
  document: Document,
  rawHTML: string,
  config: RetailerPdpConfig
): Promise<RetailerInfoFromPdp | null> {
  const metaDiv = config.instructions.getMetaDiv(document);
  if (!metaDiv) throw new Error("Couldn't find metaDiv");

  const productName = config.instructions.getProductName(metaDiv);
  const productUpc = config.instructions.getUpc(rawHTML);

  const { productInStock, productStock } =
    config.instructions.getStockInfo(document);

  const { newCost, usedCost } = await config.instructions.getCosts(
    metaDiv,
    document
  );

  if (!newCost) {
    console.log("Failed parsing pdp: newCost");
    return null;
  } else if (newCost <= MIN_RETAILER_PRICE) {
    console.log("newCost too low");
    return null;
  } else if (!productName) {
    console.log("Failed parsing pdp: productName");
    return null;
  } else if (!productInStock) {
    console.log("Failed parsing pdp: productInStock");
    return null;
  }

  return {
    siteName: config.retailerName,
    productName,
    productUpc,
    productCost: newCost,
    productCostUsed: usedCost,
    productInStock,
    productStock: productStock?.toString() || null,
  };
}
