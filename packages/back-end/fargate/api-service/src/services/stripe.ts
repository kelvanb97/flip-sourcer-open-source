import Stripe from "stripe";
import { PaymentMethod, PlanInfo, PlanName } from "../../../../../types/Stripe";
import { UserInterface } from "../../../../../types/User";
import { stripeSecretKey, stage } from "../../../../shared/envVars";
import { PrismaClient } from "../../../../prisma/generated/client";

const stripe = new Stripe(stripeSecretKey, { apiVersion: "2022-08-01" });

export async function chargeCard(
  user: UserInterface,
  amountInDollars: number,
  description: string
) {
  const createPaymentIntent = await stripe.paymentIntents.create({
    customer: user.stripe.customerId,
    setup_future_usage: "off_session",
    amount: amountInDollars * 100,
    currency: "usd",
    description: description,
  });
  if (!createPaymentIntent) throw new Error("Could not create payment intent");

  const confirmPaymentIntent = await stripe.paymentIntents.confirm(
    createPaymentIntent.id,
    { payment_method: user.stripe.defaultPaymentMethodId }
  );
  if (!confirmPaymentIntent)
    throw new Error("Could not confirm payment intent");

  return { success: true };
}

export async function createCustomer(email: string) {
  const customer = await stripe.customers.create({
    email: email,
  });

  return customer;
}

export async function getCustomer(customerId: string) {
  return await stripe.customers.retrieve(customerId);
}

export async function createSetupIntent(customerId: string) {
  return await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ["card"],
  });
}

export async function deleteCustomer(customerId: string) {
  return await stripe.customers.del(customerId);
}

export async function getPaymentMethods(customerId: string) {
  const paymentMethodsRes = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });

  const paymentMethods: PaymentMethod[] =
    paymentMethodsRes.data.length > 0
      ? (paymentMethodsRes.data.map((pm) => {
          if (pm.card) {
            return {
              id: pm.id,
              brand: pm.card.brand,
              last4: pm.card.last4,
              exp_month: pm.card.exp_month,
              exp_year: pm.card.exp_year,
            };
          }
        }) as PaymentMethod[])
      : [];

  return paymentMethods;
}

export async function getSubscription(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
  });

  if (subscriptions.data.length > 0) {
    return subscriptions.data[0];
  } else {
    return null;
  }
}

export async function handleSetDefaultPaymentMethod(
  user: UserInterface,
  paymentMethodId: string,
  prisma: PrismaClient
) {
  await prisma.stripeInfo.updateMany({
    where: {
      user: {
        id: user.id,
      },
    },
    data: {
      ...user.stripe,
      defaultPaymentMethodId: paymentMethodId,
    },
  });

  //Update the stripe default payment method
  await stripe.customers.update(user.stripe.customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
}

export function getPlanInfo(plan: PlanName): PlanInfo {
  if (plan === "Flip Sourcer Pro") {
    return {
      productCost: 89,
      recurringType: "month",
      productId:
        stage === "dev" ? "prod_NFJ2WOZkG5oh4v" : "prod_NFJ8nKNywviwHJ",
    };
  } else if (plan === "Flip Sourcer Pro Annual") {
    return {
      productCost: 900,
      recurringType: "year",
      productId:
        stage === "dev" ? "prod_NFJ7tLtucLiE24" : "prod_NFJ9tlqFpFX8pt",
    };
  } else {
    throw new Error("Unaccounted for plan");
  }
}

export function getPlanNameFromProductId(productId: string): PlanName {
  if (
    productId === "prod_NFJ2WOZkG5oh4v" ||
    productId === "prod_NFJ8nKNywviwHJ"
  ) {
    return "Flip Sourcer Pro";
  } else if (
    productId === "prod_NFJ7tLtucLiE24" ||
    productId === "prod_NFJ9tlqFpFX8pt"
  ) {
    return "Flip Sourcer Pro Annual";
  } else {
    throw new Error("Unaccounted for product");
  }
}

export function getTrialLength(days: number) {
  return Math.floor(Date.now() / 1000) + 60 * 60 * 24 * days;
}
