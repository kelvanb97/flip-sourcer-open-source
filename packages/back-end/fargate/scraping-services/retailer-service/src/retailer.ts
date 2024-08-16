import {
  getCatalogConfigByUrl,
  getCatalogBookmark,
  getPdpConfigByUrl,
  handleBookmarksByState,
  updateBookmark,
  upsertRetailerProductIndices,
} from "./utils";
import { modifyTaskCount } from "../../../../shared/aws/ecs";
import { isProd } from "../../../../shared/envVars";
import {
  MAX_SUCCESSFUL_PAGE_COUNT,
  PDP_TASK_COUNT,
  START_PDP_AT_TASK_COUNT,
} from "../../../../shared/constants";
import { PrismaClient } from "../../../../prisma/generated/client";
import {
  RetailerCatalogConfig,
  RetailerPdpConfig,
} from "../../../../../types/Retailer";
import { parseCatlog } from "./retailer/catalog/catalog";

// Starts the pdp service if the catalog task count is low enough and has yet to be started
async function handleStartPdp(
  prisma: PrismaClient,
  catalogTaskCount: number | null
) {
  if (!catalogTaskCount) return;
  //The task count isn't low enough to start pdp
  if (catalogTaskCount >= START_PDP_AT_TASK_COUNT) return;

  const scraperStatus = await prisma.scraperStatus.findFirst({
    where: { id: 1 },
  });
  //Pdp has already been started
  if (!scraperStatus || scraperStatus.pdpStarted) return;

  await prisma.scraperStatus.update({
    where: { id: 1 },
    data: { pdpStarted: true },
  });
  await modifyTaskCount({
    clusterName: isProd ? "ProdScraperECSCluster" : "DevScraperECSCluster",
    serviceName: "pdpScraperService",
    incrememntBy: PDP_TASK_COUNT,
  });
}

async function handleNoUrlsToScrape(prisma: PrismaClient) {
  console.log("No bookmarks or urls available to scrape.");

  const catalogTaskCount = await modifyTaskCount({
    clusterName: isProd ? "ProdScraperECSCluster" : "DevScraperECSCluster",
    serviceName: "catalogScraperService",
  });

  await handleStartPdp(prisma, catalogTaskCount);
}

interface HandleRetailerScrapeProps {
  catalogBookmark: {
    baseUrl: string;
    startUrl: string;
  };
  catalogConfig: RetailerCatalogConfig;
  pdpConfig: RetailerPdpConfig;
  prisma: PrismaClient;
  serverPID: string;
}

export async function handleRetailerScrape({
  catalogBookmark,
  catalogConfig,
  pdpConfig,
  prisma,
  serverPID,
}: HandleRetailerScrapeProps) {
  let prevUrl = "";
  let nextUrl = catalogBookmark.startUrl;
  let paging = true;
  while (paging) {
    const curUrl = nextUrl;
    console.log("Scraping and parsing page: ", curUrl);

    try {
      if (curUrl === prevUrl)
        throw new Error("Same url as previous page. Stuck in infinite loop.");

      const document = await catalogConfig.instructions.getDom(curUrl);
      if (!document) {
        throw new Error(`No document found for url: ${curUrl}`);
      }

      const links = parseCatlog(document, catalogConfig);

      await upsertRetailerProductIndices({
        links,
        retailer: catalogConfig.retailerName,
        pdpConfig,
        prisma,
      });

      const nextPageUrl = await catalogConfig.instructions.getNextPageUrl(
        document,
        curUrl
      );
      const isLastPage = !nextPageUrl;

      if (isLastPage) {
        console.log("Last page reached. Stopping.");
        paging = false;
        await handleBookmarksByState({ prisma, serverPID, state: "done" });
      } else {
        nextUrl = nextPageUrl;
        const successfulPageCount = await updateBookmark({
          baseUrl: catalogBookmark.baseUrl,
          endingUrl: nextPageUrl,
          retailer: catalogConfig.retailerName,
          prisma,
          serverPID,
        });

        if (successfulPageCount > MAX_SUCCESSFUL_PAGE_COUNT) {
          console.log("Max successful page count reached. Stopping.");
          paging = false;
          await handleBookmarksByState({ prisma, serverPID, state: "done" });
        }
      }
    } catch (err) {
      console.log(`Error catalog.ts. curUrl: ${curUrl}`, err);
      await handleBookmarksByState({ prisma, serverPID, state: "error" });
    }

    prevUrl = curUrl;
  }
}

export async function retailerStart(prisma: PrismaClient, serverPID: string) {
  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const catalogBookmark = await getCatalogBookmark(prisma, serverPID);

      if (!catalogBookmark) return await handleNoUrlsToScrape(prisma);

      const catalogConfig = getCatalogConfigByUrl(catalogBookmark.startUrl);
      if (!catalogConfig)
        throw new Error(`No catalogConfig for ${catalogBookmark.startUrl}`);

      const pdpConfig = getPdpConfigByUrl(catalogBookmark.startUrl);
      if (!pdpConfig)
        throw new Error(`No pdpConfig for ${catalogBookmark.startUrl}`);

      await handleRetailerScrape({
        catalogBookmark,
        catalogConfig,
        pdpConfig,
        prisma,
        serverPID,
      });
    }
  } catch (err) {
    console.log(`Catalog server error: ${err}`);
    return;
  }
}
