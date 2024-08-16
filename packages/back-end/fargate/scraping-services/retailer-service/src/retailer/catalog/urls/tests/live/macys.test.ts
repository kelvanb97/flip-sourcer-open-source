import { retailerPdpConfigMap } from "../../../../pdp/config";
import { retailerCatalogConfigMap } from "../../../config";
import { macys } from "../../macys";

it("macys catalog and pdp", async () => {
  const catalogUrl = macys[0];

  const catlogDocument =
    await retailerCatalogConfigMap["macys"].instructions.getDom(catalogUrl);
  const productCards = retailerCatalogConfigMap["macys"]
    .instructions.getProductCards(catlogDocument!);
  const firstItemPdpLink = retailerCatalogConfigMap["macys"]
    .instructions.getPdpLink(productCards[0]);
  const firstItemImageLink = retailerCatalogConfigMap["macys"]
    .instructions.getImageLink(productCards[0]);
  const nextPageUrl = retailerCatalogConfigMap["macys"]
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
    await retailerPdpConfigMap["macys"].instructions.getDom(firstItemPdpLink!);
  const metaDiv = await retailerPdpConfigMap["macys"]
    .instructions.getMetaDiv(pdpDocument!);
  const productTitle = await retailerPdpConfigMap["macys"]
    .instructions.getProductName(metaDiv!);
  const productStock = await retailerPdpConfigMap["macys"]
    .instructions.getStockInfo(pdpDocument!);
  const productPrice = await retailerPdpConfigMap["macys"]
    .instructions.getCosts(metaDiv!, pdpDocument!);
  const productUpc = await retailerPdpConfigMap["macys"]
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
