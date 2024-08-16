export const passwordValidationRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/;
export const emailValidationRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function regexGetPrice(val: string): string {
  val = val.replace(/[^0-9.]/g, "");
  const match = val.match(/(\d+\.?\d*)/g);
  if (!match) return "";
  return match[0];
}
