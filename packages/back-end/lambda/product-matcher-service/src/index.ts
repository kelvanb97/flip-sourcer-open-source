import { Handler, Context } from "aws-lambda";
import { calculateSimilarityScore } from "./calculateSimilarityScore";
import {
  CalculateSimilarityScoreProps,
  CalculateSimilarityScoreResult,
} from "../../../../types/CalculateSimilarityScore";

export const similarityScoreHandler: Handler = async (
  event: { body: string },
  _context: Context
) => {
  console.log("starting similarityScoreHandler");
  const body: CalculateSimilarityScoreProps = JSON.parse(event.body);

  try {
    const similarityScore: CalculateSimilarityScoreResult | null =
      await calculateSimilarityScore(body);
    return {
      statusCode: 200,
      body: JSON.stringify(similarityScore),
    };
  } catch (error) {
    console.log("Error", error);
    return {
      statusCode: 500,
      body: "Error processing request",
    };
  }
};
