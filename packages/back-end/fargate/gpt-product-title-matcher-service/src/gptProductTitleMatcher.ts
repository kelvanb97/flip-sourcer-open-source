import { prisma } from ".";
import { gpt_3_5_turbo } from "../../../shared/openAi";
import {
  GPT_TITLE_MATCH_DESIRED_SCORE,
  GPT_TITLE_MATCH_ITERATIONS,
  GPT_THROW_OUT_SCORE,
  GPT_TITLE_MATCH_CONCURRENCY_LIMIT,
} from "../../../shared/constants";
import { stage } from "../../../shared/envVars";
import { modifyTaskCount } from "../../../shared/aws/ecs";
import { deleteProduct } from "../../../shared/general";

const ONE_MIN_MS = 60 * 1000;
const WAIT_TIME = ONE_MIN_MS;
const MAX_MISSES = 5;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getSameTitlesQuestion(productNameOne: string, productNameTwo: string) {
  return `Product titles are for the same product, yes or no? Make sure brand, quantity, size, color, voltage, variant, etc are the same. If you are unsure the answer is no.
  ${productNameOne}
  ${productNameTwo}`;
}

function messageContentToScore(messageContent: string): number | null {
  messageContent = messageContent.toLowerCase();

  if (messageContent.includes("yes")) {
    return 1;
  } else if (messageContent.includes("no")) {
    return -1;
  } else {
    return null;
  }
}

async function getProductsToPoll() {
  try {
    const productsToPoll = await prisma.product.findMany({
      where: {
        gptTitleMatchIterations: {
          lt: GPT_TITLE_MATCH_ITERATIONS,
        },
        gptTitleMatchLock: false,
      },
      include: {
        amazonInfo: true,
        retailerInfo: true,
      },
      take: GPT_TITLE_MATCH_CONCURRENCY_LIMIT,
    });

    return productsToPoll;
  } catch {
    return null;
  }
}

async function setLock(productId: number) {
  await prisma.product.update({
    where: { id: productId },
    data: { gptTitleMatchLock: true },
  });
}

async function releaseLock(productId: number) {
  await prisma.product.update({
    where: { id: productId },
    data: { gptTitleMatchLock: false },
  });
}

async function handleMiss() {
  numMisses++;
  console.log(`Miss ${numMisses}/${MAX_MISSES}`);
  await sleep(ONE_MIN_MS * 5);

  if (numMisses >= MAX_MISSES) {
    console.log("No products to poll");
    await modifyTaskCount({
      clusterName: `${stage === "dev" ? "Dev" : "Prod"}ScraperECSCluster`,
      serviceName: "gptProductTitleMatcherService",
    });
    process.exit(0);
  }
  return;
}

let numMisses = 0;

export async function pollProductTitles() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const productsToPoll = await getProductsToPoll();

    //Handle miss
    if (!productsToPoll || productsToPoll.length === 0) {
      console.log("miss");
      await handleMiss();
      continue;
    }

    const promises = productsToPoll.map(async (productToPoll) => {
      try {
        await setLock(productToPoll.id);

        numMisses = 0;
        console.log(`\n\nStarting for product: ${productToPoll.id}`);

        const sameTitlesQuestion = getSameTitlesQuestion(
          productToPoll.retailerInfo.productName,
          productToPoll.amazonInfo.productName
        );

        let loopErrorCount = 0;
        let gptTitleMatchScore = productToPoll.gptTitleMatchScore;
        let gptTitleMatchIterations = productToPoll.gptTitleMatchIterations;
        while (gptTitleMatchIterations < GPT_TITLE_MATCH_ITERATIONS) {
          const gptMatchResponse = await gpt_3_5_turbo(sameTitlesQuestion);

          if (gptMatchResponse.status === 429) {
            console.log("gpt_3_5_turbo rate limit reached");
            await sleep(WAIT_TIME);
            continue;
          } else if (gptMatchResponse.status !== 200) {
            console.log(`gpt_3_5_turbo bad status ${gptMatchResponse.status}`);
            await sleep(WAIT_TIME);
            gptTitleMatchIterations++;
            continue;
          }

          if (!gptMatchResponse.content) {
            console.log("gpt_3_5_turbo response empty");
            loopErrorCount++;
            if (loopErrorCount >= 3) gptTitleMatchIterations++;

            continue;
          }

          const score = messageContentToScore(gptMatchResponse.content);

          if (score === null) {
            console.log("score === null");
            loopErrorCount++;
            if (loopErrorCount >= 3) gptTitleMatchIterations++;

            continue;
          }

          gptTitleMatchScore += score;
          gptTitleMatchIterations++;

          if (gptTitleMatchScore <= GPT_THROW_OUT_SCORE) {
            console.log(`Throwing out product: ${productToPoll.id}`);
            break;
          }

          console.log(
            `Total score: ${gptTitleMatchScore},iterations: ${gptTitleMatchIterations}`
          );
        }

        if (gptTitleMatchScore < GPT_TITLE_MATCH_DESIRED_SCORE) {
          await deleteProduct({
            productId: productToPoll.id,
            retailerInfoId: productToPoll.retailerInfoId,
            prisma,
          });
        } else {
          await prisma.product.update({
            where: { id: productToPoll.id },
            data: { gptTitleMatchScore, gptTitleMatchIterations },
          });
        }
      } catch (e) {
        if (productToPoll) await releaseLock(productToPoll.id);

        console.log("Error in keepa poller");
        console.log(e);
      }
    });

    await Promise.all(promises);
  }
}
