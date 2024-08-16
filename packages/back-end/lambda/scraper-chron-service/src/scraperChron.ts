import { PrismaClient } from "../../../prisma/generated/client";
import { modifyTaskCount } from "../../../shared/aws/ecs";
import { CATALOG_TASK_COUNT } from "../../../shared/constants";

const prisma = new PrismaClient();

async function resetScraperStatus() {
  const scraperStatus = await prisma.scraperStatus.findFirst({
    where: { id: 1 },
  });

  if (!scraperStatus) {
    await prisma.scraperStatus.create({
      data: { id: 1 },
    });
  } else {
    await prisma.scraperStatus.update({
      where: { id: 1 },
      data: {
        pdpStarted: false,
        gptTitleMatchStarted: false,
        keepaStarted: false,
        deletedOldProducts: false,
      },
    });
  }
}

async function deleteBookmarks() {
  try {
    await prisma.retailerProductDiscoveryBookmark.deleteMany({});
  } catch (e) {
    console.log("Error deleting retailerProductDiscoveryBookmark", e);
  }
}

async function startCatalogScraper() {
  await modifyTaskCount({
    clusterName: "ProdScraperECSCluster", //todo: make this dynamic
    serviceName: "catalogScraperService",
    incrememntBy: CATALOG_TASK_COUNT,
  });
}

export async function scraperChron() {
  console.log("starting scraperChron()");

  await resetScraperStatus();
  await deleteBookmarks();
  await startCatalogScraper();
}

if (require.main === module) {
  scraperChron();
}
