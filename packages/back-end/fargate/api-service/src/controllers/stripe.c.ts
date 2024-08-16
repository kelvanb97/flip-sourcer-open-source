import Stripe from "stripe";
import {
  createSetupIntent,
  getPaymentMethods,
  getPlanInfo,
  getPlanNameFromProductId,
  getSubscription,
  getTrialLength,
  handleSetDefaultPaymentMethod,
} from "../services/stripe";
import { AuthRequest, Response } from "../../types/AuthRequest";
import { stripeSecretKey } from "../../../../shared/envVars";
import {
  SubscriptionInfo,
  PaymentMethod,
  PlanName,
} from "../../../../../types/Stripe";
import { handleMailchimpBasedOnStripeSubscriptionStatus } from "../services/mailchimp";
import { PrismaClient } from "../../../../prisma/generated/client";
import { sesSendEmail } from "../../../../shared/aws/ses";
const prisma = new PrismaClient();

const stripe = new Stripe(stripeSecretKey, { apiVersion: "2022-08-01" });

export async function initPaymentMethod(
  req: AuthRequest,
  res: Response<{ client_secret: string }>
) {
  const {
    stripe: { customerId },
  } = req.user;

  const setupIntentRes = await createSetupIntent(customerId);
  if (!setupIntentRes || !setupIntentRes.client_secret)
    throw new Error("Could not create setup intent");

  res.json({ client_secret: setupIntentRes.client_secret, status: 200 });
}

export async function listPaymentMethods(
  req: AuthRequest,
  res: Response<{ paymentMethods: PaymentMethod[] }>
) {
  const user = req.user;
  const { customerId, defaultPaymentMethodId } = user.stripe;
  const paymentMethods = await getPaymentMethods(customerId);

  if (!defaultPaymentMethodId) {
    //todo: handle no default payment method
  }

  //Default payment needs to be set
  if (paymentMethods.length > 0 && !defaultPaymentMethodId) {
    await handleSetDefaultPaymentMethod(user, paymentMethods[0].id, prisma);
  }

  paymentMethods.forEach((paymentMethod, i) => {
    if (paymentMethod.id === user.stripe.defaultPaymentMethodId) {
      paymentMethods[i].isDefault = true;
    }
  });

  res.json({ paymentMethods, status: 200 });
}

export async function deletePaymentMethod(
  req: AuthRequest<null, { id: string }>,
  res: Response
) {
  const {
    stripe: { defaultPaymentMethodId },
  } = req.user;
  const { id: paymentMethodId } = req.params;

  if (paymentMethodId === defaultPaymentMethodId) {
    throw new Error("Cannot delete default payment method");
  }

  await stripe.paymentMethods.detach(paymentMethodId);

  res.json({ status: 200 });
}

export async function setDefaultPaymentMethod(
  req: AuthRequest<null, { id: string }>,
  res: Response
) {
  const { id: paymentMethodId } = req.params;

  await handleSetDefaultPaymentMethod(req.user, paymentMethodId, prisma);

  res.json({ status: 200 });
}

export async function handleSubscription(
  req: AuthRequest<{ planName: PlanName; upgradeNow: boolean }>,
  res: Response<{ type: "create" | "update" }>
) {
  const user = req.user;
  const { planName, upgradeNow } = req.body;
  const { productId, recurringType, productCost } = getPlanInfo(planName);

  const price_data = {
    currency: "usd",
    product: productId,
    recurring: { interval: recurringType },
    unit_amount: productCost * 100,
  };

  const subscription = await getSubscription(user.stripe.customerId);
  let subscriptionRes: Stripe.Response<Stripe.Subscription>;
  if (subscription) {
    //update subscription
    const updateParams: Stripe.SubscriptionUpdateParams = {
      cancel_at_period_end: false,
      proration_behavior: "create_prorations",
      items: [
        {
          id: subscription.items.data[0].id,
          price_data,
        },
      ],
      description: `${user.email} ${planName}`,
    };

    if (upgradeNow) updateParams.trial_end = Math.floor(Date.now() / 1000);

    subscriptionRes = await stripe.subscriptions.update(
      subscription.id,
      updateParams
    );
  } else {
    //create subscription
    subscriptionRes = await stripe.subscriptions.create({
      customer: user.stripe.customerId,
      items: [{ price_data }],
      description: `${user.email} ${planName}`,
      trial_end: getTrialLength(7),
    });
  }

  if (!subscriptionRes) throw new Error("Could not create subscription");

  await handleMailchimpBasedOnStripeSubscriptionStatus({
    user,
    subscriptionStatus: subscriptionRes.status,
    prisma,
  });

  const subscriptionType = subscription ? "update" : "create";
  res.json({ type: subscriptionType, status: 200 });
}

export async function getSubscriptionInfo(
  req: AuthRequest,
  res: Response<SubscriptionInfo | { noSubscription: boolean }>
) {
  if (req.user.isInfluencer) {
    res.json({
      planName: "Flip Sourcer Pro",
      subStatus: "active",
      isTrialing: false,
      renewsOn: new Date(),
      cancelAtEnd: false,
      status: 200,
    });
    return;
  }

  const subscription = await getSubscription(req.user.stripe.customerId);

  if (!subscription) {
    res.json({ status: 200, noSubscription: true });
    return;
  }

  const planName = getPlanNameFromProductId(
    subscription.items.data[0].price.product as string
  );
  const subStatus = subscription.status;
  const isTrialing = subscription.status === "trialing";
  const renewsOn = new Date(subscription.current_period_end * 1000);
  const cancelAtEnd = subscription.cancel_at_period_end;

  res.json({
    planName,
    subStatus,
    isTrialing,
    renewsOn,
    cancelAtEnd,
    status: 200,
  });
}

export async function cancelSubscription(
  req: AuthRequest<{ feedback: string }>,
  res: Response
) {
  const {
    user: { email },
  } = req;
  const { feedback } = req.body;
  const subscription = await getSubscription(req.user.stripe.customerId);

  if (!subscription) throw new Error("No subscription found");

  await stripe.subscriptions.update(subscription.id, {
    cancel_at_period_end: true,
  });

  await handleMailchimpBasedOnStripeSubscriptionStatus({
    user: req.user,
    subscriptionStatus: "canceled",
    prisma,
  });

  sesSendEmail({
    subject: `Subscription Canceled by ${email}`,
    body: `feedback: ${feedback}`,
  });

  res.json({ status: 200 });
}
