import { Request, Response, NextFunction } from "express";
import { UserInterface } from "../../../../../types/User";
import { PrismaClient } from "../../../../prisma/generated/client";
import { SESSION_EXTENSION_HOURS } from "../../../../shared/constants";
const prisma = new PrismaClient();

export async function authenticateSession(
  req: Request & { user: UserInterface },
  res: Response,
  next: NextFunction
) {
  try {
    const sessionToken = req.headers["authorization"]?.split(" ")[1];
    if (!sessionToken) throw new Error("Invalid session token.");

    const user = await prisma.user.findFirst({
      where: {
        sessionToken,
      },
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

    if (user.sessionExpiration < new Date())
      throw new Error("Session expired.");

    const sessionExpiration = new Date(
      new Date().setHours(new Date().getHours() + SESSION_EXTENSION_HOURS)
    );
    await prisma.user.updateMany({
      where: { sessionToken },
      data: { sessionExpiration },
    });

    req.user = user as UserInterface;

    next();
  } catch (e) {
    console.error(e);
    return res.status(401).send({ status: 401 });
  }
}
