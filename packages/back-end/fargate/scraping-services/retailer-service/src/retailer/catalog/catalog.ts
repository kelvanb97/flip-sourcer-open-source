import {
  ProductAndImageLink,
  RetailerCatalogConfig,
} from "../../../../../../../types/Retailer";

export function parseCatlog(
  document: Document,
  config: RetailerCatalogConfig
): Array<ProductAndImageLink> {
  const productCards = config.instructions.getProductCards(document);

  const productAndImageLinks: Array<ProductAndImageLink> = [];
  for (const productCard of productCards) {
    try {
      const pdpLink = config.instructions.getPdpLink(productCard);
      const imageLink = config.instructions.getImageLink(productCard);

      if (!pdpLink || !imageLink) continue;

      productAndImageLinks.push({
        productLink: pdpLink,
        productImageLink: imageLink,
      });
    } catch (err) {
      console.log(err);
    }
  }

  console.log(`# links from catalog parse: ${productAndImageLinks.length}`);
  return productAndImageLinks;
}
