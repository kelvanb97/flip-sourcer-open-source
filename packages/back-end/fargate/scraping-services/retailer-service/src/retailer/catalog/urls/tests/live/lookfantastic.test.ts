import { retailerPdpConfigMap } from "../../../../pdp/config";
import { retailerCatalogConfigMap } from "../../../config";
import { lookfantastic } from "../../lookfantastic";

it("lookfantastic catalog and pdp", async () => {
  const catalogUrl = lookfantastic[0];

  const catlogDocument =
    await retailerCatalogConfigMap["lookfantastic"].instructions.getDom(catalogUrl);
  const productCards = retailerCatalogConfigMap["lookfantastic"]
    .instructions.getProductCards(catlogDocument!);
  const firstItemPdpLink = retailerCatalogConfigMap["lookfantastic"]
    .instructions.getPdpLink(productCards[0]);
  const firstItemImageLink = retailerCatalogConfigMap["lookfantastic"]
    .instructions.getImageLink(productCards[0]);
  const nextPageUrl = retailerCatalogConfigMap["lookfantastic"]
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
    await retailerPdpConfigMap["lookfantastic"].instructions.getDom(firstItemPdpLink!);
  const metaDiv = await retailerPdpConfigMap["lookfantastic"]
    .instructions.getMetaDiv(pdpDocument!);
  const productTitle = await retailerPdpConfigMap["lookfantastic"]
    .instructions.getProductName(metaDiv!);
  const productStock = await retailerPdpConfigMap["lookfantastic"]
    .instructions.getStockInfo(pdpDocument!);
  const productPrice = await retailerPdpConfigMap["lookfantastic"]
    .instructions.getCosts(metaDiv!, pdpDocument!);
  const productUpc = await retailerPdpConfigMap["lookfantastic"]
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
