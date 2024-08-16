import { RetailerName } from "../../../../../types/Product";
import {
  ProductAndImageLink,
  RetailerCatalogConfig,
  RetailerPdpConfig,
} from "../../../../../types/Retailer";
import { LINKS_UPSERT_CHUNK_SIZE } from "../../../../shared/constants";
import { chunkArray } from "../../../../shared/general";
import { PrismaClient } from "../../../../prisma/generated/client";
import { handleLogging } from "../../../../shared/logging";
import { retailerCatalogConfigMap } from "./retailer/catalog/config";
import { retailerPdpConfigMap } from "./retailer/pdp/config";
import { retailerCategoryUrls } from "./retailer/catalog/urls/urls";
import { parsePpd } from "./retailer/pdp/pdp";

export function getPdpConfigByUrl(url: string) {
  let pdpConfig: RetailerPdpConfig | null = null;
  for (const config of Object.values(retailerPdpConfigMap)) {
    if (url.includes(config.baseUrl)) {
      pdpConfig = config;
      break;
    }
  }
  return pdpConfig;
}

export function getCatalogConfigByUrl(url: string) {
  let catalogConfig: RetailerCatalogConfig | null = null;
  for (const config of Object.values(retailerCatalogConfigMap)) {
    if (url.includes(config.baseUrl)) {
      catalogConfig = config;
      break;
    }
  }
  return catalogConfig;
}

interface UpsertRetailerProductIndices {
  links: Array<ProductAndImageLink>;
  retailer: RetailerName;
  pdpConfig: RetailerPdpConfig;
  prisma: PrismaClient;
}

//If the retailerIndex already exists, it doesn't need to be updated.
export async function upsertRetailerProductIndices({
  links,
  retailer,
  pdpConfig,
  prisma,
}: UpsertRetailerProductIndices) {
  const linkChunks = chunkArray([...links], LINKS_UPSERT_CHUNK_SIZE);

  for (const chunk of linkChunks) {
    const promises = chunk.map(async (link) => {
      try {
        const { productLink, productImageLink } = link;

        const scraperApiResult = await pdpConfig.instructions.getDom(
          productLink
        );
        if (!scraperApiResult) return;

        const rawHTML = scraperApiResult.documentElement.outerHTML;
        const pdpInfo = await parsePpd(scraperApiResult, rawHTML, pdpConfig);
        if (!pdpInfo) return;

        return prisma.retailerProductIndex.upsert({
          where: { productLink },
          update: {},
          create: {
            productLink,
            productImageLink,
            retailer,
            pdpInfo,
          },
        });
      } catch (error) {
        console.log("Error catalog.ts: upsertRetailerProductIndices", error);
        return;
      }
    });

    await Promise.all(promises); // Wait for the chunk to finish before moving to the next chunk
  }
}

interface UpdateBookmarkProps {
  baseUrl: string;
  endingUrl: string;
  retailer: RetailerName;
  prisma: PrismaClient;
  serverPID: string;
}

export async function updateBookmark({
  baseUrl,
  endingUrl,
  retailer,
  prisma,
  serverPID,
}: UpdateBookmarkProps) {
  await prisma.retailerProductDiscoveryBookmark.updateMany({
    where: { lockedBy: serverPID, baseUrl },
    data: {
      endingUrl,
      retailer,
      locked: true,
      lockedBy: serverPID,
      successfulPageCount: { increment: 1 },
    },
  });

  const updatedBookmark =
    await prisma.retailerProductDiscoveryBookmark.findFirst({
      where: { lockedBy: serverPID },
    });

  if (!updatedBookmark) {
    throw new Error("No updated bookmark found.");
  }

  return updatedBookmark.successfulPageCount;
}

