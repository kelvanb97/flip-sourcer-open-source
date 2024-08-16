export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//addition of randomness to avoid bot detection
export async function waitForPageToLoad(ms: number) {
  await sleep(ms + Math.floor(Math.random() * 500));
}

export function priceStrToNum(price: string | undefined | null): number | null {
  if (!price) return null;

  const formattedPrice = price.trim().replace(/[^0-9.]/g, "");

  const priceNum = parseFloat(formattedPrice);
  if (isNaN(priceNum)) return null;

  return parseFloat(priceNum.toFixed(2));
}

export function standardizeString(input: string): string {
  // Convert to lowercase and remove special characters
  let standardizedInput = input.toLowerCase().replace(/[^a-z0-9\s]/g, "");

  // Replace double spaces with single spaces
  standardizedInput = standardizedInput.replace(/\s{2,}/g, " ");

  return standardizedInput;
}

export function isNumber(str: string): boolean {
  return !isNaN(parseFloat(str));
}
