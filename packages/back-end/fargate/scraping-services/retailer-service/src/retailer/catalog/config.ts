import { RetailerName } from "../../../../../../../types/Product";
import { RetailerCatalogConfig } from "../../../../../../../types/Retailer";
import { getDom } from "../../../../shared/scraperApi";

function standardizeUrl(
  url: string | undefined | null,
  retailerBaseUrl: string
) {
  url = url?.trim().split(" ")[0];
  if (!url) return null;
  if (url.includes("http") || url.includes("https")) return url;
  if (url.startsWith("//")) return "https:" + url;
  return retailerBaseUrl + url;
}

export const retailerCatalogConfigMap: Record<
  RetailerName,
  RetailerCatalogConfig
> = {
  "6pm": {
    retailerName: "6pm",
    baseUrl: "6pm.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) =>
        document.getElementsByTagName("article"),
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.6pm.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard.getElementsByTagName("img")[0]?.src;
        return standardizeUrl(imageLink, "https://www.6pm.com");
      },
      getNextPageUrl: (document: Document) => {
        const nextPageUrl = document
          .querySelector(`[rel="next"]`)
          ?.getAttribute("href");
        return standardizeUrl(nextPageUrl, "https://www.6pm.com");
      },
    },
  },
  acehardware: {
    retailerName: "acehardware",
    baseUrl: "acehardware.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) =>
        document.getElementsByClassName("mz-productlist-item"),
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.acehardware.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard
          .getElementsByTagName("img")[0]
          ?.getAttribute("data-src");
        return standardizeUrl(imageLink, "https://www.acehardware.com");
      },
      getNextPageUrl: (_document: Document) => null,
    },
  },
  barnesandnoble: {
    retailerName: "barnesandnoble",
    baseUrl: "barnesandnoble.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) => {
        let allProductCards = document.getElementsByClassName("record");
        if (!allProductCards.length)
          allProductCards =
            document.getElementsByClassName("product-shelf-tile");

        const retProductCards = [];
        for (let i = 0; i < allProductCards.length; i++) {
          const productCard = allProductCards[i];
          if (
            productCard
              .getElementsByClassName("availability-spacing")[0]
              ?.textContent?.includes("Online")
          )
            retProductCards.push(productCard);
        }

        return retProductCards;
      },
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.barnesandnoble.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard.getElementsByTagName("img")[0]?.src;
        return standardizeUrl(imageLink, "https://www.barnesandnoble.com");
      },
      getNextPageUrl: (document: Document) => {
        const nextPageUrl = document
          .querySelector(".next-button")
          ?.getAttribute("href");
        return standardizeUrl(nextPageUrl, "https://www.barnesandnoble.com");
      },
    },
  },
  bestbuy: {
    retailerName: "bestbuy",
    baseUrl: "bestbuy.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) =>
        document.getElementsByClassName("sku-item"),
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.bestbuy.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard
          .getElementsByTagName("img")[0]
          ?.srcset?.split(" ")[0];
        return standardizeUrl(imageLink, "https://www.bestbuy.com");
      },
      getNextPageUrl: (document: Document) => {
        const nextPageUrl = document
          .querySelector(".sku-list-page-next")
          ?.getAttribute("href");
        return standardizeUrl(nextPageUrl, "https://www.bestbuy.com");
      },
    },
  },
  bloomingkoco: {
    retailerName: "bloomingkoco",
    baseUrl: "bloomingkoco.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) => {
        const allProductCards =
          document.getElementsByClassName("product-block");

        const retProductCards = [];
        for (let i = 0; i < allProductCards.length; i++) {
          const productCard = allProductCards[i];
          if (!productCard.getElementsByClassName("price-label--sold-out")[0])
            retProductCards.push(productCard);
        }

        return retProductCards;
      },
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://bloomingkoco.com");
      },
      getImageLink: (productCard: Element) => {
        let imageLink = productCard
          .getElementsByTagName("img")[0]
          ?.getAttribute("data-src");
        imageLink = imageLink?.replace("_{width}x", "") || null;
        return standardizeUrl(imageLink, "https://bloomingkoco.com");
      },
      getNextPageUrl: (document: Document) => {
        const nextPageUrl = document
          .querySelector(".next")
          ?.getAttribute("href");
        return standardizeUrl(nextPageUrl, "https://bloomingkoco.com");
      },
    },
  },
  boscovs: {
    retailerName: "boscovs",
    baseUrl: "boscovs.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) =>
        document.getElementsByClassName("mz-productlist-item"),
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.boscovs.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard.getElementsByTagName("img")[0].src;
        return standardizeUrl(imageLink, "https://www.boscovs.com");
      },
      getNextPageUrl: (document: Document, url: string) => {
        const nextPageUrl = (
          document.querySelector(`[rel="next"]`) as HTMLAnchorElement
        ).href;

        const urlRef = new URL(url);
        const baseUrl = urlRef.origin + urlRef.pathname;

        return standardizeUrl(nextPageUrl, baseUrl);
      },
    },
  },
  boxlunch: {
    retailerName: "boxlunch",
    baseUrl: "boxlunch.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) =>
        document.getElementsByClassName("product"),
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.boxlunch.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard.getElementsByTagName("img")[0].src;
        return standardizeUrl(imageLink, "https://www.boxlunch.com");
      },
      getNextPageUrl: (document: Document, _url: string) => {
        const nextPageUrl = document
          .querySelector(".page-next")
          ?.getAttribute("href");
        return standardizeUrl(nextPageUrl, "https://www.boxlunch.com");
      },
    },
  },
  chewy: {
    retailerName: "chewy",
    baseUrl: "chewy.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) => {
        const containers = document.querySelectorAll(".kib-grid");
        const container = containers[containers.length - 1];
        const productCards =
          container?.getElementsByClassName("kib-product-card");

        const finalProductCards: Element[] = [];

        for (let i = 4; i < productCards.length; i++) {
          finalProductCards.push(productCards[i]);
        }

        return finalProductCards || [];
      },
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.chewy.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard.getElementsByTagName("img")[0].src;
        return standardizeUrl(imageLink, "https://www.chewy.com");
      },
      getNextPageUrl: (document: Document, _url: string) => {
        const nextPageUrl = document
          .querySelector(`[aria-label="Next page"]`)
          ?.getAttribute("href");
        return standardizeUrl(nextPageUrl, "https://www.chewy.com");
      },
    },
  },
  gamestop: {
    retailerName: "gamestop",
    baseUrl: "gamestop.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) => {
        const productDivs = document.getElementsByClassName(
          "product-grid-tile-wrapper"
        );

        const retProductCards: Element[] = [];
        for (let i = 0; i < productDivs.length; i++) {
          const productCard = productDivs[i];
          if (!productCard.getAttribute("data-position")) continue;
          retProductCards.push(productCard);
        }

        return retProductCards;
      },
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.gamestop.com");
      },
      getImageLink: (productCard: Element) => {
        const imageElement = productCard.getElementsByTagName("img")[0];
        const imageLink = imageElement?.dataset.src;
        return standardizeUrl(imageLink, "https://www.gamestop.com");
      },
      getNextPageUrl: (document: Document, url: string) => {
        // If the right arrow is disabled, there is no next page
        if (document.querySelector(".right-arrow.disabled")) return null;

        const nextPageUrlParamaterized = new URLSearchParams(url);

        let startParam = nextPageUrlParamaterized.get("start");
        if (!startParam) startParam = "0";

        const newStartParam = Number(startParam) + 20;
        nextPageUrlParamaterized.set("start", String(newStartParam));

        const nextPageUrl = decodeURIComponent(
          nextPageUrlParamaterized.toString()
        );

        return nextPageUrl;
      },
    },
  },
  hottopic: {
    retailerName: "hottopic",
    baseUrl: "hottopic.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) =>
        document.getElementsByClassName("product-tile"),
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.hottopic.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard.getElementsByTagName("img")[0].src;
        return standardizeUrl(imageLink, "https://www.hottopic.com");
      },
      getNextPageUrl: (document: Document, _url: string) => {
        const nextPageUrl = document
          .querySelector(".page-next")
          ?.getAttribute("href");
        return standardizeUrl(nextPageUrl, "https://www.hottopic.com");
      },
    },
  },
  kohls: {
    retailerName: "kohls",
    baseUrl: "kohls.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) =>
        document.getElementsByClassName("products_grid"),
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.kohls.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard
          .getElementsByTagName("img")[0]
          .getAttribute("srcset");
        return standardizeUrl(imageLink, "https://www.kohls.com");
      },
      getNextPageUrl: (_document: Document, url: string) => {
        const urlObj = new URL(url);
        const cnParamMatch = url.match(/CN=([^&]*)/);
        const originalCnParam = cnParamMatch ? cnParamMatch[1] : null;

        let startParam = urlObj.searchParams.get("WS");
        if (!startParam) startParam = "0";

        const pageSize = urlObj.searchParams.get("PPP");

        const newStartParam = Number(startParam) + Number(pageSize);

        // create new URLSearchParams object with all parameters except CN
        const newSearchParams = new URLSearchParams();
        urlObj.searchParams.forEach((value, name) => {
          if (name !== "CN") {
            newSearchParams.set(name, value);
          }
        });
        newSearchParams.set("WS", String(newStartParam));

        // construct new URL with original CN parameter
        const nextPageUrl = `${urlObj.origin}${
          urlObj.pathname
        }?CN=${originalCnParam}&${newSearchParams.toString()}`;

        return nextPageUrl;
      },
    },
  },
  lookfantastic: {
    retailerName: "lookfantastic",
    baseUrl: "lookfantastic.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) =>
        document.getElementsByClassName("productListProducts_product"),
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://us.lookfantastic.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard
          .getElementsByTagName("img")[0]
          .getAttribute("src");
        return standardizeUrl(imageLink, "https://us.lookfantastic.com");
      },
      getNextPageUrl: (_document: Document, url: string) => {
        const urlObj = new URL(url);

        let page = urlObj.searchParams.get("pageNumber");
        if (!page) page = "1";

        const nextPageUrl = `${urlObj.origin}${urlObj.pathname}?pageNumber=${
          Number(page) + 1
        }`;

        return nextPageUrl;
      },
    },
  },
  macys: {
    retailerName: "macys",
    baseUrl: "macys.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) =>
        document.getElementsByClassName("productThumbnailItem"),
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.macys.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard
          .getElementsByTagName("img")[0]
          .getAttribute("data-lazysrc");
        return standardizeUrl(imageLink, "https://www.macys.com");
      },
      getNextPageUrl: (document: Document, _url: string) => {
        const nextPageUrl = document
          .querySelector(".pagination-next")
          ?.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(nextPageUrl, "https://www.macys.com");
      },
    },
  },
  marshalls: {
    retailerName: "marshalls",
    baseUrl: "marshalls.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) =>
        document.getElementsByClassName("product"),
      getPdpLink: (productCard: Element) => {
        const productLink = productCard
          .getElementsByClassName("product-link")[0]
          .getAttribute("href");
        return standardizeUrl(productLink, "https://www.marshalls.com");
      },
      getImageLink: (productCard: Element) => {
        let imageLink = productCard
          .getElementsByTagName("img")[0]
          .getAttribute("data-altimageurl");

        if (!imageLink)
          imageLink = productCard
            .getElementsByTagName("img")[0]
            .getAttribute("src");

        return standardizeUrl(imageLink, "https://www.marshalls.com");
      },
      getNextPageUrl: (document: Document, _url: string) => {
        const nextPageUrl = document
          .querySelector(".next")
          ?.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(nextPageUrl, "https://www.marshalls.com");
      },
    },
  },
  newegg: {
    retailerName: "newegg",
    baseUrl: "newegg.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) => {
        const allProductCards =
          document.getElementsByClassName("goods-container");

        const retProductCards: Element[] = [];
        for (let i = 0; i < allProductCards.length; i++) {
          if (allProductCards[i].getAttribute("id")?.includes("item_cell"))
            retProductCards.push(allProductCards[i]);
        }

        return retProductCards;
      },
      getPdpLink: (productCard: Element) => {
        const productLink = productCard
          .getElementsByTagName("a")[0]
          ?.getAttribute("href");
        return standardizeUrl(productLink, "https://www.newegg.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard
          .getElementsByTagName("img")[0]
          ?.getAttribute("src");

        return standardizeUrl(imageLink, "https://www.newegg.com");
      },
      getNextPageUrl: (document: Document, _url: string) => {
        const nextPageUrl = document
          .querySelector(".paginations-next")
          ?.getAttribute("href");
        return standardizeUrl(nextPageUrl, "https://www.newegg.com");
      },
    },
  },
  scheels: {
    retailerName: "scheels",
    baseUrl: "scheels.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) => {
        const allProductCards = document.getElementsByClassName("grid-tile");

        const retProductCards: Element[] = [];
        for (let i = 0; i < allProductCards.length; i++) {
          if (
            allProductCards[i]
              .getElementsByClassName("product-badge")[1]
              ?.textContent?.includes("Out Of Stock")
          )
            continue;

          retProductCards.push(allProductCards[i]);
        }

        return retProductCards;
      },
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.scheels.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard
          .getElementsByTagName("img")[0]
          .getAttribute("data-src");
        return standardizeUrl(imageLink, "https://www.scheels.com");
      },
      getNextPageUrl: (document: Document, _url: string) => {
        const nextPageUrl = document
          .querySelector(".page-next")
          ?.getAttribute("href");
        return standardizeUrl(nextPageUrl, "https://www.scheels.com");
      },
    },
  },
  sportsmans: {
    retailerName: "sportsmans",
    baseUrl: "sportsmans.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) =>
        document.getElementsByClassName("product-item"),
      getPdpLink: (productCard: Element) => {
        const productLink = productCard
          .querySelector(".product-item-clickable-area")
          ?.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.sportsmans.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard
          .querySelector(".product-item-clickable-area")
          ?.getElementsByTagName("img")[0]
          ?.getAttribute("src");
        return standardizeUrl(imageLink, "https://www.sportsmans.com");
      },
      getNextPageUrl: (document: Document, _url: string) => {
        const nextPageUrl = document
          .querySelector(".pagination-next")
          ?.getElementsByTagName("a")[0]?.href;

        return standardizeUrl(nextPageUrl, "https://www.sportsmans.com");
      },
    },
  },
  tjmaxx: {
    retailerName: "tjmaxx",
    baseUrl: "tjmaxx.tjx.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) =>
        document.getElementsByClassName("product"),
      getPdpLink: (productCard: Element) => {
        const productLink = productCard
          .querySelector(".product-link")
          ?.getAttribute("href");
        return standardizeUrl(productLink, "https://tjmaxx.tjx.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard
          .getElementsByTagName("img")[0]
          .getAttribute("src");
        return standardizeUrl(imageLink, "https://tjmaxx.tjx.com");
      },
      getNextPageUrl: (document: Document, _url: string) => {
        const nextPageUrl = document
          .querySelector(`[rel="next"]`)
          ?.getAttribute("href");

        return standardizeUrl(nextPageUrl, "https://tjmaxx.tjx.com");
      },
    },
  },
  vitacost: {
    retailerName: "vitacost",
    baseUrl: "vitacost.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) =>
        document.getElementsByClassName("product-block"),
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.vitacost.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard
          .getElementsByTagName("img")[0]
          .getAttribute("src");
        return standardizeUrl(imageLink, "https://www.vitacost.com");
      },
      getNextPageUrl: (document: Document, _url: string) => {
        const nextPageUrl = document
          .querySelector(".icon-right-open.button2")
          ?.getAttribute("href");
        return standardizeUrl(nextPageUrl, "https://www.vitacost.com");
      },
    },
  },
  walgreens: {
    retailerName: "walgreens",
    baseUrl: "walgreens.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) => {
        const allProductCards =
          document.getElementsByClassName("card__product");

        const retProductCards: Element[] = [];
        for (const productCard of allProductCards) {
          if (productCard.querySelector(`.wag-ATC-button`)) {
            retProductCards.push(productCard);
          }
        }

        return retProductCards;
      },
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.walgreens.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard
          .getElementsByTagName("img")[0]
          .getAttribute("src");
        return standardizeUrl(imageLink, "https://www.walgreens.com");
      },
      getNextPageUrl: (_document: Document, url: string) => {
        const nextPageUrlParamaterized = new URLSearchParams(url);

        let startParam = nextPageUrlParamaterized.get("No");
        if (!startParam) startParam = "0";

        const newStartParam = Number(startParam) + 72;
        nextPageUrlParamaterized.set("No", String(newStartParam));

        const nextPageUrl = decodeURIComponent(
          nextPageUrlParamaterized.toString()
        );

        return nextPageUrl;
      },
    },
  },
  zappos: {
    retailerName: "zappos",
    baseUrl: "zappos.com",
    instructions: {
      getDom: async (url: string) => await getDom({ url }),
      getProductCards: (document: Document) => {
        const productsDiv = document.querySelector("#products");
        if (!productsDiv) return [];

        const allProductCards = productsDiv.getElementsByTagName("article");
        return allProductCards;
      },
      getPdpLink: (productCard: Element) => {
        const productLink = productCard.getElementsByTagName("a")[0]?.href;
        return standardizeUrl(productLink, "https://www.zappos.com");
      },
      getImageLink: (productCard: Element) => {
        const imageLink = productCard
          .getElementsByTagName("img")[0]
          .getAttribute("src");
        return standardizeUrl(imageLink, "https://www.zappos.com");
      },
      getNextPageUrl: (document: Document, _url: string) => {
        const nextPageUrlDiv = document.querySelector(`a[rel="next"]`);
        if (!nextPageUrlDiv) return null;

        const nextPageUrl = nextPageUrlDiv.getAttribute("href");
        return standardizeUrl(nextPageUrl, "https://www.zappos.com");
      },
    },
  },
};
