import mailchimp from "@mailchimp/mailchimp_marketing";
import md5 from "md5";

import { MailchimpListKey } from "../../../../../types/Mailchimp";
import { isProd, mailchimpApiKey } from "../../../../shared/envVars";
import { UserInterface } from "../../../../../types/User";
import Stripe from "stripe";
import { PrismaClient } from "../../../../prisma/generated/client";
import { sesSendEmail } from "../../../../shared/aws/ses";

const emailListIds: Record<MailchimpListKey, string> = {
  everyone: "<API_KEY>",
  onboarding: "<API_KEY>",
  trialing: "<API_KEY>",
  active: "<API_KEY>",
  canceled: "<API_KEY>",
};

mailchimp.setConfig({
  apiKey: mailchimpApiKey,
  server: "us14",
});

interface AddMemberToAudienceProps {
  user: UserInterface;
  listKey: MailchimpListKey;
  prisma: PrismaClient;
}

export async function addMemberToAudience({
  user,
  listKey,
  prisma,
}: AddMemberToAudienceProps) {
  try {
    if (user.isInfluencer) return;

    const mailchimpAudiences = user.mailchimpAudiences;
    if (mailchimpAudiences.includes(listKey)) return;

    if (isProd) {
      await mailchimp.lists.addListMember(emailListIds[listKey], {
        email_address: user.email,
        status: "subscribed",
      });
    } else {
      console.log("mailchimp actions disabled in dev");
    }

    mailchimpAudiences.push(listKey);
    await prisma.user.update({
      where: { id: user.id },
      data: { mailchimpAudiences },
    });

    if (listKey === "active") {
      sesSendEmail({
        subject: `Someone just paid you ${user.email}`,
        body: `${user.email} referred by: ${user.referrer}`,
      });
    } else if (listKey === "trialing") {
      sesSendEmail({
        subject: `Someone just finished setting up their trial ${user.email}`,
        body: `${user.email} referred by: ${user.referrer}`,
      });
    }
  } catch {
    //do nothing
  }
}

interface DeleteMemberFromAudienceProps {
  user: UserInterface;
  listKey: MailchimpListKey;
  prisma: PrismaClient;
}

export async function deleteMemberFromAudience({
  user,
  listKey,
  prisma,
}: DeleteMemberFromAudienceProps) {
  try {
    if (user.isInfluencer) return;

    const mailchimpAudiences = user.mailchimpAudiences;
    if (!mailchimpAudiences.includes(listKey)) return;

    if (isProd) {
      await mailchimp.lists.updateListMember(
        emailListIds[listKey],
        md5(user.email.toLowerCase()),
        { status: "unsubscribed" }
      );
    } else {
      console.log("mailchimp actions disabled in dev");
    }

    const updatedMailchimpAudiences = mailchimpAudiences.filter(
      (audience) => audience !== listKey
    );
    await prisma.user.update({
      where: { id: user.id },
      data: { mailchimpAudiences: updatedMailchimpAudiences },
    });
  } catch {
    //do nothing
  }
}

interface HandleMailchimpBasedOnStripeSubscriptionStatusProps {
  user: UserInterface;
  subscriptionStatus: Stripe.Subscription.Status | null;
  prisma: PrismaClient;
}

export async function handleMailchimpBasedOnStripeSubscriptionStatus({
  user,
  subscriptionStatus,
  prisma,
}: HandleMailchimpBasedOnStripeSubscriptionStatusProps) {
  if (subscriptionStatus === null) {
    await addMemberToAudience({ user, listKey: "onboarding", prisma });
  } else if (subscriptionStatus === "trialing") {
    await addMemberToAudience({ user, listKey: "trialing", prisma });

    await deleteMemberFromAudience({ user, listKey: "onboarding", prisma });
    await deleteMemberFromAudience({ user, listKey: "active", prisma });
    await deleteMemberFromAudience({ user, listKey: "canceled", prisma });
  } else if (subscriptionStatus === "active") {
    await addMemberToAudience({ user, listKey: "active", prisma });

    await deleteMemberFromAudience({ user, listKey: "onboarding", prisma });
    await deleteMemberFromAudience({ user, listKey: "trialing", prisma });
    await deleteMemberFromAudience({ user, listKey: "canceled", prisma });
  } else if (subscriptionStatus === "canceled") {
    await addMemberToAudience({ user, listKey: "canceled", prisma });

    await deleteMemberFromAudience({ user, listKey: "onboarding", prisma });
    await deleteMemberFromAudience({ user, listKey: "active", prisma });
    await deleteMemberFromAudience({ user, listKey: "trialing", prisma });
  } else {
    //todo: card error handling. Stripe might be able to handle this for us
  }
}
