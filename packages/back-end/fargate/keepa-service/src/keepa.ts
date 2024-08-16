import { prisma } from ".";
import { getKeepaData } from "../../../shared/keepa";
import { keepaApiKey } from "../../../shared/envVars";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function pollKeepaData() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const productToPoll = await prisma.product.findFirst({
        where: {
          valueByCondition: {
            some: {
              type: "lowest-offer-by-condition",
            },
          },
          amazonInfo: {
            salesRankFlat: {
              not: null,
              lte: 100000,
            },
          },
        },
        include: {
          valueByCondition: true,
          amazonInfo: true,
          retailerInfo: true,
        },
        orderBy: {
          amazonInfo: {
            lastKeepaPollTime: {
              sort: "asc",
              nulls: "first",
            },
          },
        },
      });

      if (!productToPoll || !productToPoll.amazonInfo) {
        console.log("Invalid amazon info");
        await sleep(5 * 60 * 1000);
        continue;
      }

      const amazonInfoToPoll = productToPoll.amazonInfo;

      const { keepaDataPayload, waitTime } = await getKeepaData(
        keepaApiKey,
        amazonInfoToPoll.asin,
        productToPoll.retailerInfoId,
        prisma
      );

      if (!keepaDataPayload) {
        console.log("Invalid keepa data payload");
        await sleep(waitTime);
        continue;
      }

      // Save result
      await prisma.amazonInfo.update({
        where: {
          id: amazonInfoToPoll.id,
        },
        data: keepaDataPayload,
      });
      console.log("Successfully updated keepa data for", amazonInfoToPoll.asin);
      console.log(`Waiting ${waitTime / 1000}secs before next poll`);

      // Sleep
      await sleep(waitTime);
    } catch (e) {
      console.log("Error in keepa poller");
      console.log(e);
    }
  }
}
