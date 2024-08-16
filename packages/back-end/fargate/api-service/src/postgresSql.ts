import { PrismaClient } from "../../../prisma/generated/client";
import { psqlUri } from "../../../shared/envVars";

export default async function () {
  try {
    return new PrismaClient({
      datasources: {
        db: {
          url: psqlUri,
        },
      },
    });
  } catch (e) {
    console.error(e);
    throw new Error("Failed to connect to Prisma");
  }
}
