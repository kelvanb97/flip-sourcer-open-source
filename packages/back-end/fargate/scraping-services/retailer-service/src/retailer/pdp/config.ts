import { RetailerName } from "../../../../../../../types/Product";
import { RetailerPdpConfig } from "../../../../../../../types/Retailer";
import { priceStrToNum } from "../../../../shared/general";
import { getDom } from "../../../../shared/scraperApi";
import { getIsbn13, getUpc } from "../../utils";

export const retailerPdpConfigMap: Record<RetailerName, RetailerPdpConfig> = {
  "6pm": {
    retailerName: "6pm",
    baseUrl: "6pm.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByTagName("main")[0],
      getProductName: (metaDiv: Element) =>
        metaDiv
          .querySelector('meta[itemprop="name"]')
          ?.getAttribute("content") || null,
      getUpc: (rawHTML: string) => getUpc(rawHTML, `"upc"`) || null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .querySelector(
            `button[type="submit"][data-track-value="Add-To-Cart"]`
          )
          ?.textContent?.trim();
        const productInStock =
          addToCartText === "Add to Shopping Bag" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`[itemprop="price"]`);
        const newPriceStr = newPriceDiv?.getAttribute("content")?.trim();

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  acehardware: {
    retailerName: "acehardware",
    baseUrl: "acehardware.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("product-content-wrapper")[0],
      getProductName: (metaDiv: Element) =>
        metaDiv.getElementsByClassName("mz-pagetitle")[0]?.textContent || null,
      getUpc: (rawHTML: string) => getUpc(rawHTML, `"upc"`) || null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .getElementById("add-to-cart")
          ?.textContent?.trim();
        const productInStock = addToCartText === "ADD TO CART" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv =
          metaDiv.querySelector(".totAmt") ||
          metaDiv.querySelector(".price-value") ||
          metaDiv.querySelector(".mz-price");

        const newPriceStr = newPriceDiv?.textContent?.trim();

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  barnesandnoble: {
    retailerName: "barnesandnoble",
    baseUrl: "barnesandnoble.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementById("productDetail"),
      getProductName: (metaDiv: Element) => {
        const productTitle =
          metaDiv.querySelector(`[itemprop="name"]`)?.textContent?.trim() ||
          null;
        if (!productTitle) return null;

        const productAuthor =
          metaDiv.querySelector(`#author`)?.getAttribute("value") || null;
        if (!productAuthor) return productTitle;

        return `${productTitle} by ${productAuthor}`;
      },
      getUpc: (rawHTML: string) => getIsbn13(rawHTML, `ISBN-13:`) || null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .querySelector(`.add-to-cart-button`)
          ?.getAttribute("value")
          ?.trim();
        const productInStock = addToCartText === "ADD TO CART" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`#pdp-cur-price`);
        const newPriceStr = newPriceDiv?.textContent?.trim();

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  bestbuy: {
    retailerName: "bestbuy",
    baseUrl: "bestbuy.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.body.getElementsByClassName("pl-page-content")[0],
      getProductName: (metaDiv: Element) => {
        const productNameDiv = metaDiv.getElementsByClassName("sku-title")[0];
        const productName =
          productNameDiv.getElementsByTagName("h1")[0]?.textContent || null;
        return productName;
      },
      getUpc: (rawHTML: string) => getUpc(rawHTML, `"UPC"`) || null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .getElementsByClassName("add-to-cart-button")[0]
          ?.textContent?.trim();
        const productInStock = addToCartText === "Add to Cart" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (_metaDiv: Element, document: Document) => {
        const rawHTML = document.documentElement.outerHTML;
        const priceStr = rawHTML.split(`\\"price\\":`)[1].split(`,`)[0];
        const newCost = priceStrToNum(priceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  bloomingkoco: {
    retailerName: "bloomingkoco",
    baseUrl: "bloomingkoco.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("detail")[0],
      getProductName: (metaDiv: Element) =>
        metaDiv.querySelector(`.title`)?.textContent || null,
      getUpc: (_rawHTML: string) => null,
      getStockInfo: (document: Document) => {
        const addToCartDiv = document.querySelector(
          `.quantity-submit-row__submit`
        );
        const productInStock = addToCartDiv ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`.current-price`);
        const newPriceStr = newPriceDiv?.textContent?.trim();

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  boscovs: {
    retailerName: "boscovs",
    baseUrl: "boscovs.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("mz-pdp-right-block")[0],
      getProductName: (metaDiv: Element) =>
        metaDiv.querySelector(`.mz-pagetitle`)?.textContent || null,
      getUpc: (rawHTML: string) => getUpc(rawHTML, `"upc"`) || null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .querySelector(`#add-to-cart`)
          ?.textContent?.trim();
        const productInStock = addToCartText === "Add To Bag" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`[itemprop="price"]`);
        const newPriceStr = newPriceDiv?.textContent?.trim();

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  boxlunch: {
    retailerName: "boxlunch",
    baseUrl: "boxlunch.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("pdp-details")[0],
      getProductName: (metaDiv: Element) =>
        metaDiv.querySelector(`.product-name`)?.textContent || null,
      getUpc: (rawHTML: string) => getUpc(rawHTML, `"upc"`) || null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .querySelector(`.add-to-cart`)
          ?.textContent?.trim();
        const productInStock = addToCartText === "ADD TO BAG" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`.value`);
        const newPriceStr = newPriceDiv?.getAttribute("content") || null;

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  chewy: {
    retailerName: "chewy",
    baseUrl: "chewy.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("kib-container")[0],
      getProductName: (metaDiv: Element) =>
        metaDiv.querySelector(`[data-testid="product-title-heading"]`)
          ?.textContent || null,
      getUpc: (rawHTML: string) => getUpc(rawHTML, `"upc"`) || null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .querySelector(`[data-testid="add-to-cart"]`)
          ?.textContent?.trim();
        const productInStock = addToCartText === "Add to Cart" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceStr =
          metaDiv.querySelector(`.kib-product-price`)?.textContent;

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  gamestop: {
    retailerName: "gamestop",
    baseUrl: "gamestop.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.body.getElementsByClassName("primary-details")[0],
      getProductName: (metaDiv: Element) =>
        metaDiv.querySelector(".product-name")?.textContent || null,
      getUpc: (rawHTML: string) => getUpc(rawHTML, ">UPC<") || null,
      getStockInfo: (document: Document) => {
        const inStockText = document
          .getElementsByClassName("add-to-cart")[0]
          ?.textContent?.trim()
          .toLocaleLowerCase();
        const productInStock = inStockText === "add to cart" ? true : false;
        const productStock = productInStock ? undefined : 0;
        return { productInStock, productStock };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceStr = metaDiv
          ?.querySelector(".actual-price")
          ?.textContent?.trim();
        const newCost = priceStrToNum(newPriceStr);

        const preOwnedPriceDiv = metaDiv
          .querySelector(".condition-label.pre-owned")
          ?.closest("div");
        const preOwnedPriceStr = preOwnedPriceDiv
          ?.querySelector(".actual-price")
          ?.textContent?.trim();
        const usedCost = priceStrToNum(preOwnedPriceStr);

        return { newCost, usedCost };
      },
    },
  },
  hottopic: {
    retailerName: "hottopic",
    baseUrl: "hottopic.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("product-detail")[0],
      getProductName: (metaDiv: Element) =>
        metaDiv.querySelector(`.product-name`)?.textContent || null,
      getUpc: (_rawHTML: string) => null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .querySelector(`#addBag`)
          ?.textContent?.trim();
        const productInStock = addToCartText === "ADD TO BAG" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`.value`);
        const newPriceStr = newPriceDiv?.getAttribute("content") || null;

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  kohls: {
    retailerName: "kohls",
    baseUrl: "kohls.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("pdp-content")[0],
      getProductName: (metaDiv: Element) =>
        metaDiv.querySelector(`.product-title`)?.textContent?.trim() || null,
      getUpc: (rawHTML: string) => getUpc(rawHTML, `"UPC"`) || null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .querySelector(`.pdp-addtobag`)
          ?.getAttribute("value");
        const productInStock = addToCartText === "Add to Cart" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`#pdpprice-price-container`);
        const newPriceStr = newPriceDiv?.textContent?.trim();

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  lookfantastic: {
    retailerName: "lookfantastic",
    baseUrl: "lookfantastic.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("athenaProductPage_topRow")[0],
      getProductName: (metaDiv: Element) =>
        metaDiv.querySelector(`.productName_title`)?.textContent?.trim() ||
        null,
      getUpc: (_rawHTML: string) => null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .querySelector(`.productAddToBasket`)
          ?.textContent?.trim();
        const productInStock = addToCartText === "Add to cart" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`.productPrice_price`);
        const newPriceStr = newPriceDiv?.textContent?.trim();

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  macys: {
    retailerName: "macys",
    baseUrl: "macys.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("standard-right-content")[0],
      getProductName: (metaDiv: Element) => {
        const productBrand =
          metaDiv.querySelector(`.brand-name`)?.textContent?.trim() || null;
        const productName =
          metaDiv
            .querySelector(`[data-auto="product-name"]`)
            ?.textContent?.trim() || null;

        if (!productName) return null;

        if (productBrand) return `${productBrand} ${productName}`;

        return productName;
      },
      getUpc: (rawHTML: string) => getUpc(rawHTML, `upcNumber`) || null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .querySelector(`[data-auto="add-to-bag"]`)
          ?.textContent?.trim();
        const productInStock = addToCartText === "Add To Bag" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`.lowest-sale-price`);
        const newPriceStr = newPriceDiv?.textContent?.trim();

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  marshalls: {
    retailerName: "marshalls",
    baseUrl: "marshalls.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("product-details")[0],
      getProductName: (metaDiv: Element) => {
        const productBrand =
          metaDiv.querySelector(`.product-brand`)?.textContent?.trim() || null;
        const productName =
          metaDiv.querySelector(`.product-title`)?.textContent?.trim() || null;

        if (!productName) return null;

        if (productBrand) return `${productBrand} ${productName}`;

        return productName;
      },
      getUpc: (rawHTML: string) => getUpc(rawHTML, `upcNumber`) || null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .querySelector(`[name="addItemToOrder"]`)
          ?.getAttribute("value");
        const productInStock = addToCartText === "Add to Bag" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`.discounted-price`);
        const newPriceStr = newPriceDiv?.textContent
          ?.trim()
          .split("newPriceLabel")[1];

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  newegg: {
    retailerName: "newegg",
    baseUrl: "newegg.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("is-product")[0],
      getProductName: (metaDiv: Element) => {
        const productName =
          metaDiv.querySelector(`.product-title`)?.textContent?.trim() || null;

        return productName;
      },
      getUpc: (rawHTML: string) => getUpc(rawHTML, `UPCCode`) || null,
      getStockInfo: (document: Document) => {
        const addToCartDiv = document.querySelector("#ProductBuy");

        const addToCartText = addToCartDiv
          ?.querySelector(`.btn-primary`)
          ?.textContent?.trim();
        const productInStock = addToCartText === "Add to cart" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`.price-current`);
        const newPriceStr = newPriceDiv?.textContent?.trim();

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  scheels: {
    retailerName: "scheels",
    baseUrl: "scheels.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("product-detail")[0],
      getProductName: (metaDiv: Element) =>
        metaDiv.querySelector(`.product-name-main`)?.textContent?.trim() ||
        null,
      getUpc: (_rawHTML: string) => null,
      getStockInfo: (document: Document) => {
        const addToCartButton = document.getElementById("add-to-cart");
        if (addToCartButton)
          return {
            productInStock: true,
            productStock: undefined,
          };

        const addToCartText = document
          .querySelector(`[title="Add to Cart"]`)
          ?.getAttribute("value");
        const productInStock = addToCartText === "Add to Cart" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv =
          metaDiv.querySelector(`.price-sales`) ||
          metaDiv.querySelector(`.price-range`);
        const newPriceStr = newPriceDiv
          ?.getElementsByClassName("visually-hidden")[0]
          ?.textContent?.trim();

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  sportsmans: {
    retailerName: "sportsmans",
    baseUrl: "sportsmans.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("smw-sticky-product")[0],
      getProductName: (metaDiv: Element) =>
        metaDiv.querySelector(`.name`)?.textContent?.trim() || null,
      getUpc: (rawHTML: string) => getUpc(rawHTML, "gtin12"),
      getStockInfo: (document: Document) => {
        const addToCartButton = document.querySelector(".js-addToCartButton");
        if (addToCartButton)
          return {
            productInStock: true,
            productStock: undefined,
          };

        return {
          productInStock: false,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceStr = metaDiv
          .querySelector(`.price`)
          ?.textContent?.trim();

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  tjmaxx: {
    retailerName: "tjmaxx",
    baseUrl: "tjmaxx.tjx.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.getElementsByClassName("product-details")[0],
      getProductName: (metaDiv: Element) => {
        const productBrand = metaDiv
          .querySelector(".product-brand")
          ?.textContent?.trim();
        const productName = metaDiv
          .querySelector(".product-title")
          ?.textContent?.trim();

        if (!productName) return null;

        if (productBrand) return `${productBrand} ${productName}`;

        return productName;
      },
      getUpc: (_rawHTML: string) => null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .querySelector(`[name="addItemToOrder"]`)
          ?.getAttribute("value")
          ?.trim();
        const productInStock = addToCartText === "ADD TO BAG" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`.discounted-price`);
        const newPriceStr = newPriceDiv?.textContent
          ?.trim()
          .split("new price:")[1];

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  vitacost: {
    retailerName: "vitacost",
    baseUrl: "vitacost.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.querySelector("#productDetailPage"),
      getProductName: (metaDiv: Element) =>
        metaDiv.querySelector(`[itemprop="name"]`)?.textContent?.trim() || null,
      getUpc: (rawHTML: string) => getUpc(rawHTML, `vSKU`) || null,
      getStockInfo: (document: Document) => {
        const addToCartText = document
          .querySelector(`#addToCartButton`)
          ?.getAttribute("value")
          ?.trim();
        const productInStock = addToCartText === "Add to cart" ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`[itemprop="price"]`);
        const newPriceStr = newPriceDiv?.textContent?.trim();

        const newCost = priceStrToNum(newPriceStr);
        return { newCost, usedCost: null };
      },
    },
  },
  walgreens: {
    retailerName: "walgreens",
    baseUrl: "walgreens.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.querySelector("#page-content-atf"),
      getProductName: (metaDiv: Element) => {
        const brandName = metaDiv
          .querySelector(`.brand-title`)
          ?.textContent?.trim();
        const productName = metaDiv
          .querySelector(`#productTitle`)
          ?.textContent?.trim();
        const productSize = metaDiv
          .querySelector(`#productSizeCount`)
          ?.textContent?.trim();

        if (!productName) return null;

        if (brandName && productSize)
          return `${brandName} ${productName} ${productSize}`;

        if (brandName) return `${brandName} ${productName}`;

        return productName;
      },
      getUpc: (rawHTML: string) => getUpc(rawHTML, `"gtin"`) || null,
      getStockInfo: (document: Document) => {
        const addToCartText = document.querySelector(`.icon__shipping`);

        const productInStock = addToCartText ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`.product__price`);
        const newPriceStr = newPriceDiv?.textContent?.trim();

        const newCost = priceStrToNum(newPriceStr);
        return { newCost: newCost ? newCost / 100 : newCost, usedCost: null };
      },
    },
  },
  zappos: {
    retailerName: "zappos",
    baseUrl: "zappos.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getMetaDiv: (document: Document) =>
        document.querySelector("#productRecap"),
      getProductName: (metaDiv: Element) => {
        const productName = metaDiv
          .querySelector(`meta[itemprop="name"]`)
          ?.getAttribute("content");
        if (!productName) return null;

        return productName;
      },
      getUpc: (_rawHTML: string) => null,
      getStockInfo: (document: Document) => {
        const addToCartText = document.querySelector(`#add-to-cart-button`);

        const productInStock = addToCartText ? true : false;
        return {
          productInStock,
          productStock: undefined,
        };
      },
      getCosts: async (metaDiv: Element) => {
        const newPriceDiv = metaDiv.querySelector(`[itemprop="price"]`);
        const newPriceStr = newPriceDiv?.textContent?.trim();

        const newCost = priceStrToNum(newPriceStr);

        return { newCost, usedCost: null };
      },
    },
  },
};
