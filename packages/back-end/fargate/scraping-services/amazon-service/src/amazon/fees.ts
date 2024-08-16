import SellingPartnerApi from "amazon-sp-api";
import { GetMyFeesEstimateForASINResponse } from "../../../../../../types/SpAPI";
import {
  awsAccessKeyId,
  awsSecretAccessKey,
  awsSellingPartnerRole,
  spApiClientId,
  spApiClientSecret,
  spApiRefreshToken,
} from "../../../../../shared/envVars";
import { PrismaClient } from "../../../../../prisma/generated/client";

interface GetMyFeesEstimateForASINParams {
  asin: string;
  price: number;
  prisma: PrismaClient;
  region?: "na" | "eu" | "fe";
  marketplaceId?: string;
  retries?: number;
}

export async function getMyFeesEstimateForASIN({
  asin,
  price,
  prisma,
  region = "na",
  marketplaceId = "ATVPDKIKX0DER",
  retries = 0,
}: GetMyFeesEstimateForASINParams): Promise<GetMyFeesEstimateForASINResponse | null> {
  try {
    let refreshToken = spApiRefreshToken;

    if (retries > 1) {
      return null;
    } else if (retries > 0) {
      const userAmazonSpApi = await prisma.amazonSpApi.findFirst({
        where: {
          refreshToken: {
            not: "",
          },
        },
        orderBy: { lastUsedAt: "asc" },
      });

      if (!userAmazonSpApi?.refreshToken)
        throw new Error("No user with refresh token found (shouldn't happen)");

      await prisma.amazonSpApi.update({
        where: {
          id: userAmazonSpApi.id,
        },
        data: { lastUsedAt: new Date() },
      });

      refreshToken = userAmazonSpApi.refreshToken;
    }

    const sellingPartner: SellingPartnerApi = new SellingPartnerApi({
      region,
      refresh_token: refreshToken,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: spApiClientId,
        SELLING_PARTNER_APP_CLIENT_SECRET: spApiClientSecret,
        AWS_ACCESS_KEY_ID: awsAccessKeyId,
        AWS_SECRET_ACCESS_KEY: awsSecretAccessKey,
        AWS_SELLING_PARTNER_ROLE: awsSellingPartnerRole,
      },
    });

    const feesRes: GetMyFeesEstimateForASINResponse =
      await sellingPartner.callAPI({
        operation: "productFees.getMyFeesEstimateForASIN",
        path: {
          Asin: asin,
        },
        body: {
          FeesEstimateRequest: {
            MarketplaceId: marketplaceId,
            IdType: "ASIN",
            Identifier: asin,
            IsAmazonFulfilled: true,
            PriceToEstimateFees: {
              ListingPrice: {
                Amount: price,
                CurrencyCode: "USD",
              },
            },
            IdentifierType: "ASIN",
          },
        },
      });

    return feesRes;
  } catch (e) {
    console.log("Error getMyFeesEstimateForASIN", e);
    return await getMyFeesEstimateForASIN({
      asin,
      price,
      prisma,
      region,
      marketplaceId,
      retries: retries + 1,
    });
  }
}
