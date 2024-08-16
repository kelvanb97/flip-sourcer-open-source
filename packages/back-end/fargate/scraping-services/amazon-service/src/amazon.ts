import {
  getIsLockValid,
  getRetailerIndexesToScrape,
  handleIndexByState,
} from "./utils";
import { modifyTaskCount } from "../../../../shared/aws/ecs";
import { isProd } from "../../../../shared/envVars";
import {
  PrismaClient,
  RetailerProductIndex,
} from "../../../../prisma/generated/client";
import {
  AmazonInfoFromCatalogAndPdp,
  RetailerInfoFromPdp,
} from "../../../../../types/Product";
import { getAmazonInfoCallerPdp } from "./amazon/amazonPdpPreFlight";
import { writeProductInfoToDb } from "./writeProductInfoToDb";

interface HandleAmazonScrapeProps {
  productLink: string;
  productImageLink: string;
  retailerIndex: RetailerProductIndex;
  serverPID: string;
  prisma: PrismaClient;
}

export async function handleAmazonScrape({
  productLink,
  productImageLink,
  retailerIndex,
  serverPID,
  prisma,
}: HandleAmazonScrapeProps): Promise<void> {
  console.log("Scraping and parsing page: ", productLink);
  try {
    if (!retailerIndex) throw new Error("retailerIndex is undefined");
    const isLockValid = await getIsLockValid(
      retailerIndex?.id,
      serverPID,
      prisma
    );
    if (!isLockValid) return;

    const retailerProductDetails = retailerIndex.pdpInfo as RetailerInfoFromPdp;

    let amazonInfoFromCatalogAndPdp = {} as AmazonInfoFromCatalogAndPdp;
    amazonInfoFromCatalogAndPdp = await getAmazonInfoCallerPdp({
      retailerProductName: retailerProductDetails.productName,
      retailerProductImageLink: productImageLink,
      retailerProductPrice: retailerProductDetails.productCost,
      upc: retailerProductDetails.productUpc,
    });

    await writeProductInfoToDb({
      productLink,
      productImageLink,
      retailerProductDetails,
      amazonInfoFromCatalogAndPdp,
      prisma,
    });

    await handleIndexByState("success", retailerIndex, serverPID, prisma);
  } catch (err) {
    if (err instanceof Error) console.log(err.message);

    try {
      await handleIndexByState("error", retailerIndex, serverPID, prisma);
    } catch (err) {
      console.log("Error handling index or productToUpdate by state: ", err);
    }
  }
}

async function handleNoUrlsToScrape() {
  console.log("No pdp indexes available to scrape.");

  await modifyTaskCount({
    clusterName: isProd ? "ProdScraperECSCluster" : "DevScraperECSCluster",
    serviceName: "pdpScraperService",
  });
}

export async function startAmazon(prisma: PrismaClient, serverPID: string) {
  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const retailerIndexesToScrape = await getRetailerIndexesToScrape(
        prisma,
        serverPID
      );
      console.log("# retailerIndexesToScrape", retailerIndexesToScrape.length);

      if (!retailerIndexesToScrape.length) return await handleNoUrlsToScrape();

      const promises = retailerIndexesToScrape.map(async (retailerIndex) => {
        try {
          console.log("\n\nnew retailerIndex started");

          return await handleAmazonScrape({
            productLink: retailerIndex.productLink,
            productImageLink: retailerIndex.productImageLink,
            retailerIndex,
            serverPID,
            prisma,
          });
        } catch (error) {
          console.error(
            `Error processing retailerIndex ${retailerIndex.productLink}:`,
            error
          );
          return;
        }
      });

      await Promise.all(promises);
    }
  } catch (err) {
    console.log(`PDP server error: ${err}`);
    return;
  }
}
