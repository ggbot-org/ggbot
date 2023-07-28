import {
  GetPolicyCommand,
  GetPolicyCommandInput,
  GetPolicyCommandOutput,
  IAMClient,
} from "@aws-sdk/client-iam";
import { awsRegion } from "@ggbot2/infrastructure";

const client = new IAMClient({ region: awsRegion });

export type GetPolicyArgs = GetPolicyCommandInput;

export const getPolicy = async (
  args: GetPolicyArgs
): Promise<GetPolicyCommandOutput> => {
  const command = new GetPolicyCommand(args);
  return await client.send(command);
};
