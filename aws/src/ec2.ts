import {
  DescribeAddressesCommand,
  DescribeAddressesCommandInput,
  DescribeAddressesCommandOutput,
  EC2Client,
} from "@aws-sdk/client-ec2";
import { awsRegion } from "@ggbot2/infrastructure";

export type { Address as ElasticIp } from "@aws-sdk/client-ec2";

const client = new EC2Client({ region: awsRegion });

export type DescribeElasticIpsArgs = Pick<
  DescribeAddressesCommandInput,
  "PublicIps"
>;

export const describeElasticIps = async (
  args: DescribeElasticIpsArgs
): Promise<DescribeAddressesCommandOutput> => {
  const command = new DescribeAddressesCommand(args);
  return await client.send(command);
};
