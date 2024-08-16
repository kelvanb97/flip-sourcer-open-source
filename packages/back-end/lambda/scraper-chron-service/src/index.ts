import { Handler, Context } from "aws-lambda";
import { scraperChron } from "./scraperChron";

export const scraperChronHandler: Handler = async (
  _event: { body: string },
  _context: Context
) => {
  console.log("starting scraperChronHandler");

  try {
    await scraperChron();
    return { statusCode: 200 };
  } catch (error) {
    console.log("Error", error);
    return {
      statusCode: 500,
      body: "Error processing request",
    };
  }
};