export async function getCatalogBookmark(
  prisma: PrismaClient,
  serverPID: string,
  retryCount: number = 0
): Promise<{
  baseUrl: string;
  startUrl: string;
} | null> {
  if (retryCount > 5) process.exit(1);

  try {
    const unavailableBookmarks =
      await prisma.retailerProductDiscoveryBookmark.findMany({
        where: {
          OR: [
            { locked: true },
            { completed: true },
            { errorCount: { gt: 1 } },
          ],
        },
      });
    const availableBookmarkUrls = retailerCategoryUrls.filter((categoryUrl) =>
      unavailableBookmarks.every(
        (unavailableBookmark) => unavailableBookmark.baseUrl !== categoryUrl
      )
    );

    const activeBookmark =
      await prisma.retailerProductDiscoveryBookmark.findFirst({
        where: { locked: false, completed: false },
        orderBy: { createdAt: "desc" },
      });

    if (!activeBookmark && availableBookmarkUrls.length <= 0) return null;

    //no bookmarks were found
    if (!activeBookmark) {
      //This code reduces collisions between servers when they are trying to scrape the same bookmark.
      const numAvailableBookmarks = availableBookmarkUrls.length;
      const randomBookmarkIndex = Math.floor(
        Math.random() * numAvailableBookmarks
      );

      const activeBookmarkUrl = availableBookmarkUrls[randomBookmarkIndex];

      const retailer = getCatalogConfigByUrl(activeBookmarkUrl)?.retailerName;
      if (!retailer) return null;

      await prisma.retailerProductDiscoveryBookmark.create({
        data: {
          baseUrl: activeBookmarkUrl,
          endingUrl: activeBookmarkUrl,
          retailer,
          locked: true,
          lockedBy: serverPID,
        },
      });

      return {
        baseUrl: activeBookmarkUrl,
        startUrl: activeBookmarkUrl,
      };
    }

    //lock the bookmark so that other servers don't try to scrape it.
    //Also change the lockedBy PID so that we know which server is working on it.
    await prisma.retailerProductDiscoveryBookmark.update({
      where: { id: activeBookmark.id },
      data: { locked: true, lockedBy: serverPID },
    });

    return {
      baseUrl: activeBookmark.baseUrl,
      startUrl: activeBookmark.endingUrl,
    };
  } catch (error) {
    console.log("Error catalog.ts: getCatalogBookmark", error);
    return await getCatalogBookmark(prisma, serverPID, retryCount + 1);
  }
}

interface HandleBookmarksByStateProps {
  prisma: PrismaClient;
  serverPID: string;
  state: "done" | "error";
}

export async function handleBookmarksByState({
  prisma,
  serverPID,
  state,
}: HandleBookmarksByStateProps) {
  //successfully parsed through the entirety of a catalog section. Set completed to true so that we don't scrape/parse it again.
  if (state === "done") {
    return await prisma.retailerProductDiscoveryBookmark.updateMany({
      where: { lockedBy: serverPID },
      data: {
        completed: true,
        locked: false,
        lockedBy: "",
        successfulPageCount: { increment: 1 },
      },
    });
  }
  //error parsing through a catalog section.
  else if (state === "error") {
    const bookmark = await prisma.retailerProductDiscoveryBookmark.findFirst({
      where: { lockedBy: serverPID },
    });

    if (!bookmark)
      throw new Error(
        "Error catalog.ts: no bookmark found for this server. There should be a bookmark."
      );

    if (bookmark.errorCount >= 1) {
      //If this bookmark has already errored, set completed to true so that we don't scrape/parse it again.
      await prisma.retailerProductDiscoveryBookmark.update({
        where: { id: bookmark.id },
        data: {
          completed: true,
          locked: false,
          lockedBy: "",
          errorCount: { increment: 1 },
        },
      });
    } else {
      //If this bookmark has not errored, increment the error count so we can try to scrape it again.
      await prisma.retailerProductDiscoveryBookmark.update({
        where: { id: bookmark.id },
        data: {
          locked: false,
          lockedBy: "",
          errorCount: { increment: 1 },
        },
      });
    }
  } else {
    throw new Error(
      "Error catalog.ts: invalid state passed to handleBookmarks"
    );
  }
}

export async function unlockAllBookmarks(
  prisma: PrismaClient,
  serverPID: string
) {
  await prisma.retailerProductDiscoveryBookmark.updateMany({
    where: { lockedBy: serverPID },
    data: {
      locked: false,
      lockedBy: "",
    },
  });
}

export function getUpc(html: string, keyWord: string): string | null {
  const hitIndex = html.indexOf(keyWord);

  handleLogging({
    fileName: "getUpc",
    directory: "other",
    fileType: ".html",
    loggingData: html,
  });

  if (hitIndex === -1) return null;

  const relevantSubstring = html.substring(hitIndex, hitIndex + 1000);

  let upc = relevantSubstring.match(/\d{14}/)?.[0];
  if (upc) return upc.substring(2);

  upc = relevantSubstring.match(/\d{13}/)?.[0];
  if (upc) return upc.substring(1);

  upc = relevantSubstring.match(/\d{12}/)?.[0];
  if (upc) return upc;

  upc = relevantSubstring.match(/\d{11}/)?.[0];
  if (upc) return `0${upc}`;

  upc = relevantSubstring.match(/\d{10}/)?.[0];
  if (upc) return `00${upc}`;

  return null;
}

export function getIsbn13(html: string, keyWord: string): string | null {
  const hitIndex = html.indexOf(keyWord);

  handleLogging({
    fileName: "getUpc",
    directory: "other",
    fileType: ".html",
    loggingData: html,
  });

  if (hitIndex === -1) return null;

  const relevantSubstring = html.substring(hitIndex, hitIndex + 1000);

  const isbn = relevantSubstring.match(/\d{13}/)?.[0];
  if (isbn) return isbn;

  return null;
}
