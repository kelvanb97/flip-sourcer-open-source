import { fromInstanceMetadata } from "@aws-sdk/credential-provider-imds";

export async function isRunningInAws(): Promise<boolean> {
  try {
    if (
      process.env.AWS_EXECUTION_ENV === "AWS_ECS_FARGATE" ||
      process.env.AWS_LAMBDA_FUNCTION_NAME
    ) {
      console.log("Running in AWS Fargate.");
      return true;
    }
    const credentials = await fromInstanceMetadata()();
    return !!credentials;
  } catch (err) {
    console.log("Skipping AWS call, not running in AWS environment.");
    return false;
  }
}
