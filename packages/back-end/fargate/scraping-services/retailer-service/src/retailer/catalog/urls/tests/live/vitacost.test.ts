import { retailerPdpConfigMap } from "../../../../pdp/config";
import { retailerCatalogConfigMap } from "../../../config";
import { vitacost } from "../../vitacost";

it("vitacost catalog and pdp", async () => {
  const catalogUrl = vitacost[0];

  const catlogDocument =
    await retailerCatalogConfigMap["vitacost"].instructions.getDom(catalogUrl);
  const productCards = retailerCatalogConfigMap["vitacost"]
    .instructions.getProductCards(catlogDocument!);
  const firstItemPdpLink = retailerCatalogConfigMap["vitacost"]
    .instructions.getPdpLink(productCards[0]);
  const firstItemImageLink = retailerCatalogConfigMap["vitacost"]
    .instructions.getImageLink(productCards[0]);
  const nextPageUrl = retailerCatalogConfigMap["vitacost"]
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
    await retailerPdpConfigMap["vitacost"].instructions.getDom(firstItemPdpLink!);
  const metaDiv = await retailerPdpConfigMap["vitacost"]
    .instructions.getMetaDiv(pdpDocument!);
  const productTitle = await retailerPdpConfigMap["vitacost"]
    .instructions.getProductName(metaDiv!);
  const productStock = await retailerPdpConfigMap["vitacost"]
    .instructions.getStockInfo(pdpDocument!);
  const productPrice = await retailerPdpConfigMap["vitacost"]
    .instructions.getCosts(metaDiv!, pdpDocument!);
  const productUpc = await retailerPdpConfigMap["vitacost"]
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
