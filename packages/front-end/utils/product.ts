import { Discount } from "../../types/Filters";
import { Fee } from "../../types/Product";
import { GeneralSettings } from "../../types/User";
import { ProductAnalysisMeta } from "../components/dashboard/features/products/productCard/Analysis";
import { roundToHundredths } from "./shared";

export function getSumOfDiscounts(cogs: number, discount: Discount) {
  if (!discount.enabled) return 0;

  if (discount.type === "flat") {
    return discount.flat;
  } else {
    const discountedTotal = cogs * Math.abs((discount.percent - 100) / 100);

    //the difference between the purchase total and the discounted total is the sum of discounts
    const sumOfDiscounts = cogs - discountedTotal;
    return roundToHundredths(sumOfDiscounts);
  }
}

interface CalculateMetaByConditionProps {
  retailerCost: number | null;
  salePricePerUnit: number | undefined;
  cashback: {
    flat: number;
    percent: number;
  };
  fees: Fee[];
  discount: Discount;
  numUnits?: number;
  customFees?: number;
  customRewards?: number;
}

export function calculateMetaByCondition({
  retailerCost,
  salePricePerUnit,
  cashback,
  fees,
  discount,
  numUnits = 1,
  customFees = 0,
  customRewards = 0,
}: CalculateMetaByConditionProps): ProductAnalysisMeta {
  if (!salePricePerUnit || !retailerCost || !numUnits) {
    return {
      profit: undefined,
      roi: undefined,
      cogs: undefined,
      effectiveCogs: undefined,
      cashbackSum: undefined,
      discountSum: undefined,
    };
  }

  //no cashback or discounts
  const cogs = retailerCost * numUnits;

  const sumOfDiscounts = getSumOfDiscounts(cogs, discount);

  //purchase price after discounts
  const cogsIncludingDiscounts = cogs - sumOfDiscounts;

  const sumOfCashback = getCashback(
    cogsIncludingDiscounts,
    cashback.flat,
    cashback.percent
  );

  const sumOfCustomRewards = customRewards * numUnits;

  //cogs after cashback and discounts
  const effectiveCogs =
    Math.round(
      (cogsIncludingDiscounts - sumOfCashback - sumOfCustomRewards) * 100
    ) / 100;

  const revenue = salePricePerUnit * numUnits;

  const feesPerUnit = calculateTotalFees(fees);
  const feesTotal = feesPerUnit * numUnits + customFees * numUnits;

  const profit = Math.round((revenue - effectiveCogs - feesTotal) * 100) / 100;
  const roi = (profit / effectiveCogs) * 100;

  return {
    profit,
    roi,
    cogs,
    effectiveCogs,
    cashbackSum: sumOfCashback,
    discountSum: sumOfDiscounts,
  };
}

export function calculateTotalFees(fees: Fee[]) {
  return fees.reduce((sum, fee) => sum + fee.value, 0);
}

export function getCashback(
  purchasePrice: number,
  cashbackFlat: number,
  cashbackPercent: number
) {
  const cashbackPercentInDollars = (cashbackPercent / 100) * purchasePrice;
  const cashback = cashbackFlat + cashbackPercentInDollars;

  return cashback;
}

export function getUserRelatedFees(
  generalSettings: GeneralSettings,
  salePrice: number,
  weightInPounds: number
) {
  const fees: Fee[] = [];

  fees.push({
    from: "flipsourcer",
    name: "Per unit $",
    value: generalSettings.perUnitCosts.flat,
  });
  fees.push({
    from: "flipsourcer",
    name: "Per unit %",
    value: (generalSettings.perUnitCosts.percent / 100) * salePrice,
  });
  fees.push({
    from: "flipsourcer",
    name: "Shipping weight",
    value: generalSettings.shippingCosts.perPound * weightInPounds,
  });
  fees.push({
    from: "flipsourcer",
    name: "Shipping per unit",
    value: generalSettings.shippingCosts.perUnit,
  });

  return fees;
}
