import fetch from "node-fetch";
import { AuthRequest, Response } from "../../types/AuthRequest";
import {
  GeneralSettings,
  UserInterfaceDisplay,
} from "../../../../../types/User";
import {
  PrismaClient,
  SavedProduct,
} from "../../../../prisma/generated/client";
import { spApiClientId, spApiClientSecret } from "../../../../shared/envVars";
import { ProductInterface } from "../../../../../types/Product";
const prisma = new PrismaClient();

export async function getDisplayUser(
  req: AuthRequest,
  res: Response<{ user: UserInterfaceDisplay }>
) {
  const { user } = req;

  const displayUser: UserInterfaceDisplay = {
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    sessionToken: user.sessionToken,
    sessionExpiration: user.sessionExpiration,
    referrer: user.referrer,
    generalSettings: {
      defaultFbaFee: user.generalSettings.defaultFbaFee,
      perUnitCosts: {
        flat: user.generalSettings.perUnitCosts.flat,
        percent: user.generalSettings.perUnitCosts.percent,
      },
      shippingCosts: {
        perPound: user.generalSettings.shippingCosts.perPound,
        perOunce: user.generalSettings.shippingCosts.perOunce,
        perKilogram: user.generalSettings.shippingCosts.perKilogram,
        perGram: user.generalSettings.shippingCosts.perGram,
        perUnit: user.generalSettings.shippingCosts.perUnit,
      },
      cashback: {
        flat: user.generalSettings.cashback.flat,
        percent: user.generalSettings.cashback.percent,
      },
      measurementSystem: user.generalSettings.measurementSystem,
    },
    productBlackList: user.productBlackList,
    superDelete: user.superDelete,
  };

  res.json({ user: displayUser, status: 200 });
}

export async function spApiInit(
  req: AuthRequest<{
    spapi_oath_code: string;
    state: string;
    selling_partner_id: string;
  }>,
  res: Response
) {
  const user = req.user;

  const { spapi_oath_code, selling_partner_id } = req.body;

  let urlParams = "?grant_type=authorization_code";
  urlParams += `&code=${spapi_oath_code}`;
  urlParams += `&client_id=${spApiClientId}`;
  urlParams += `&client_secret=${spApiClientSecret}`;
  urlParams = encodeURI(urlParams);

  const amazonOathRes = await fetch(
    `https://api.amazon.com/auth/o2/token${urlParams}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const amazonOathData = await amazonOathRes.json();

  if (
    amazonOathData?.access_token &&
    amazonOathData?.refresh_token &&
    selling_partner_id
  ) {
    await prisma.amazonSpApi.updateMany({
      where: {
        user: {
          id: user.id,
        },
      },
      data: {
        sellerId: selling_partner_id,
        accessToken: amazonOathData.access_token,
        refreshToken: amazonOathData.refresh_token,
      },
    });

    res.json({ status: 200 });
  } else {
    res.json({
      status: 400,
      message: "Failed to authenticate Amazon Seller account",
    });
  }
}

export async function updateGeneralSettings(
  req: AuthRequest<GeneralSettings>,
  res: Response
) {
  const user = req.user;
  const generalSettings = req.body;

  await prisma.generalSettings.updateMany({
    data: {
      defaultFbaFee: generalSettings.defaultFbaFee,
      measurementSystem: generalSettings.measurementSystem,
    },
    where: {
      user: {
        id: user.id,
      },
    },
  });

  await prisma.perUnitCosts.updateMany({
    where: {
      generalSettings: {
        user: {
          id: user.id,
        },
      },
    },
    data: {
      flat: generalSettings.perUnitCosts.flat,
      percent: generalSettings.perUnitCosts.percent,
    },
  });

  await prisma.shippingCosts.updateMany({
    where: {
      generalSettings: {
        user: {
          id: user.id,
        },
      },
    },
    data: {
      perGram: generalSettings.shippingCosts.perGram,
      perKilogram: generalSettings.shippingCosts.perKilogram,
      perOunce: generalSettings.shippingCosts.perOunce,
      perPound: generalSettings.shippingCosts.perPound,
      perUnit: generalSettings.shippingCosts.perUnit,
    },
  });

  await prisma.cashback.updateMany({
    where: {
      generalSettings: {
        user: {
          id: user.id,
        },
      },
    },
    data: {
      percent: generalSettings.cashback.percent,
      flat: generalSettings.cashback.flat,
    },
  });

  res.json({ status: 200 });
}

export async function addProductToProductBlacklist(
  req: AuthRequest<null, { id: string }>,
  res: Response
) {
  const { user } = req;
  const { id: productId } = req.params;

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      productBlackList: {
        push: productId,
      },
    },
  });

  res.json({ status: 200 });
}

export async function createSavedProduct(
  req: AuthRequest<{ productInfo: ProductInterface }>,
  res: Response
) {
  const { user } = req;
  const { productInfo } = req.body;

  await prisma.savedProduct.create({
    data: {
      userId: user.id,
      productInfo: JSON.stringify(productInfo),
    },
  });

  res.json({ status: 200 });
}

export async function removeFromSavedProducts(
  req: AuthRequest<null, { id: string }>,
  res: Response
) {
  const { user } = req;
  const { id: savedProductId } = req.params;

  await prisma.savedProduct.deleteMany({
    where: {
      userId: user.id,
      id: parseInt(savedProductId),
    },
  });

  res.json({ status: 200 });
}

export async function getSavedProducts(
  req: AuthRequest<{ page: number; pageSize: number }>,
  res: Response<{
    products: ProductInterface[];
    hasNextPage: boolean;
    numResults: number;
  }>
) {
  const { user } = req;
  const { page, pageSize } = req.body;

  const savedProducts: SavedProduct[] = await prisma.savedProduct.findMany({
    take: pageSize + 1,
    skip: page * pageSize,
    where: {
      userId: user.id,
    },
  });

  const hasNextPage = savedProducts.length > pageSize;

  const products: ProductInterface[] = [];
  for (let i = 0; i < savedProducts.length; i++) {
    const savedProduct = savedProducts[i];
    const productInfo = JSON.parse(savedProduct.productInfo as string);
    productInfo.id = savedProduct.id;
    products.push(productInfo);
  }

  res.json({
    products,
    hasNextPage,
    numResults: savedProducts.length,
    status: 200,
  });
}
