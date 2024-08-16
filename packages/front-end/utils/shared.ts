export const truncStr = (str: string, distance: number) =>
  str.length > distance ? str.slice(0, distance - 3) + "..." : str;

export const toDisplayNumber = (x: number) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function toPrice(
  price: number,
  gapBetweenDollarSignAndPrice: boolean = false
) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (gapBetweenDollarSignAndPrice) {
    return formatter.format(price).replace("$", "$ ");
  }

  return formatter.format(price);
}

export function dateToDisplayDate(date: Date, longForm: boolean = false) {
  date = new Date(date);

  if (longForm) {
    return `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getDate()}, ${date.getFullYear()}`;
  }

  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export function roundToHundredths(x: number) {
  return Math.round(x * 100) / 100;
}
