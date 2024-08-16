#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PostgresDbStack } from "../lib/postgresStack";
import { ScraperFargateStack } from "../lib/scraperFargateStack";
import { WebApiStack } from "../lib/webApiStack";
import { HostedZoneStack } from "../lib/hostedZoneStack";
import { LambdaStack } from "../lib/lambdaStack";

const app = new cdk.App();
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
}
const hostedZoneStack = new HostedZoneStack(app, "FlipSourcerHostedZoneStack", {
  env
})

/* DEV RESOURCES START */
const devPostgresDbStack = new PostgresDbStack(app, "DevPostgresDbStack");

new ScraperFargateStack(app, "DevFargateScraperStack", {
  postgresDbStack: devPostgresDbStack,
  resourcePrefix: "Dev",
});

new WebApiStack(app, "DevWebApiStack", {
  postgresDbStack: devPostgresDbStack,
  hostedZoneStack,
  resourcePrefix: "Dev",
});

new LambdaStack(app, "DevLambdaStack", {
  postgresDbStack: devPostgresDbStack,
  resourcePrefix: "Dev",
  stage: "dev"
});
/* DEV RESOURCES END */

/* PROD RESOURCES START */
const prodPostgresDbStack = new PostgresDbStack(app, "ProdPostgresDbStack");

new ScraperFargateStack(app, "ProdFargateScraperStack", {
  postgresDbStack: prodPostgresDbStack,
  resourcePrefix: "Prod",
});

new WebApiStack(app, "ProdWebApiStack", {
  postgresDbStack: prodPostgresDbStack,
  hostedZoneStack,
  resourcePrefix: "Prod",
});

new LambdaStack(app, "ProdLambdaStack", {
  postgresDbStack: devPostgresDbStack,
  resourcePrefix: "Prod",
  stage: "prod"
});
/* PROD RESOURCES END */
