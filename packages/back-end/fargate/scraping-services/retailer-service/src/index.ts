import { retailerStart } from "./retailer";
import { PrismaClient } from "../../../../prisma/generated/client";
import { unlockAllBookmarks } from "./utils";

const prisma = new PrismaClient();
const serverPID = Date.now().toString(36);

async function cleanupForExit(exitCode: 0 | 1) {
  console.log(`exiting catalog. PID: ${serverPID}`);
  await unlockAllBookmarks(prisma, serverPID);
  await prisma.$disconnect();
  process.exit(exitCode);
}

async function start() {
  try {
    console.log(`starting catalog. PID: ${serverPID}`);
    await retailerStart(prisma, serverPID);
    await cleanupForExit(0);
  } catch (err) {
    console.log(err);
    await cleanupForExit(1);
  }
}

start();
