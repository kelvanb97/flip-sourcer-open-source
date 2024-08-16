import { PlanName } from "../../types/Stripe";

const features = [
  "7 day free trial",
  "Powerful filtering",
  "Profit analytics",
  "Free updates",
  "Unlimited support",
];

export interface ProductProps {
  planName: PlanName;
  price: number;
  frequency: "month" | "year";
  features: string[];
  description?: string;
  subdescription?: string;
  disabled?: boolean;
}

export const products: ProductProps[] = [
  {
    planName: "Flip Sourcer Pro",
    price: 89,
    frequency: "month",
    features: [...features],
  },
  {
    planName: "Flip Sourcer Pro Annual",
    price: 75,
    frequency: "month",
    description: "Save over 15% by paying annually.",
    subdescription: "Billed as $900/year.",
    features: [...features],
  },
];
