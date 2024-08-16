import { retailerPdpConfigMap } from "../../../../pdp/config";
import { retailerCatalogConfigMap } from "../../../config";
import { zappos } from "../../zappos";

it("zappos catalog and pdp", async () => {
  const catalogUrl = zappos[0];

  const catlogDocument =
    await retailerCatalogConfigMap["zappos"].instructions.getDom(catalogUrl);
  const productCards = retailerCatalogConfigMap["zappos"]
    .instructions.getProductCards(catlogDocument!);
  const firstItemPdpLink = retailerCatalogConfigMap["zappos"]
    .instructions.getPdpLink(productCards[0]);
  const firstItemImageLink = retailerCatalogConfigMap["zappos"]
    .instructions.getImageLink(productCards[0]);
  const nextPageUrl = retailerCatalogConfigMap["zappos"]
    .instructions.getNextPageUrl(catlogDocument!, catalogUrl);

  console.log("catalogResult", {
    firstItemPdpLink,
    firstItemImageLink,
    nextPageUrl,
    numProductCards: productCards.length,
  });

  expect(firstItemPdpLink).toBeDefined();
  expect(firstItemPdpLink).not.toBeNull();
  expect(firstItemPdpLink).toBeValidUrl();

  expect(firstItemImageLink).toBeDefined();
  expect(firstItemImageLink).not.toBeNull();
  expect(firstItemImageLink).toBeValidUrl();

  expect(nextPageUrl).toBeDefined();
  expect(nextPageUrl).not.toBeNull();
  expect(nextPageUrl).toBeValidUrl();

  const pdpDocument =
    await retailerPdpConfigMap["zappos"].instructions.getDom(firstItemPdpLink!);
  const metaDiv = await retailerPdpConfigMap["zappos"]
    .instructions.getMetaDiv(pdpDocument!);
  const productTitle = await retailerPdpConfigMap["zappos"]
    .instructions.getProductName(metaDiv!);
  const productStock = await retailerPdpConfigMap["zappos"]
    .instructions.getStockInfo(pdpDocument!);
  const productPrice = await retailerPdpConfigMap["zappos"]
    .instructions.getCosts(metaDiv!, pdpDocument!);
  const productUpc = await retailerPdpConfigMap["zappos"]
    .instructions.getUpc(pdpDocument!.documentElement.outerHTML);

  console.log("pdpResutl", {
    productTitle,
    productUpc,
    productPrice,
    productStock,
  });

  expect(productTitle).toBeDefined();
  expect(productTitle).not.toBeNull();
  expect(productStock.productInStock).toBe(true);
  expect(productStock.productStock).toBeUndefined();
  expect(productPrice.newCost).toBeDefined();
  expect(productPrice.newCost).not.toBeNull();
}, 180000);
