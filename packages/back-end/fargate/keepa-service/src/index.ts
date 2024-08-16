import { PrismaClient } from "../../../prisma/generated/client";
import { pollKeepaData } from "./keepa";

export const prisma = new PrismaClient();

export const serverPID = Date.now().toString(36);

async function start() {
  try {
    console.log("starting serverPID: ", serverPID);
    console.log("starting keepa");
    await pollKeepaData();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

start();
