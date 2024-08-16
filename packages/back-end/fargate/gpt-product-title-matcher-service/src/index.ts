import { PrismaClient } from "../../../prisma/generated/client";
import { pollProductTitles } from "./gptProductTitleMatcher";

export const prisma = new PrismaClient();

export const serverPID = Date.now().toString(36);

async function start() {
  try {
    console.log(`starting gptProductTitleMatcher PID: ${serverPID}`);
    await pollProductTitles();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

start();
