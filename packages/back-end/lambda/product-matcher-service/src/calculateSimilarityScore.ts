import * as use from "@tensorflow-models/universal-sentence-encoder";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs-node";
import axios from "axios";
import sharp from "sharp";
import {
  CalculateSimilarityScoreProps,
  CalculateSimilarityScoreResult,
} from "../../../../types/CalculateSimilarityScore";

async function downloadImage(imageUrl: string): Promise<Buffer | null> {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        timeout: 30000,
      });
      return Buffer.from(response.data, "binary");
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        console.log(
          `Failed to download image after multiple attempts: ${imageUrl}`
        );
        return null;
      }
    }
  }

  throw new Error("Unexpected error"); // This line should never be reached
}

async function bufferToTensor(imageBuffer: Buffer): Promise<tf.Tensor3D> {
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const tensor = tf.tensor3d(data, [info.height, info.width, info.channels]);
  return tensor;
}

async function detectObjects(
  imageBuffer: Buffer,
  objectModel: cocoSsd.ObjectDetection
) {
  const imageMetadata = await sharp(imageBuffer).metadata();
  if (!imageMetadata.width || !imageMetadata.height)
    throw new Error("Image metadata is missing");

  const imageTensor = await bufferToTensor(imageBuffer);
  const predictions = await objectModel.detect(imageTensor);

  // If no objects are detected, return the original image
  if (predictions.length === 0) {
    return {
      buffer: imageBuffer,
      width: imageMetadata.width,
      height: imageMetadata.height,
    };
  }

  const largestObject = predictions.reduce((prev, current) =>
    prev.bbox[2] * prev.bbox[3] > current.bbox[2] * current.bbox[3]
      ? prev
      : current
  );

  if (largestObject) {
    const { bbox } = largestObject;
    let [x, y, width, height] = bbox;

    x = Math.max(0, x);
    y = Math.max(0, y);
    width = Math.min(imageMetadata.width - x, width);
    height = Math.min(imageMetadata.height - y, height);

    const croppedImageBuffer = await sharp(imageBuffer)
      .extract({
        left: Math.round(x),
        top: Math.round(y),
        width: Math.round(width),
        height: Math.round(height),
      })
      .toBuffer();

    return { buffer: croppedImageBuffer, width: width, height: height };
  }

  return {
    buffer: imageBuffer,
    width: imageMetadata.width,
    height: imageMetadata.height,
  };
}

async function scaleAndCrop(
  imageBuffer: Buffer,
  initialScaleFactor: number
): Promise<Buffer> {
  const imageMetadata = await sharp(imageBuffer).metadata();
  if (!imageMetadata.width || !imageMetadata.height)
    throw new Error("Image metadata is missing");

  // First Scaling
  const firstScaledImageBuffer = await sharp(imageBuffer)
    .resize({ width: Math.round(initialScaleFactor * imageMetadata.width) })
    .png()
    .toBuffer();

  const firstScaledMetadata = await sharp(firstScaledImageBuffer).metadata();
  if (!firstScaledMetadata.width || !firstScaledMetadata.height)
    throw new Error("Image metadata is missing");

  // Calculate the size of the square to extract
  const squareSize = firstScaledMetadata.width * 0.9;

  // Calculate the top left coordinates of the square
  const left = (firstScaledMetadata.width - squareSize) / 2;
  const top = (firstScaledMetadata.height - squareSize) / 2;

  // Extract the square from the image
  const croppedImageBuffer = await sharp(firstScaledImageBuffer)
    .extract({
      left: Math.round(left),
      top: Math.max(0, Math.round(top)),
      width: Math.min(
        Math.round(squareSize),
        firstScaledMetadata.width - Math.round(left)
      ),
      height: Math.min(
        Math.round(squareSize),
        firstScaledMetadata.height - Math.max(0, Math.round(top))
      ),
    })
    .png()
    .toBuffer();

  return croppedImageBuffer;
}

