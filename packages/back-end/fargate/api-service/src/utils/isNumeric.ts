export function isNumeric(str: string) {
  //@ts-ignore
  return !isNaN(str) && !isNaN(parseFloat(str));
}
