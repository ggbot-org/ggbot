import { IAMClient, GetPolicyCommand } from "@aws-sdk/client-iam";
import type {
  GetPolicyCommandInput,
  GetPolicyCommandOutput,
} from "@aws-sdk/client-iam";
import { awsRegion } from "@ggbot2/infrastructure";

const client = new IAMClient({ region: awsRegion });

export const getPolicy = async (
  args: GetPolicyCommandInput
): Promise<GetPolicyCommandOutput> => {
  const command = new GetPolicyCommand(args);
  return await client.send(command);
};
