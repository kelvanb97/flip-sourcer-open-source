import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
// import * as events from 'aws-cdk-lib/aws-events';
// import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { PostgresDbStack } from "./postgresStack";

type LambdaStackProps = cdk.StackProps & {
    postgresDbStack: PostgresDbStack;
    resourcePrefix: string;
    stage: string;
};

export class LambdaStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        const { resourcePrefix, stage } = props;

        const secret = secretsmanager.Secret.fromSecretNameV2(this, 'WebApiSecret', `${resourcePrefix}WebApiSecret`);

        const lambdaApi = new apigateway.RestApi(this, `${resourcePrefix}LambdaApi`, {
            restApiName: `${resourcePrefix}LambdaServices`,
            description: "Various lambdas for the Flip Sourcer API",
            deployOptions: {
                stageName: stage,
                metricsEnabled: true,
                dataTraceEnabled: true,
                tracingEnabled: true,
            },
        });

        /* PRODUCT MATCHER START */
        const productMatcherLambda = new lambda.DockerImageFunction(this, `${resourcePrefix}ProductMatcherLambda`, {
            code: lambda.DockerImageCode.fromImageAsset("../back-end/lambda/product-matcher-service"),
            memorySize: 1024,
            timeout: cdk.Duration.seconds(300),
            environment: {
                SECRET_ID: `${resourcePrefix}WebApiSecret`,
            },
        });

        const calculateSimilarityScoreResource = lambdaApi.root.addResource('calculate-product-similarity-score');

        const calculateSimilarityScoreIntegration = new apigateway.LambdaIntegration(productMatcherLambda);
        calculateSimilarityScoreResource.addMethod('POST', calculateSimilarityScoreIntegration);

        secret.grantRead(productMatcherLambda);
        /* PRODUCT MATCHER END */

        /* SCRAPER CHRON START */
        //todo: make this dynamic
        if (resourcePrefix === "Prod") {
            const scraperChronLambdaRole = new iam.Role(this, `${resourcePrefix}ScraperChronLambdaRole`, {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });

            scraperChronLambdaRole.addToPolicy(
                new iam.PolicyStatement({
                    actions: ['ecs:DescribeServices', 'ecs:UpdateService'],
                    resources: ['*'], //todo: Ideally, you should narrow this down to specific resources
                })
            );

            const scraperChronLambda = new lambda.DockerImageFunction(this, `${resourcePrefix}ScraperChronLambda`, {
                code: lambda.DockerImageCode.fromImageAsset("../back-end/lambda/scraper-chron-service"),
                memorySize: 1024,
                timeout: cdk.Duration.seconds(300),
                role: scraperChronLambdaRole,
                environment: {
                    SECRET_ID: `${resourcePrefix}WebApiSecret`,
                    DATABASE_URL: process.env.DATABASE_URL as string,
                },
            });

            // const rule = new events.Rule(this, `${resourcePrefix}ScraperChronRule`, {
            //     schedule: events.Schedule.cron({
            //         minute: '0',
            //         hour: '13',
            //         weekDay: "MON",
            //         month: "*",
            //         year: "*",
            //     })
            // });

            secret.grantRead(scraperChronLambda);
            // rule.addTarget(new targets.LambdaFunction(scraperChronLambda));
        }
        /* SCRAPER CHRON END */
    }
}