export interface PaymentMethod {
  id: string;
  isDefault: boolean;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

export type PlanName =
  | "Free trial"
  | "Flip Sourcer Pro"
  | "Flip Sourcer Pro Annual";

export interface PlanInfo {
  productCost: number;
  recurringType: "month" | "year";
  productId: string;
}

export interface SubscriptionInfo {
  planName: PlanName;
  subStatus: string;
  isTrialing: boolean;
  renewsOn: Date;
  cancelAtEnd: boolean;
}
