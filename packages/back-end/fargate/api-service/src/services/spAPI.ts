import fetch from "node-fetch";
import SellingPartnerApi from "amazon-sp-api";
import {
  GetAccessTokenResponse,
  GetMyFeesEstimateForASINResponse,
} from "../../../../../types/SpAPI";
import {
  awsAccessKeyId,
  awsSecretAccessKey,
  awsSellingPartnerRole,
  spApiClientId,
  spApiClientSecret,
  spApiRefreshToken,
} from "../../../../shared/envVars";

export async function getAccessToken() {
  const grant_type = "refresh_token";

  let apiUrl = "https://api.amazon.com/auth/o2/token";
  apiUrl += `?grant_type=${grant_type}`;
  apiUrl += `&refresh_token=${spApiRefreshToken}`;
  apiUrl += `&client_id=${spApiClientId}`;
  apiUrl += `&client_secret=${spApiClientSecret}`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const json: GetAccessTokenResponse = await res.json();
  return json.access_token;
}

interface GetMyFeesEstimateForASINParams {
  refreshToken: string;
  asin: string;
  price: number;
  region?: "na" | "eu" | "fe";
  marketplaceId?: string;
}

export async function getMyFeesEstimateForASIN({
  refreshToken,
  asin,
  price,
  region = "na",
  marketplaceId = "ATVPDKIKX0DER",
}: GetMyFeesEstimateForASINParams) {
  const sellingPartner = new SellingPartnerApi({
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
}
