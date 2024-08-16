import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { PostgresDbStack } from "./postgresStack";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

const APP_PORT = 3000;

type ScaperFargateStackProps = cdk.StackProps & {
  postgresDbStack: PostgresDbStack;
  resourcePrefix: string;
};

export class ScraperFargateStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: ScaperFargateStackProps) {
    super(scope, id, props);

    const { postgresDbStack, resourcePrefix } = props;

    const secret = secretsmanager.Secret.fromSecretNameV2(this, 'WebApiSecret', `${resourcePrefix}WebApiSecret`);
    const taskRole = new iam.Role(this, 'TaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      inlinePolicies: {
        'ecsPermissionsPolicy': new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['ecs:DescribeServices', 'ecs:UpdateService'],
              resources: ['*'],
            })
          ]
        })
      }
    });
    secret.grantRead(taskRole);

    /* RETAILER START */
    const retailerTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "retailerScraperTaskDefinition",
      { memoryLimitMiB: 1024, cpu: 512, taskRole },
    );

    const retailerDockerFile = new DockerImageAsset(this, "RetailerDockerFileAsset", {
      directory: "../back-end/fargate/scraping-services/retailer-service",
      file: "Dockerfile",
    });

    const retailerImage = ecs.ContainerImage.fromDockerImageAsset(retailerDockerFile);

    const retailerContainer = retailerTaskDefinition.addContainer(
      "retailerScraperContainer",
      {
        image: retailerImage,
        logging: ecs.LogDriver.awsLogs({
          streamPrefix: "scraper-logs",
          logRetention: RetentionDays.ONE_DAY,
        }),
        environment: {
          SECRET_ID: `${resourcePrefix}WebApiSecret`,
        },
      }
    );
    retailerContainer.addPortMappings({
      containerPort: APP_PORT,
    });
    /* RETAILER END */

    /* AMAZON START */
    const amazonTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "amazonScraperTaskDefinition",
      { memoryLimitMiB: 2048, cpu: 512, taskRole },
    );

    const amazonDockerFile = new DockerImageAsset(this, "AmazonDockerFileAsset", {
      directory: "../back-end/fargate/scraping-services/amazon-service",
      file: "Dockerfile",
    });

    const amazonImage = ecs.ContainerImage.fromDockerImageAsset(amazonDockerFile);

    const amazonContainer = amazonTaskDefinition.addContainer(
      "amazonContainer",
      {
        image: amazonImage,
        logging: ecs.LogDriver.awsLogs({
          streamPrefix: "amazon-logs",
          logRetention: RetentionDays.ONE_DAY,
        }),
        environment: {
          SECRET_ID: `${resourcePrefix}WebApiSecret`,
        },
      }
    )
    amazonContainer.addPortMappings({
      containerPort: APP_PORT,
    });
    /* AMAZON END */

    /* KEEPA START */
    const keepaTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "keepaTaskDefinition",
      { memoryLimitMiB: 512, cpu: 256, taskRole },
    );

    const keepaDockerFile = new DockerImageAsset(this, "KeepaDockerFileAsset", {
      directory: "../back-end/fargate/keepa-service",
      file: "Dockerfile",
    });

    const keepaImage = ecs.ContainerImage.fromDockerImageAsset(keepaDockerFile);

    const keepaContainer = keepaTaskDefinition.addContainer(
      "keepaContainer",
      {
        image: keepaImage,
        logging: ecs.LogDriver.awsLogs({
          streamPrefix: "keepa-logs",
          logRetention: RetentionDays.ONE_DAY,
        }),
        environment: {
          SECRET_ID: `${resourcePrefix}WebApiSecret`,
        },
      }
    );
    keepaContainer.addPortMappings({
      containerPort: APP_PORT,
    });
    /* KEEPA END */

    /* GPT-PRODUCT-TITLE_MATCHER START */
    const gptProductTitleMatcherTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "gptProductTitleMatcherTaskDefinition",
      { memoryLimitMiB: 512, cpu: 256, taskRole },
    );

    const gptProductTitleMatcherDockerFile = new DockerImageAsset(this, "GptProductTitleMatcherDockerFileAsset", {
      directory: "../back-end/fargate/gpt-product-title-matcher-service",
      file: "Dockerfile",
    });

    const gptProductTitleMatcherImage = ecs.ContainerImage.fromDockerImageAsset(gptProductTitleMatcherDockerFile);

    const gptProductTitleMatcherContainer = gptProductTitleMatcherTaskDefinition.addContainer(
      "gptProductTitleMatcherContainer",
      {
        image: gptProductTitleMatcherImage,
        logging: ecs.LogDriver.awsLogs({
          streamPrefix: "gptProductTitleMatcher-logs",
          logRetention: RetentionDays.ONE_DAY,
        }),
        environment: {
          SECRET_ID: `${resourcePrefix}WebApiSecret`,
        },
      }
    );
    gptProductTitleMatcherContainer.addPortMappings({
      containerPort: APP_PORT,
    });
    /* GPT-PRODUCT-TITLE_MATCHER END */

    const cluster = new ecs.Cluster(this, "ScraperECSCluster", {
      clusterName: `${resourcePrefix}ScraperECSCluster`,
      containerInsights: true,
      vpc: postgresDbStack.vpc,
    });

    const retailerService = new ecs.FargateService(
      this,
      "retailerScraperService",
      {
        cluster,
        taskDefinition: retailerTaskDefinition,
        desiredCount: 0,
        serviceName: "retailerScraperService",
        assignPublicIp: true,
      }
    );

    const amazonService = new ecs.FargateService(
      this,
      "amazonScraperService",
      {
        cluster,
        taskDefinition: amazonTaskDefinition,
        desiredCount: 0,
        serviceName: "amazonScraperService",
        assignPublicIp: true,
      }
    );

    const keepaService = new ecs.FargateService(
      this,
      "keepaScraperService",
      {
        cluster,
        taskDefinition: keepaTaskDefinition,
        desiredCount: 0,
        serviceName: "keepaService",
        assignPublicIp: true,
      }
    );

    const gptProductTitleMatcherService = new ecs.FargateService(
      this,
      "gptProductTitleMatcherScraperService",
      {
        cluster,
        taskDefinition: gptProductTitleMatcherTaskDefinition,
        desiredCount: 0,
        serviceName: "gptProductTitleMatcherService",
        assignPublicIp: true,
      }
    );

    const securityGroup = new ec2.SecurityGroup(
      this,
      `scraper-security-group`,
      {
        vpc: postgresDbStack.vpc,
        allowAllOutbound: true,
        description: "Scraper Security Group",
      }
    );

    // securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(APP_PORT));
    // securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432));
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());
    securityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());
  }
}
