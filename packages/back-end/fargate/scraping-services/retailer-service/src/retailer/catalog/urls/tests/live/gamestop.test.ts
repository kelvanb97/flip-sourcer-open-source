import { retailerPdpConfigMap } from "../../../../pdp/config";
import { retailerCatalogConfigMap } from "../../../config";
import { gamestop } from "../../gamestop";

it("gamestop catalog and pdp", async () => {
  const catalogUrl = gamestop[0];

  const catlogDocument =
    await retailerCatalogConfigMap["gamestop"].instructions.getDom(catalogUrl);
  const productCards = retailerCatalogConfigMap["gamestop"]
    .instructions.getProductCards(catlogDocument!);
    
  //not going to rename for consistency but the first one is typically a pre-order
  const firstItemPdpLink = retailerCatalogConfigMap["gamestop"]
    .instructions.getPdpLink(productCards[1]);
  const firstItemImageLink = retailerCatalogConfigMap["gamestop"]
    .instructions.getImageLink(productCards[1]);
  const nextPageUrl = retailerCatalogConfigMap["gamestop"]
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
    await retailerPdpConfigMap["gamestop"].instructions.getDom(firstItemPdpLink!);
  const metaDiv = await retailerPdpConfigMap["gamestop"]
    .instructions.getMetaDiv(pdpDocument!);
  const productTitle = await retailerPdpConfigMap["gamestop"]
    .instructions.getProductName(metaDiv!);
  const productStock = await retailerPdpConfigMap["gamestop"]
    .instructions.getStockInfo(pdpDocument!);
  const productPrice = await retailerPdpConfigMap["gamestop"]
    .instructions.getCosts(metaDiv!, pdpDocument!);
  const productUpc = await retailerPdpConfigMap["gamestop"]
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
