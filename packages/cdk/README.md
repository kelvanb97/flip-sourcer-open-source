# cdk

infrastructure as code. Each section handles a combination of VPC groups, security groups, roles/permissions, resource alerting, resource auto-scaling, horizontal scaling, Geo CDNs, and more.

- [cdk](#cdk)
  - [Hosted Zone Stack](#hosted-zone-stack)
  - [Lambda Stack](#lambda-stack)
  - [Postgres Stack](#postgres-stack)
  - [Scraper Fargate Stack](#scraper-fargate-stack)
  - [Web API Stack](#web-api-stack)

## Hosted Zone Stack

[src code](packages/cdk/lib/hostedZoneStack.ts)

## Lambda Stack

[src code](packages/cdk/lib/lambdaStack.ts)

## Postgres Stack

[src code](packages/cdk/lib/postgresStack.ts)

## Scraper Fargate Stack

[src code](packages/cdk/lib/scraperFargateStack.ts)

## Web API Stack

[src code](packages/cdk/lib/webApiStack.ts)