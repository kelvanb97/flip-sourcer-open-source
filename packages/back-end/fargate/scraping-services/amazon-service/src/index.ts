import { startAmazon } from "./amazon";
import { PrismaClient } from "../../../../prisma/generated/client";
import { unlockAllProductIndexes } from "./utils";
import { isProd } from "../../../../shared/envVars";
import { getTaskCount, modifyTaskCount } from "../../../../shared/aws/ecs";
import {
  GPT_TITLE_MATCH_TASK_COUNT,
  KEEPA_TASK_COUNT,
} from "../../../../shared/constants";

const prisma = new PrismaClient();
const serverPID = Date.now().toString(36);

async function handleDestroyOldProductData() {
  const date2daysAgo = new Date();
  date2daysAgo.setDate(date2daysAgo.getDate() - 2);

  await prisma.scraperStatus.update({
    where: { id: 1 },
    data: { deletedOldProducts: true },
  });

  try {
    await prisma.product.deleteMany({
      where: { createdAt: { lt: date2daysAgo } },
    });
  } catch (e) {
    console.log("Error deleting product", e);
  }

  try {
    await prisma.amazonInfo.deleteMany({
      where: { createdAt: { lt: date2daysAgo } },
    });
  } catch (e) {
    console.log("Error deleting amazonInfo", e);
  }

  try {
    await prisma.retailerHistoricalData.deleteMany({
      where: { createdAt: { lt: date2daysAgo } },
    });
  } catch (e) {
    console.log("Error deleting retailerHistoricalData", e);
  }

  try {
    await prisma.retailerInfo.deleteMany({
      where: { createdAt: { lt: date2daysAgo } },
    });
  } catch (e) {
    console.log("Error deleting retailerInfo", e);
  }

  try {
    await prisma.retailerProductDiscoveryBookmark.deleteMany({
      where: { createdAt: { lt: date2daysAgo } },
    });
  } catch (e) {
    console.log("Error deleting retailerProductDiscoveryBookmark", e);
  }

  try {
    await prisma.retailerProductIndex.deleteMany({
      where: { createdAt: { lt: date2daysAgo } },
    });
  } catch (e) {
    console.log("Error deleting retailerProductIndex", e);
  }

  try {
    await prisma.valueByCondition.deleteMany({
      where: { createdAt: { lt: date2daysAgo } },
    });
  } catch (e) {
    console.log("Error deleting valueByCondition", e);
  }
}

async function handleStartGptTitleMatch() {
  await prisma.scraperStatus.update({
    where: { id: 1 },
    data: { gptTitleMatchStarted: true },
  });

  await modifyTaskCount({
    clusterName: isProd ? "ProdScraperECSCluster" : "DevScraperECSCluster",
    serviceName: "gptProductTitleMatcherService",
    incrememntBy: GPT_TITLE_MATCH_TASK_COUNT,
  });
}

async function handleStartKeepa() {
  await prisma.scraperStatus.update({
    where: { id: 1 },
    data: { keepaStarted: true },
  });

  const keepaTaskCount = await getTaskCount({
    clusterName: isProd ? "ProdScraperECSCluster" : "DevScraperECSCluster",
    serviceName: "keepaService",
  });

  if (keepaTaskCount === 0) {
    await modifyTaskCount({
      clusterName: isProd ? "ProdScraperECSCluster" : "DevScraperECSCluster",
      serviceName: "keepaService",
      incrememntBy: KEEPA_TASK_COUNT,
    });
  }
}

async function handleStartupScripts() {
  const scraperStatus = await prisma.scraperStatus.findFirst({
    where: { id: 1 },
  });

  if (!scraperStatus) return;

  if (!scraperStatus.gptTitleMatchStarted) await handleStartGptTitleMatch();
  if (!scraperStatus.keepaStarted) await handleStartKeepa();
  if (!scraperStatus.deletedOldProducts) await handleDestroyOldProductData();
}

async function cleanupForExit(exitCode: 0 | 1) {
  console.log(`exiting pdp. PID: ${serverPID}`);
  await unlockAllProductIndexes(prisma, serverPID);
  await prisma.$disconnect();
  process.exit(exitCode);
}

async function start() {
  try {
    console.log(`starting pdp. PID: ${serverPID}`);
    await handleStartupScripts();
    await startAmazon(prisma, serverPID);
    await cleanupForExit(0);
  } catch (err) {
    console.log(err);
    await cleanupForExit(1);
  }
}

start();