async function calculateImageSimilarity(
  retailerImageBuffer: Buffer,
  amazonImageBuffer: Buffer,
  imageModel: mobilenet.MobileNet
) {
  const retailerImageTensor = await bufferToTensor(retailerImageBuffer);
  const amazonImageTensor = await bufferToTensor(amazonImageBuffer);

  const retailerImageVector = imageModel.infer(retailerImageTensor, true);
  const amazonImageVector = imageModel.infer(amazonImageTensor, true);

  retailerImageTensor.dispose();
  amazonImageTensor.dispose();

  const retailerImageVectorNormalized = retailerImageVector.div(
    tf.norm(retailerImageVector)
  );
  const amazonImageVectorNormalized = amazonImageVector.div(
    tf.norm(amazonImageVector)
  );

  retailerImageVector.dispose();
  amazonImageVector.dispose();

  const dotProduct = tf
    .sum(retailerImageVectorNormalized.mul(amazonImageVectorNormalized))
    .dataSync()[0];

  retailerImageVectorNormalized.dispose();
  amazonImageVectorNormalized.dispose();

  return (dotProduct + 1) / 2;
}

async function calculateTextSimilarity(
  retailerProductName: string,
  amazonProductName: string,
  textModel: use.UniversalSentenceEncoder
) {
  // Generate text embeddings
  const textEmbeddings = await textModel.embed([
    retailerProductName,
    amazonProductName,
  ]);

  // Calculate text similarity
  const textSimilarity =
    1 -
    tf.losses
      .cosineDistance(
        textEmbeddings.slice([0, 0], [1, -1]),
        textEmbeddings.slice([1, 0], [1, -1]),
        1
      )
      .dataSync()[0];

  textEmbeddings.dispose();

  return textSimilarity;
}

export async function calculateSimilarityScore({
  retailer,
  amazon,
}: CalculateSimilarityScoreProps): Promise<CalculateSimilarityScoreResult | null> {
  try {
    const textModel = await use.load();
    const imageModel = await mobilenet.load();
    const objectModel = await cocoSsd.load();

    const retailerImage = await downloadImage(retailer.imageUrl);
    const amazonImage = await downloadImage(amazon.imageUrl);

    let imageSimilarityScore: number | null = null;
    if (retailerImage && amazonImage) {
      const retailerObjectImage = await detectObjects(
        retailerImage,
        objectModel
      );
      const amazonObjectImage = await detectObjects(amazonImage, objectModel);

      let scaleFactor;
      let retailerFinalImageBuffer, amazonFinalImageBuffer;

      if (retailerObjectImage.width > amazonObjectImage.width) {
        scaleFactor = retailerObjectImage.width / amazonObjectImage.width;
        amazonFinalImageBuffer = await scaleAndCrop(
          amazonObjectImage.buffer,
          scaleFactor
        );
        retailerFinalImageBuffer = await scaleAndCrop(
          retailerObjectImage.buffer,
          1
        ); // no scaling
      } else {
        scaleFactor = amazonObjectImage.width / retailerObjectImage.width;
        retailerFinalImageBuffer = await scaleAndCrop(
          retailerObjectImage.buffer,
          scaleFactor
        );
        amazonFinalImageBuffer = await scaleAndCrop(
          amazonObjectImage.buffer,
          1
        ); // no scaling
      }

      imageSimilarityScore = await calculateImageSimilarity(
        retailerFinalImageBuffer,
        amazonFinalImageBuffer,
        imageModel
      );
    }
    const textSimilarityScore = await calculateTextSimilarity(
      retailer.productName,
      amazon.productName,
      textModel
    );

    //If we cannot get the image similarity score, use the text similarity score
    if (!imageSimilarityScore)
      return {
        imageSimilarityScore: -1,
        textSimilarityScore,
        score: textSimilarityScore,
      };

    const scoreSum = imageSimilarityScore + textSimilarityScore;

    const normalizedScore = Math.round((scoreSum / 2) * 10000) / 100;

    console.log("Image similarity score: ", imageSimilarityScore);
    console.log("Text similarity score: ", textSimilarityScore);
    console.log("Normalized score: ", normalizedScore);

    return {
      imageSimilarityScore,
      textSimilarityScore,
      score: normalizedScore,
    };
  } catch (err) {
    console.log("TensorFlow Error: calculateSimilarityScore()");
    console.log(retailer);
    console.log(amazon);
    console.log(err);
    return null;
  }
}
