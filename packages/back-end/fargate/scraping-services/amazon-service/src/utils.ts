import {
  PrismaClient,
  RetailerProductIndex,
} from "../../../../prisma/generated/client";
import { NUM_PDP_PAGES_TO_SCRAPE_AT_A_TIME } from "../../../../shared/constants";
import { load as universaleSentenceEncoderLoad } from "@tensorflow-models/universal-sentence-encoder";
import {
  sum as tfSum,
  mul as tfMul,
  norm as tfNorm,
} from "@tensorflow/tfjs-node";
import { CalculateSimilarityScoreResult } from "../../../../../types/CalculateSimilarityScore";
import axios, { AxiosError } from "axios";
import { stage } from "../../../../shared/envVars";

//hack: way to validate the lock
export async function getIsLockValid(
  retailerIndexId: number,
  serverPID: string,
  prisma: PrismaClient
): Promise<boolean> {
  const retailerIndexFromDb = await prisma.retailerProductIndex.findUnique({
    where: { id: retailerIndexId },
  });

  if (!retailerIndexFromDb || retailerIndexFromDb.lockedBy !== serverPID) {
    return false;
  }

  return true;
}

//hack: way to avoid race conditions for locks (at least partially)
//I hate this solution but transactions bogged down the db too much
export async function getRetailerIndexesToScrape(
  prisma: PrismaClient,
  serverPID: string
) {
  const productIndexes = await prisma.$queryRawUnsafe<RetailerProductIndex[]>(
    `SELECT * FROM "RetailerProductIndex" 
    WHERE "locked" = false 
    ORDER BY RANDOM() 
    LIMIT ${NUM_PDP_PAGES_TO_SCRAPE_AT_A_TIME.toString()}`
  );

  for (const productIndex of productIndexes) {
    try {
      await prisma.retailerProductIndex.update({
        where: { id: productIndex.id },
        data: { locked: true, lockedBy: serverPID },
      });
    } catch (e) {
      console.log("error locking product index", e);
    }
  }

  return productIndexes;
}

export async function handleIndexByState(
  state: "success" | "error",
  retailerIndex: RetailerProductIndex,
  serverPID: string,
  prisma: PrismaClient
) {
  if (state === "success") {
    console.log(
      "deleting index that has successfully scraped",
      retailerIndex.productLink
    );
    await prisma.retailerProductIndex.delete({
      where: { id: retailerIndex.id },
    });
  } else {
    console.log("deleting index regardless of error count");
    await prisma.retailerProductIndex.deleteMany({
      where: { id: retailerIndex.id, lockedBy: serverPID },
    });
  }
}

export async function unlockAllProductIndexes(
  prisma: PrismaClient,
  serverPID: string
) {
  await prisma.retailerProductIndex.updateMany({
    where: { lockedBy: serverPID },
    data: {
      locked: false,
      lockedBy: "",
    },
  });
}

interface GetProductNameMatchScoreProps {
  retailerProductName: string;
  amazonProductName: string;
}

export async function getProductNameMatchScore({
  retailerProductName,
  amazonProductName,
}: GetProductNameMatchScoreProps): Promise<CalculateSimilarityScoreResult | null> {
  const textModel = await universaleSentenceEncoderLoad();

  const textEmbeddings = await textModel.embed([
    retailerProductName,
    amazonProductName,
  ]);

  // Get embeddings for each product name
  const retailerEmbedding = textEmbeddings.slice([0, 0], [1, -1]);
  const amazonEmbedding = textEmbeddings.slice([1, 0], [1, -1]);

  // Calculate cosine similarity
  const dotProduct = tfSum(tfMul(retailerEmbedding, amazonEmbedding));
  const retailerNorm = tfNorm(retailerEmbedding, "euclidean");
  const amazonNorm = tfNorm(amazonEmbedding, "euclidean");
  const cosineSimilarity = dotProduct.div(retailerNorm.mul(amazonNorm));

  const textSimilarity = cosineSimilarity.dataSync()[0];

  textEmbeddings.dispose();

  return {
    imageSimilarityScore: -1,
    textSimilarityScore: textSimilarity,
    score: textSimilarity,
  };
}

interface GetProductMatchScoreProps {
  retailer: {
    productName: string;
    imageUrl: string;
  };
  amazon: {
    productName: string;
    imageUrl: string;
  };
}

export async function getProductMatchScore({
  retailer,
  amazon,
}: GetProductMatchScoreProps): Promise<CalculateSimilarityScoreResult | null> {
  let retries = 0;

  while (retries < 3) {
    try {
      const res = await axios.post<CalculateSimilarityScoreResult>(
        `https://${stage}-lambda.flipsourcerapi.com/calculate-product-similarity-score`,
        {
          retailer: {
            productName: retailer.productName,
            imageUrl: retailer.imageUrl,
          },
          amazon: {
            productName: amazon.productName,
            imageUrl: amazon.imageUrl,
          },
        }
      );

      if (res.data) {
        console.log("getProductMatchScore res: ", res.data.score);
        return res.data;
      }

      return null;
    } catch (err) {
      retries++;

      const axiosError = err as AxiosError;
      console.log("Error calling getProductMatchScore: ", axiosError.message);

      if (axiosError.response?.status === 504) return null; //don't retry on timeout
    }
  }

  return null;
}
