import { UserInterface } from "../../../../../types/User";
import { PrismaClient } from "../../../../prisma/generated/client";
import { v4 as uuidv4 } from "uuid";
import { isProd } from "../../../../shared/envVars";
import { sesSendEmail } from "../../../../shared/aws/ses";

interface SendVerificationEmailProps {
  user: UserInterface;
  prisma: PrismaClient;
}

export async function sendVerificationEmail({
  user,
  prisma,
}: SendVerificationEmailProps): Promise<{ success: boolean; message: string }> {
  try {
    const lastEmailVerificationSent =
      user.lastEmailVerificationSent || new Date(0);
    const currentTime = new Date();
    const timeSinceLastEmailVerificationSent =
      currentTime.getTime() - lastEmailVerificationSent.getTime();
    const timeSinceLastEmailVerificationSentInMinutes =
      timeSinceLastEmailVerificationSent / 1000 / 60;

    if (timeSinceLastEmailVerificationSentInMinutes < 1) {
      console.log("timeSinceLastEmailVerificationSentInMinutes < 1");
      const timeToWaitInSeconds = (
        (1 - timeSinceLastEmailVerificationSentInMinutes) *
        60
      ).toFixed(0);
      return {
        success: false,
        message: `Please wait ${timeToWaitInSeconds} seconds before sending another verification email.`,
      };
    }

    const newVerificationToken = uuidv4();

    const baseUrl = isProd
      ? "https://www.flipsourcer.com"
      : "http://localhost:4000";
    await sesSendEmail({
      to: user.email,
      subject: "Verify your email",
      body: `Click here to verify your email: ${baseUrl}/dashboard/verify-email?token=${newVerificationToken}`,
    });

    await prisma.user.update({
      where: { email: user.email },
      data: {
        emailVerificationToken: newVerificationToken,
        lastEmailVerificationSent: new Date(),
      },
    });

    return {
      success: true,
      message: "A verification email has been sent to your email address.",
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "An error occurred while sending the verification email.",
    };
  }
}
