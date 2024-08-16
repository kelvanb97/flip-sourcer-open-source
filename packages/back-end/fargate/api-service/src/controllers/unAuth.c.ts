import { Request } from "express";
import { Response } from "../../types/AuthRequest";
import { addMemberToAudience } from "../services/mailchimp";
import { PrismaClient } from "../../../../prisma/generated/client";
import { sesSendEmail } from "../../../../shared/aws/ses";
const prisma = new PrismaClient();

export async function emailSub(
  req: Request<null, null, { email: string }>,
  res: Response
) {
  const { user } = req;
  const { email } = req.body;

  sesSendEmail({
    subject: `New email subscription: ${email}`,
    body: `New email subscription: ${email}`,
  });

  //add to mailchimp list
  await addMemberToAudience({
    user,
    listKey: "everyone",
    prisma,
  });

  res.json({ status: 200 });
}

export async function healthCheck(_req: Request, res: Response) {
  res.json({ status: 200 });
}
