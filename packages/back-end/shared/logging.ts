import { loggingEnabled } from "./envVars";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";

export interface LoggingProps {
  fileName: string;
  directory: "scraperApi" | "tensorFlow" | "other";
  fileType: string;
  loggingData: string | Buffer;
}

export function handleLogging(loggingProps: LoggingProps | null): void {
  try {
    if (loggingEnabled && loggingProps) {
      const { fileName, directory, fileType, loggingData } = loggingProps;
      const filePath = join(
        __dirname,
        `../logs/${directory}/${fileName}${fileType}`
      );

      // Check if the directory exists and create it if not
      const directoryPath = dirname(filePath);
      if (!existsSync(directoryPath)) {
        mkdirSync(directoryPath, { recursive: true });
      }

      writeFileSync(filePath, loggingData);
    }
  } catch {
    //do nothing, not important
  }
}

interface LogTensorFlowImagesProps {
  retailer: [Buffer, Buffer];
  amazon: [Buffer, Buffer];
}

export async function logTensorFlowImages({
  retailer: [retailerImage, retailerObjectImage],
  amazon: [amazonImage, amazonObjectImage],
}: LogTensorFlowImagesProps) {
  // RETAILER
  handleLogging({
    fileName: "origRetailer",
    directory: "tensorFlow",
    fileType: ".png",
    loggingData: retailerImage,
  });
  handleLogging({
    fileName: "tensorRetailer",
    directory: "tensorFlow",
    fileType: ".png",
    loggingData: retailerObjectImage,
  });

  // AMAZON
  handleLogging({
    fileName: "origAmazon",
    directory: "tensorFlow",
    fileType: ".png",
    loggingData: amazonImage,
  });
  handleLogging({
    fileName: "tensorAmazon",
    directory: "tensorFlow",
    fileType: ".png",
    loggingData: amazonObjectImage,
  });
}
