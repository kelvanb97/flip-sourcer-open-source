import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import { PostgresDbStack } from "./postgresStack";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { ApplicationProtocol } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { HostedZoneStack } from "./hostedZoneStack";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

type WebApiStackProps = cdk.StackProps & {
  postgresDbStack: PostgresDbStack;
  hostedZoneStack: HostedZoneStack;
  resourcePrefix: string;
};

export class WebApiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: WebApiStackProps) {
    super(scope, id, props);

    const { postgresDbStack, hostedZoneStack, resourcePrefix } = props;

    //SECRET
    let secret: cdk.aws_secretsmanager.ISecret;
    //todo: This try block does not acheive anything because it never throws an error. This needs to use SDK code
    try {
      secret = cdk.aws_secretsmanager.Secret
        .fromSecretNameV2(this, "WebApiSecret", `${resourcePrefix}WebApiSecret`);
      if (!secret) throw new Error("Secret not found");
    } catch {
      secret = new Secret(this, "WebApiSecret", {
        secretName: `${resourcePrefix}WebApiSecret`,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      })
    }

    //EMAIL PERMISSIONS
    const sesPolicyStatement = new iam.PolicyStatement({
      actions: ["ses:SendEmail", "ses:SendRawEmail"],
      resources: ["*"],
      effect: iam.Effect.ALLOW
    });
    const sesPolicy = new iam.ManagedPolicy(this, "SESPolicy", {
      statements: [sesPolicyStatement]
    });

    const cluster = new ecs.Cluster(this, "WebApiECSCluster", {
      clusterName: `${resourcePrefix}WebApiECSCluster`,
      containerInsights: true,
      vpc: postgresDbStack.vpc,
    });

    const dockerFile = new DockerImageAsset(this, "DockerFileAsset", {
      directory: "../back-end/fargate/api-service",
      file: "Dockerfile",
    });

    const image = ecs.ContainerImage.fromDockerImageAsset(dockerFile);

    const loadBalancedFargateService =
      new ecsPatterns.ApplicationLoadBalancedFargateService(this, "Service", {
        cluster,
        redirectHTTP: true,
        assignPublicIp: true,
        memoryLimitMiB: 2048,
        publicLoadBalancer: true,
        protocol: ApplicationProtocol.HTTPS,
        domainName: `${resourcePrefix.toLocaleLowerCase()}-api.flipsourcerapi.com`,
        domainZone: hostedZoneStack.hostedZone,
        cpu: 1024,
        taskImageOptions: {
          image,
          containerPort: 4200,
          environment: {
            SECRET_ID: secret.secretName,
          },
          logDriver: new ecs.AwsLogDriver({
            streamPrefix: `api-logs`,
            logRetention: RetentionDays.ONE_DAY,
          })
        },
      });
    secret.grantRead(loadBalancedFargateService.taskDefinition.taskRole);

    const securityGroup = new ec2.SecurityGroup(
      this,
      `scraper-security-group`,
      {
        vpc: postgresDbStack.vpc,
        allowAllOutbound: true,
        description: "Scraper Security Group",
      }
    );

    loadBalancedFargateService.targetGroup.configureHealthCheck({
      path: "/no-auth/health-check"
    });

    loadBalancedFargateService.taskDefinition.taskRole.addManagedPolicy(sesPolicy);

    // securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(APP_PORT));
    // securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432));
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());
    securityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());
  }
}
