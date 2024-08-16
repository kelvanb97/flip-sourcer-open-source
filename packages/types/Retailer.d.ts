import { RetailerName } from "./Product";

export interface ProductAndImageLink {
  productLink: string;
  productImageLink: string;
}

export interface RetailerCatalogConfig {
  retailerName: RetailerName;
  baseUrl: string;
  instructions: {
    getDom: (url: string) => Promise<Document | null>;
    getProductCards: (
      document: Document
    ) => HTMLCollectionOf<Element> | Element[];
    getPdpLink: (productCard: Element) => string | null;
    getImageLink: (productCard: Element) => string | null;
    getNextPageUrl: (document: Document, url: string) => string | null;
  };
}

export interface RetailerPdpConfig {
  retailerName: RetailerName;
  baseUrl: string;
  instructions: {
    getDom: (url: string) => Promise<Document | null>;
    getMetaDiv: (document: Document) => Element | null;
    getProductName: (metaDiv: Element) => string | null;
    getUpc: (rawHTML: string) => string | null;
    getStockInfo: (document: Document) => {
      productInStock: boolean;
      productStock: number | undefined;
    };
    getCosts: (
      metaDiv: Element,
      document: Document
    ) => Promise<{
      newCost: number | null;
      usedCost: number | null;
    }>;
  };
}
