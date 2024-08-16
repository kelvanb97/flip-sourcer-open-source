import { ECS } from "@aws-sdk/client-ecs";
import { isRunningInAws } from "./general";

const ecs = new ECS({ region: "us-west-2" });

interface ModifyTaskCountProps {
  clusterName: "DevScraperECSCluster" | "ProdScraperECSCluster";
  serviceName:
    | "pdpScraperService"
    | "keepaService"
    | "gptProductTitleMatcherService"
    | "catalogScraperService"
    | "updaterService";
  incrememntBy?: number;
}

export async function modifyTaskCount({
  clusterName,
  serviceName,
  incrememntBy = -1,
}: ModifyTaskCountProps): Promise<null | number> {
  if (!(await isRunningInAws())) return null;

  try {
    const response = await ecs.describeServices({
      services: [serviceName],
      cluster: clusterName,
    });
    if (!response.services || response.services.length === 0)
      throw new Error(`No services found for ${serviceName}`);

    const curDesiredCount = response.services[0].desiredCount || 0;
    const newDesiredCount = curDesiredCount + incrememntBy;

    const updateResponse = await ecs.updateService({
      service: serviceName,
      cluster: clusterName,
      desiredCount: newDesiredCount,
    });
    if (!updateResponse.service)
      throw new Error(`No service found for ${serviceName}`);

    return newDesiredCount;
  } catch (error) {
    console.log(`Failed to update service task count: ${error}`);
    return null;
  }
}

type GetTaskCountProps = Omit<ModifyTaskCountProps, "incrementBy">;

export async function getTaskCount({
  clusterName,
  serviceName,
}: GetTaskCountProps) {
  return await modifyTaskCount({
    clusterName,
    serviceName,
    incrememntBy: 0,
  });
}
