#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const postgresStack_1 = require("../lib/postgresStack");
const scraperFargateStack_1 = require("../lib/scraperFargateStack");
const webApiStack_1 = require("../lib/webApiStack");
const hostedZoneStack_1 = require("../lib/hostedZoneStack");
const lambdaStack_1 = require("../lib/lambdaStack");
const app = new cdk.App();
const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};
const hostedZoneStack = new hostedZoneStack_1.HostedZoneStack(app, "FlipSourcerHostedZoneStack", {
    env
});
/* DEV RESOURCES START */
const devPostgresDbStack = new postgresStack_1.PostgresDbStack(app, "DevPostgresDbStack");
new scraperFargateStack_1.ScraperFargateStack(app, "DevFargateScraperStack", {
    postgresDbStack: devPostgresDbStack,
    resourcePrefix: "Dev",
});
new webApiStack_1.WebApiStack(app, "DevWebApiStack", {
    postgresDbStack: devPostgresDbStack,
    hostedZoneStack,
    resourcePrefix: "Dev",
});
new lambdaStack_1.LambdaStack(app, "DevLambdaStack", {
    postgresDbStack: devPostgresDbStack,
    resourcePrefix: "Dev",
    stage: "dev"
});
/* DEV RESOURCES END */
/* PROD RESOURCES START */
const prodPostgresDbStack = new postgresStack_1.PostgresDbStack(app, "ProdPostgresDbStack");
new scraperFargateStack_1.ScraperFargateStack(app, "ProdFargateScraperStack", {
    postgresDbStack: prodPostgresDbStack,
    resourcePrefix: "Prod",
});
new webApiStack_1.WebApiStack(app, "ProdWebApiStack", {
    postgresDbStack: prodPostgresDbStack,
    hostedZoneStack,
    resourcePrefix: "Prod",
});
new lambdaStack_1.LambdaStack(app, "ProdLambdaStack", {
    postgresDbStack: devPostgresDbStack,
    resourcePrefix: "Prod",
    stage: "prod"
});