import { App, Stack, StackProps } from "aws-cdk-lib";
import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";

export class HostedZoneStack extends Stack {
    public readonly hostedZone: IHostedZone;

    constructor(scope: App, id: string, props: StackProps) {
        super(scope, id, props);
        this.hostedZone = HostedZone.fromLookup(this, "HostedZone", {
            domainName: "flipsourcerapi.com",
        })
    }
}
