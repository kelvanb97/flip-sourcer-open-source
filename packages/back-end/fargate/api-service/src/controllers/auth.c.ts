import { v4 as uuidv4 } from "uuid";
import { AuthRequest, Response } from "../../types/AuthRequest";
import {
  LoginRequest,
  SignUpRequest,
  UserInterface,
} from "../../../../../types/User";
import { createCustomer, getSubscription } from "../services/stripe";
import { emailValidationRegex, passwordValidationRegex } from "../utils/regex";
import { PrismaClient } from "../../../../prisma/generated/client";
import { isProd } from "../../../../shared/envVars";
import { SESSION_EXTENSION_HOURS } from "../../../../shared/constants";
import { sendVerificationEmail } from "../services/auth";
import {
  addMemberToAudience,
  handleMailchimpBasedOnStripeSubscriptionStatus,
} from "../services/mailchimp";
import { sesSendEmail } from "../../../../shared/aws/ses";
const prisma = new PrismaClient();

export async function signUp(
  req: AuthRequest<SignUpRequest>,
  res: Response<{ sessionToken: string }>
) {
  const { name, email, password, confirmPassword, termsAgreed, referrer } =
    req.body;

  if (!email || !email.toLowerCase().match(emailValidationRegex)) {
    throw new Error("Invalid email address.");
  }
  if (!password || !password.match(passwordValidationRegex)) {
    throw new Error("Invalid password.");
  }
  if (!confirmPassword || password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }
  if (!termsAgreed) {
    throw new Error("Please agree to the 'Terms of Service'.");
  }

  const creationDate = new Date();
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password,
      createdAt: creationDate,
      updatedAt: creationDate,
      sessionToken: uuidv4(),
      sessionExpiration: new Date(
        creationDate.setHours(creationDate.getHours() + 1)
      ),
      referrer,
      stripe: {
        create: {
          customerId: (await createCustomer(email)).id,
          defaultPaymentMethodId: "",
        },
      },
      amazonSpApi: {
        create: {
          sellerId: "",
          accessToken: "",
          refreshToken: "",
        },
      },
      generalSettings: {
        create: {
          defaultFbaFee: 3.39,
          perUnitCosts: {
            create: {
              flat: 0,
              percent: 0,
            },
          },
          shippingCosts: {
            create: {
              perPound: 0,
              perOunce: 0,
              perKilogram: 0,
              perGram: 0,
              perUnit: 0,
            },
          },
          cashback: {
            create: {
              flat: 0,
              percent: 0,
            },
          },
          measurementSystem: "imperial",
        },
      },
    },
  });
  if (!createdUser) throw new Error("Failed to create user");

  const user = await prisma.user.findFirst({
    where: { id: createdUser.id },
    include: {
      amazonSpApi: true,
      generalSettings: {
        include: {
          cashback: true,
          perUnitCosts: true,
          shippingCosts: true,
        },
      },
      stripe: true,
    },
  });
  if (!user) throw new Error("Failed to find user");

  await addMemberToAudience({
    user: user as UserInterface,
    listKey: "everyone",
    prisma,
  });
  await addMemberToAudience({
    user: user as UserInterface,
    listKey: "onboarding",
    prisma,
  });

  sesSendEmail({
    subject: "New user!",
    body: `${createdUser.email} just started onboarding! Referred by: ${referrer}`,
  });

  res.json({
    sessionToken: createdUser.sessionToken,
    status: 200,
  });
}

export async function login(
  req: AuthRequest<LoginRequest>,
  res: Response<{ sessionToken: string }>
) {
  const { email, password } = req.body;
  if (!email || !password) throw new Error("Invalid email or password.");

  const user = await prisma.user.findFirst({
    where: { email, password },
  });
  if (!user) throw new Error("Invalid email or password.");

  const currentTime = new Date();
  const newExpiration = new Date(
    currentTime.setHours(currentTime.getHours() + SESSION_EXTENSION_HOURS)
  );
  const resultUser = await prisma.user.update({
    where: { email },
    data: {
      sessionToken: uuidv4().toString(),
      sessionExpiration: newExpiration,
    },
  });
  if (!user) throw new Error("Failed to find user");

  if (isProd)
    sesSendEmail({
      subject: `${user.email} just logged in`,
      body: `${user.email} just logged in`,
    });

  res.json({
    sessionToken: resultUser.sessionToken,
    status: 200,
  });
}

export async function validateSession(
  req: AuthRequest,
  res: Response<{
    needsSpApi: boolean;
    needsSubscription: boolean;
    isDelinquent: boolean;
    isEmailVerified: boolean;
  }>
) {
  const { user } = req;

  if (user.isInfluencer) {
    res.json({
      status: 200,
      needsSpApi: false,
      needsSubscription: false,
      isDelinquent: false,
      isEmailVerified: true,
    });
    return;
  }

  let needsSpApi = false;
  let needsSubscription = false;
  let isDelinquent = false;
  let isEmailVerified = false;

  if (
    !user.amazonSpApi.sellerId ||
    !user.amazonSpApi.refreshToken ||
    !user.amazonSpApi.accessToken
  )
    needsSpApi = true;

  const subscription = await getSubscription(user.stripe.customerId);

  await handleMailchimpBasedOnStripeSubscriptionStatus({
    user,
    subscriptionStatus: subscription?.status || null,
    prisma,
  });

  if (!subscription) needsSubscription = true;

  if (
    subscription &&
    subscription.status !== "trialing" &&
    subscription.status !== "active"
  )
    isDelinquent = true;

  if (user.emailVerified) isEmailVerified = true;

  res.json({
    status: 200,
    needsSpApi,
    needsSubscription,
    isDelinquent,
    isEmailVerified,
  });
}

export async function sendEmailVerification(
  req: AuthRequest,
  res: Response<{ message: string }>
) {
  const { user } = req;

  const emailRes = await sendVerificationEmail({ user, prisma });

  if (!emailRes || !emailRes.success) {
    res.json({ status: 500, message: emailRes.message });
    return;
  }

  res.json({ status: 200, message: emailRes.message });
}

export async function verifyEmail(
  req: AuthRequest<null, { token: string }>,
  res: Response
) {
  const { token } = req.params;
  const { user } = req;

  if (user.emailVerified) {
    res.json({ status: 200 });
    return;
  }

  if (!token || !user.emailVerificationToken) {
    res.json({ status: 400, message: "No token provided." });
    return;
  }

  if (token !== user.emailVerificationToken) {
    res.json({ status: 400, message: "Invalid token, please try again." });
    return;
  }

  await prisma.user.update({
    where: { email: user.email },
    data: {
      emailVerified: true,
    },
  });

  res.json({ status: 200 });
}
