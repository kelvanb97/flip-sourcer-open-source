import { retailerPdpConfigMap } from "../../../../pdp/config";
import { retailerCatalogConfigMap } from "../../../config";
import { bestbuy } from "../../bestbuy";

it("bestbuy catalog and pdp", async () => {
  const catalogUrl = bestbuy[0];

  const catlogDocument =
    await retailerCatalogConfigMap["bestbuy"].instructions.getDom(catalogUrl);
  const productCards = retailerCatalogConfigMap["bestbuy"]
    .instructions.getProductCards(catlogDocument!);
  const firstItemPdpLink = retailerCatalogConfigMap["bestbuy"]
    .instructions.getPdpLink(productCards[0]);
  const firstItemImageLink = retailerCatalogConfigMap["bestbuy"]
    .instructions.getImageLink(productCards[0]);
  const nextPageUrl = retailerCatalogConfigMap["bestbuy"]
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
    await retailerPdpConfigMap["bestbuy"].instructions.getDom(firstItemPdpLink!);
  const metaDiv = await retailerPdpConfigMap["bestbuy"]
    .instructions.getMetaDiv(pdpDocument!);
  const productTitle = await retailerPdpConfigMap["bestbuy"]
    .instructions.getProductName(metaDiv!);
  const productStock = await retailerPdpConfigMap["bestbuy"]
    .instructions.getStockInfo(pdpDocument!);
  const productPrice = await retailerPdpConfigMap["bestbuy"]
    .instructions.getCosts(metaDiv!, pdpDocument!);
  const productUpc = await retailerPdpConfigMap["bestbuy"]
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
