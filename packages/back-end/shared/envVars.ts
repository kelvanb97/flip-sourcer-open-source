import deasyncPromise from "deasync-promise";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
} from "@aws-sdk/client-secrets-manager";

const secretId = process.env.SECRET_ID;
interface SecretValues {
  stage: "dev" | "prod";
  stripeSecretKey: string;
  psqlUri: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsSellingPartnerRole: string;
  spApiClientId: string;
  spApiClientSecret: string;
  spApiRefreshToken: string;
  mailchimpApiKey: string;
  keepaApiKey: string;
  scraperApiApiKey: string;
  liveUpdatesKeepaApiKey: string;
  gmailSecret: string;
  openAiApiKey: string;
}

const client = new SecretsManagerClient({
  region: "us-west-2",
});

async function getSecretValues(): Promise<SecretValues> {
  console.log("Getting secret values for secretId: ", secretId);
  if (process.env.SKIP_SECRETS === "true") {
    console.log("Skipping secrets");
    return {} as SecretValues;
  }
  return (
    Promise.race([
      client.send(
        new GetSecretValueCommand({
          SecretId: secretId as string,
          VersionStage: "AWSCURRENT",
        })
      ),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout error")), 5000)
      ),
    ]) as Promise<GetSecretValueCommandOutput>
  ).then((response: GetSecretValueCommandOutput) => {
    if (!response || !response.SecretString) {
      console.log("No response from AWS Secrets Manager");
      return {} as SecretValues;
    }

    return JSON.parse(response.SecretString as string) as SecretValues;
  });
}

let secretValues = {} as SecretValues;
if (process.env.SKIP_SECRETS !== "true") {
  secretValues = deasyncPromise(getSecretValues());
}

//APP
export const stage = (secretValues.stage || process.env.STAGE) as string;
export const isProd = stage === "prod";
export const port = 4200;
export const loggingEnabled = process.env.LOGGING_ENABLED === "true";

//DB
export const psqlUri = (secretValues.psqlUri ||
  process.env.DATABASE_URL) as string;
process.env.DATABASE_URL = psqlUri;

//AWS
export const awsAccessKeyId = (secretValues.awsAccessKeyId ||
  process.env.AWS_ACCESS_KEY_ID) as string;
export const awsSecretAccessKey = (secretValues.awsSecretAccessKey ||
  process.env.AWS_SECRET_ACCESS_KEY) as string;
export const awsSellingPartnerRole = (secretValues.awsSellingPartnerRole ||
  process.env.AWS_SELLING_PARTNER_ROLE) as string;

//SP-APIs
export const spApiClientId = (secretValues.spApiClientId ||
  process.env.SP_API_CLIENT_ID) as string;
export const spApiClientSecret = (secretValues.spApiClientSecret ||
  process.env.SP_API_CLIENT_SECRET) as string;
export const spApiRefreshToken = (secretValues.spApiRefreshToken ||
  process.env.SP_API_REFRESH_TOKEN) as string;

//MAILCHIMP
export const mailchimpApiKey = (secretValues.mailchimpApiKey ||
  process.env.MAILCHIMP_API_KEY) as string;

//Keepa API
export const keepaApiKey = (secretValues.keepaApiKey ||
  process.env.KEEPA_API_KEY) as string;
export const liveUpdatesKeepaApiKey = (secretValues.liveUpdatesKeepaApiKey ||
  process.env.LIVE_UPDATES_KEEPA_API_KEY) as string;

//STRIPE
export const stripeSecretKey = (secretValues.stripeSecretKey ||
  process.env.STRIPE_SECRET_KEY) as string;

//Scraper API
export const scraperApiApiKey = (secretValues.scraperApiApiKey ||
  process.env.SCRAPER_API_API_KEY) as string;

//Gmail
export const gmailSecret = (secretValues.gmailSecret ||
  process.env.GMAIL_SECRET) as string;

//OpenAI
export const openAiApiKey = (secretValues.openAiApiKey ||
  process.env.OPENAI_API_KEY) as string;
