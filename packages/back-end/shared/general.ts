import { PrismaClient } from "../prisma/generated/client";

interface DeleteProductProps {
  productId: number;
  retailerInfoId: number;
  prisma: PrismaClient;
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//Do not delete amazonInfo because other products may rely on it
export async function deleteProduct({
  productId,
  retailerInfoId,
  prisma,
}: DeleteProductProps): Promise<void> {
  try {
    await prisma.retailerHistoricalData.deleteMany({
      where: { retailerInfoId: retailerInfoId },
    });
  } catch (error) {
    console.error("Error deleteProduct() retailerHistoricalData:", error);
  }
  try {
    await prisma.valueByCondition.deleteMany({
      where: { productId: productId },
    });
  } catch (error) {
    console.error("Error deleteProduct() valueByCondition:", error);
  }
  try {
    await prisma.product.delete({ where: { id: productId } });
  } catch (error) {
    console.error("Error deleteProduct() product:", error);
  }
  try {
    await prisma.retailerInfo.delete({ where: { id: retailerInfoId } });
  } catch (error) {
    console.error("Error deleteProduct() retailerInfo:", error);
  }
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const results = [];
  while (array.length) {
    results.push(array.splice(0, size));
  }
  return results;
}
