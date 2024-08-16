import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";

export class PostgresDbStack extends cdk.Stack {
  public db: rds.DatabaseInstance;
  public vpc: ec2.Vpc;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    // create a postgres db rds instance cdk definition
    super(scope, id, props);
    this.vpc = new ec2.Vpc(this, "RdsVpc", {
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 18,
          name: "public",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 28,
          name: "rds",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
    const securityGroup = new ec2.SecurityGroup(this, `rds-security-group`, {
      vpc: this.vpc,
      allowAllOutbound: true,
      description: "RDS Security Group",
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432));
    this.db = new rds.DatabaseInstance(this, "RdsDatabase", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14_5,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE4_GRAVITON,
        ec2.InstanceSize.MICRO
      ),
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [securityGroup],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      deletionProtection: false,
      databaseName: "flipsourcer",
      credentials: rds.Credentials.fromGeneratedSecret("adminuser"),
      publiclyAccessible: true,
    });

    // this.vpc.addInterfaceEndpoint("SecretsManagerEndpoint", {
    //   service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    // });

    // this.db.addRotationSingleUser();
  }
}
